import { describe, it, expect, beforeAll } from 'vitest';
import { initDb, db } from '../lib/db/client';
import { projects, tools } from '../lib/db/schema';
import { eq } from 'drizzle-orm';
import { FallbackDriver } from '../services/crawler/fallback-driver';
import { inferToolsFromExploration } from '../services/ai/schema-inference';
import { executeProbe } from '../services/validation/probe-runner';
import { recordEvidence, getEvidenceForProject, calculateHealthScore } from '../services/validation/evidence-vault';
import { handleMCPRequest } from '../services/mcp/runtime';
import { updateCursorConfig } from '../cli/src/installers/cursor';
import { updateClaudeConfig } from '../cli/src/installers/claude';

describe('Web2MCP End-to-End System Test', () => {
  const e2eProjectId = 'proj-e2e-' + Date.now();
  const targetUrl = 'https://e2e-flights-portal.test';
  const mockHtml = `
    <!DOCTYPE html>
    <html>
      <head><title>AeroJet Travel Portal</title></head>
      <body>
        <h1>Book Flights with AeroJet</h1>
        <form id="flight-search" action="/search" method="GET">
          <input name="origin" placeholder="Origin Airport" required />
          <input name="destination" placeholder="Destination Airport" required />
          <input name="departureDate" type="date" required />
          <select name="cabinClass">
            <option value="economy">Economy</option>
            <option value="business">Business</option>
          </select>
          <button type="submit">Search Available Flights</button>
        </form>

        <form id="flight-booking" action="/book" method="POST">
          <input name="flightId" required />
          <input name="passenger" required />
          <button type="submit">Complete Flight Reservation</button>
        </form>

        <div class="flight-cards">
          <div class="card"><h3>Flight AJ-101</h3><p>$280</p></div>
          <div class="card"><h3>Flight AJ-202</h3><p>$340</p></div>
        </div>
      </body>
    </html>
  `;

  beforeAll(async () => {
    await initDb();
  });

  it('Pipeline Step 1: Explores website and extracts semantic DOM structures', async () => {
    const driver = new FallbackDriver();
    const exploration = await driver.parseHtmlContent(targetUrl, mockHtml);

    expect(exploration.title).toBe('AeroJet Travel Portal');
    expect(exploration.forms.length).toBe(2);
    expect(exploration.listContainers.length).toBeGreaterThan(0);

    // Save project
    await db.insert(projects).values({
      id: e2eProjectId,
      name: exploration.title,
      targetUrl,
      goal: 'Find low-fare flights and book tickets',
      status: 'ready',
      apiKey: 'key_e2e_secret',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it('Pipeline Step 2: AI infers strongly-typed tools & safety classifications', async () => {
    const driver = new FallbackDriver();
    const exploration = await driver.parseHtmlContent(targetUrl, mockHtml);
    const inferred = await inferToolsFromExploration(exploration, e2eProjectId, 'Find flights');

    expect(inferred.length).toBeGreaterThanOrEqual(3);

    const searchTool = inferred.find(t => t.category === 'search');
    expect(searchTool).toBeDefined();
    expect(searchTool?.requiresApproval).toBe(false);
    expect(searchTool?.parameters.properties.origin).toBeDefined();

    const bookingTool = inferred.find(t => t.requiresApproval);
    expect(bookingTool).toBeDefined();
    expect(bookingTool?.riskLevel).toBe('consequential');

    // Persist tools
    for (const tool of inferred) {
      await db.insert(tools).values({
        id: tool.id,
        projectId: e2eProjectId,
        name: tool.name,
        description: tool.description,
        category: tool.category,
        parameters: JSON.stringify(tool.parameters),
        handlerType: 'mock',
        handlerConfig: JSON.stringify(tool.handlerConfig),
        requiresApproval: tool.requiresApproval,
        riskLevel: tool.riskLevel,
        status: tool.status,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  });

  it('Pipeline Step 3: Executes live validation probes and archives evidence', async () => {
    const projectTools = await db.select().from(tools).where(eq(tools.projectId, e2eProjectId));
    const searchToolRow = projectTools.find((t) => t.category === 'search');

    const searchTool = {
      ...searchToolRow,
      parameters: JSON.parse(searchToolRow.parameters),
      handlerConfig: JSON.parse(searchToolRow.handlerConfig),
      requiresApproval: Boolean(searchToolRow.requiresApproval),
    };

    const probeResult = await executeProbe(searchTool as any);
    expect(probeResult.status).toBe('verified');

    const recorded = await recordEvidence({
      projectId: e2eProjectId,
      toolId: searchTool.id,
      toolName: searchTool.name,
      probeInput: probeResult.input,
      sampleOutput: probeResult.output,
      domHash: probeResult.domHash,
      status: probeResult.status,
      latencyMs: probeResult.latencyMs,
    });

    expect(recorded.id).toBeDefined();

    const vaultEntries = await getEvidenceForProject(e2eProjectId);
    expect(vaultEntries.length).toBeGreaterThanOrEqual(1);

    const health = calculateHealthScore(vaultEntries);
    expect(health.score).toBe(100);
    expect(health.status).toBe('healthy');
  });

  it('Pipeline Step 4: Exposes standard MCP protocol and enforces Safety Gate', async () => {
    // 1. tools/list
    const listRes = await handleMCPRequest(e2eProjectId, {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list',
    });
    expect(listRes.result.tools.length).toBeGreaterThanOrEqual(2);

    // 2. Safe tool call (search_flights)
    const searchToolObj = listRes.result.tools.find((t: any) => t.name.startsWith('search_'));
    const callRes = await handleMCPRequest(e2eProjectId, {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: searchToolObj.name,
        arguments: { origin: 'SFO' },
      },
    });
    expect(callRes.result.isError).toBe(false);

    // 3. Consequential tool call without token -> Safety Gate Intercepts
    const bookingToolObj = listRes.result.tools.find((t: any) => t.name.startsWith('book_'));
    const gateRes = await handleMCPRequest(e2eProjectId, {
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: bookingToolObj.name,
        arguments: { flightId: 'FL-999' },
      },
    });
    expect(gateRes.result.requiresApproval).toBe(true);
    expect(gateRes.result.approvalToken).toBeDefined();

    // 4. Consequential tool call WITH token -> Passes
    const passRes = await handleMCPRequest(e2eProjectId, {
      jsonrpc: '2.0',
      id: 4,
      method: 'tools/call',
      params: {
        name: bookingToolObj.name,
        arguments: {
          flightId: 'FL-999',
          approvalToken: gateRes.result.approvalToken,
        },
      },
    });
    expect(passRes.result.requiresApproval).toBeFalsy();
    expect(passRes.result.isError).toBe(false);
  });

  it('Pipeline Step 5: Generates valid IDE configuration files for Cursor and Claude', () => {
    const cursorConfig = updateCursorConfig(
      {},
      'web2mcp-aerojet',
      `http://localhost:3000/api/mcp/${e2eProjectId}/mcp`,
      'key_e2e_secret'
    );
    expect(cursorConfig.mcpServers['web2mcp-aerojet'].url).toContain(e2eProjectId);

    const claudeConfig = updateClaudeConfig(
      {},
      'web2mcp-aerojet',
      `http://localhost:3000/api/mcp/${e2eProjectId}/mcp`,
      'key_e2e_secret'
    );
    expect(claudeConfig.mcpServers['web2mcp-aerojet'].headers.Authorization).toBe('Bearer key_e2e_secret');
  });
});
