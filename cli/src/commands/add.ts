import { initDb, db } from '../../../lib/db/client';
import { projects, tools } from '../../../lib/db/schema';
import { exploreWebsite } from '../../../services/crawler/explorer';
import { inferToolsFromExploration } from '../../../services/ai/schema-inference';
import { executeProbe } from '../../../services/validation/probe-runner';
import { recordEvidence } from '../../../services/validation/evidence-vault';
import crypto from 'crypto';

const DEFAULT_HOST = (process.env.WEB2MCP_HOST || process.env.NEXT_PUBLIC_APP_URL || 'https://web2mcp.ssh.net.in').replace(/\/$/, '');

export async function addCommand(url: string, options: { name?: string; goal?: string; host?: string; skipProbe?: boolean }) {
  await initDb();
  const host = (options.host || DEFAULT_HOST).replace(/\/$/, '');
  console.log(`\n🚀 [Web2MCP] Exploring website: ${url}`);
  if (options.goal) {
    console.log(`🎯 Goal: ${options.goal}`);
  }

  const projectId = `proj-${crypto.randomBytes(4).toString('hex')}`;
  const apiKey = `mcp_${crypto.randomBytes(16).toString('hex')}`;

  const exploration = await exploreWebsite(url, options.goal, {
    onProgress: (evt) => {
      console.log(`  [${evt.step}] ${evt.message}`);
    },
  });

  console.log(`\n🧠 Synthesizing typed MCP tools with AI inference...`);
  const inferredTools = await inferToolsFromExploration(exploration, projectId, options.goal);

  // Save project
  const now = new Date();
  const projectName = options.name || exploration.title || new URL(url).hostname;

  await db.insert(projects).values({
    id: projectId,
    name: projectName,
    targetUrl: url,
    goal: options.goal || null,
    status: 'ready',
    apiKey,
    createdAt: now,
    updatedAt: now,
  });

  // Save tools & run initial validation
  for (const tool of inferredTools) {
    await db.insert(tools).values({
      id: tool.id,
      projectId: tool.projectId,
      name: tool.name,
      description: tool.description,
      category: tool.category,
      parameters: JSON.stringify(tool.parameters),
      handlerType: tool.handlerType,
      handlerConfig: JSON.stringify(tool.handlerConfig),
      requiresApproval: tool.requiresApproval,
      riskLevel: tool.riskLevel,
      status: tool.status,
      createdAt: now,
      updatedAt: now,
    });

    if (!options.skipProbe) {
      process.stdout.write(`  🔬 Validating ${tool.name}... `);
      const probeResult = await executeProbe(tool);
      await recordEvidence({
        projectId,
        toolId: tool.id,
        toolName: tool.name,
        probeInput: probeResult.input,
        sampleOutput: probeResult.output,
        domHash: probeResult.domHash,
        status: probeResult.status,
        latencyMs: probeResult.latencyMs,
      });
      console.log(`✓ ${probeResult.status} (${probeResult.latencyMs}ms)`);
    }
  }

  console.log(`\n✨ Successfully created Web2MCP Project!`);
  console.log(`--------------------------------------------------------------------------------`);
  console.log(`Project ID:   ${projectId}`);
  console.log(`Name:         ${projectName}`);
  console.log(`Target URL:   ${url}`);
  console.log(`API Key:      ${apiKey}`);
  console.log(`MCP Endpoint: ${host}/api/mcp/${projectId}/mcp`);
  console.log(`--------------------------------------------------------------------------------`);
  console.log(`Generated ${inferredTools.length} Live MCP Tools:`);
  for (const t of inferredTools) {
    const safetyBadge = t.requiresApproval ? ' [⚠️ REQUIRES APPROVAL]' : ' [✓ READ-ONLY]';
    console.log(`  • ${t.name}(${Object.keys(t.parameters.properties).join(', ')})${safetyBadge}`);
    console.log(`    ↳ ${t.description}`);
  }
  console.log(`\n💡 To connect to Cursor / Claude Desktop / VS Code, run:`);
  console.log(`   web2mcp install cursor --project ${projectId}${options.host ? ` --host ${options.host}` : ''}`);
  console.log(`   web2mcp install claude --project ${projectId}${options.host ? ` --host ${options.host}` : ''}`);
}
