import { describe, it, expect } from 'vitest';
import { updateCursorConfig } from '../cli/src/installers/cursor';
import { updateClaudeConfig } from '../cli/src/installers/claude';

describe('IDE MCP Installers', () => {
  it('updateCursorConfig merges Web2MCP server into mcpServers dictionary', () => {
    const existingConfig = {
      mcpServers: {
        existing_tool: { command: 'node', args: ['existing.js'] },
      },
    };

    const updated = updateCursorConfig(existingConfig, 'web2mcp-skyway', 'http://localhost:3000/api/mcp/proj-123/mcp', 'key_123');
    expect(updated.mcpServers['web2mcp-skyway']).toBeDefined();
    expect(updated.mcpServers['web2mcp-skyway'].url).toBe('http://localhost:3000/api/mcp/proj-123/mcp');
    expect(updated.mcpServers['web2mcp-skyway'].headers['Authorization']).toBe('Bearer key_123');
    expect(updated.mcpServers.existing_tool).toBeDefined();
  });

  it('updateClaudeConfig generates stdio or sse transport server block', () => {
    const existingConfig = {
      mcpServers: {},
    };

    const updated = updateClaudeConfig(existingConfig, 'web2mcp-tenders', 'http://localhost:3000/api/mcp/proj-tender/mcp', 'key_tender');
    expect(updated.mcpServers['web2mcp-tenders']).toBeDefined();
    expect(updated.mcpServers['web2mcp-tenders'].headers.Authorization).toBe('Bearer key_tender');
  });
});
