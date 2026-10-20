import { describe, it, expect, beforeAll } from 'vitest';
import { initDb, db } from '../lib/db/client';
import { projects, tools } from '../lib/db/schema';
import { handleMCPRequest } from '../services/mcp/runtime';
import { requestApprovalToken, verifyApprovalToken } from '../services/mcp/safety-gate';
import type { GeneratedTool } from '../types/platform';

describe('MCP Runtime & Safety Gate', () => {
  const testProjectId = 'proj-mcp-' + Date.now();
  const testApiKey = 'mcp_secret_key_123';

  const searchTool: GeneratedTool = {
    id: 'tool-mcp-search-' + Math.random().toString(36).substring(2),
    projectId: testProjectId,
    name: 'search_flights',
    description: 'Search flight listings',
    category: 'search',
    parameters: {
      type: 'object',
      properties: {
        origin: { type: 'string', description: 'Origin' },
      },
      required: ['origin'],
    },
    handlerType: 'mock',
    handlerConfig: {},
    requiresApproval: false,
    riskLevel: 'read_only',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const bookingTool: GeneratedTool = {
    id: 'tool-mcp-booking-' + Math.random().toString(36).substring(2),
    projectId: testProjectId,
    name: 'book_flight',
    description: 'Book flight ticket',
    category: 'action',
    parameters: {
      type: 'object',
      properties: {
        flightId: { type: 'string', description: 'Flight ID' },
      },
      required: ['flightId'],
    },
    handlerType: 'mock',
    handlerConfig: {},
    requiresApproval: true,
    riskLevel: 'consequential',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeAll(async () => {
    await initDb();
    await db.insert(projects).values({
      id: testProjectId,
      name: 'SkyPort MCP Test',
      targetUrl: 'https://skyport.com',
      status: 'ready',
      apiKey: testApiKey,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await db.insert(tools).values([
      {
        id: searchTool.id,
        projectId: testProjectId,
        name: searchTool.name,
        description: searchTool.description,
        category: searchTool.category,
        parameters: JSON.stringify(searchTool.parameters),
        handlerType: searchTool.handlerType,
        handlerConfig: JSON.stringify(searchTool.handlerConfig),
        requiresApproval: false,
        riskLevel: 'read_only',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: bookingTool.id,
        projectId: testProjectId,
        name: bookingTool.name,
        description: bookingTool.description,
        category: bookingTool.category,
        parameters: JSON.stringify(bookingTool.parameters),
        handlerType: bookingTool.handlerType,
        handlerConfig: JSON.stringify(bookingTool.handlerConfig),
        requiresApproval: true,
        riskLevel: 'consequential',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  });

  it('Safety Gate generates and validates token for consequential actions', () => {
    const { token, message } = requestApprovalToken('book_flight', testProjectId);
    expect(token).toBeDefined();
    expect(message).toContain('Safety Gate Alert');

    expect(verifyApprovalToken('invalid_token', 'book_flight')).toBe(false);
    expect(verifyApprovalToken(token, 'book_flight')).toBe(true);
  });

  it('MCP Runtime handles "initialize" request', async () => {
    const initResponse = await handleMCPRequest(testProjectId, {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        clientInfo: { name: 'Claude Desktop', version: '1.0' },
      },
    });

    expect(initResponse.result).toBeDefined();
    expect(initResponse.result.serverInfo.name).toBe('Web2MCP-Server');
    expect(initResponse.result.capabilities.tools).toBeDefined();
  });

  it('MCP Runtime handles "tools/list" request and returns typed schemas', async () => {
    const listResponse = await handleMCPRequest(testProjectId, {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list',
    });

    expect(listResponse.result).toBeDefined();
    expect(listResponse.result.tools.length).toBe(2);
    const search = listResponse.result.tools.find((t: any) => t.name === 'search_flights');
    expect(search).toBeDefined();
    expect(search.inputSchema.properties.origin).toBeDefined();
  });

  it('MCP Runtime intercepts consequential tool call without approval token', async () => {
    const callResponse = await handleMCPRequest(testProjectId, {
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: 'book_flight',
        arguments: { flightId: 'FL-999' },
      },
    });

    expect(callResponse.result).toBeDefined();
    expect(callResponse.result.content[0].text).toContain('Safety Gate Alert');
    expect(callResponse.result.requiresApproval).toBe(true);
  });

  it('MCP Runtime executes safe tool call and returns structured text', async () => {
    const callResponse = await handleMCPRequest(testProjectId, {
      jsonrpc: '2.0',
      id: 4,
      method: 'tools/call',
      params: {
        name: 'search_flights',
        arguments: { origin: 'NYC' },
      },
    });

    expect(callResponse.result).toBeDefined();
    expect(callResponse.result.isError).toBe(false);
    expect(callResponse.result.content[0].type).toBe('text');
  });
});
