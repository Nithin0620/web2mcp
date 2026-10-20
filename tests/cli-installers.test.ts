import { describe, it, expect } from 'vitest';
import { updateCursorConfig } from '../cli/src/installers/cursor';
import { updateClaudeConfig } from '../cli/src/installers/claude';
import { updateVSCodeConfig } from '../cli/src/installers/vscode';

describe('IDE MCP Installers', () => {
  it('updateCursorConfig merges Web2MCP server into mcpServers dictionary', () => {
    const existingConfig = {
      mcpServers: {
        existing_tool: { command: 'node', args: ['existing.js'] },
      },
    };

    const updated = updateCursorConfig(existingConfig, 'web2mcp-skyway', 'https://web2mcp.ssh.net.in/api/mcp/proj-123/mcp', 'key_123');
    expect(updated.mcpServers['web2mcp-skyway']).toBeDefined();
    expect(updated.mcpServers['web2mcp-skyway'].url).toBe('https://web2mcp.ssh.net.in/api/mcp/proj-123/mcp');
    expect(updated.mcpServers['web2mcp-skyway'].headers['Authorization']).toBe('Bearer key_123');
    expect(updated.mcpServers.existing_tool).toBeDefined();
  });

  it('updateClaudeConfig generates stdio or sse transport server block', () => {
    const existingConfig = {
      mcpServers: {},
    };

    const updated = updateClaudeConfig(existingConfig, 'web2mcp-tenders', 'https://web2mcp.ssh.net.in/api/mcp/proj-tender/mcp', 'key_tender');
    expect(updated.mcpServers['web2mcp-tenders']).toBeDefined();
    expect(updated.mcpServers['web2mcp-tenders'].headers.Authorization).toBe('Bearer key_tender');
  });

  it('updateVSCodeConfig merges Web2MCP server into mcp.servers dictionary', () => {
    const existingConfig = {
      'editor.fontSize': 14,
    };

    const updated = updateVSCodeConfig(existingConfig, 'web2mcp-finance', 'https://web2mcp.ssh.net.in/api/mcp/proj-fin/mcp', 'key_fin');
    expect(updated['mcp.servers']['web2mcp-finance']).toBeDefined();
    expect(updated['mcp.servers']['web2mcp-finance'].url).toBe('https://web2mcp.ssh.net.in/api/mcp/proj-fin/mcp');
    expect(updated['mcp.servers']['web2mcp-finance'].headers.Authorization).toBe('Bearer key_fin');
    expect(updated['editor.fontSize']).toBe(14);
  });
});
