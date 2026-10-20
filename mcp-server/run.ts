#!/usr/bin/env node
import readline from 'readline';
import { initDb } from '../lib/db/client';
import { handleMCPRequest } from '../services/mcp/runtime';

async function main() {
  await initDb();

  const args = process.argv.slice(2);
  let projectId = process.env.PROJECT_ID || '';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--project' || args[i] === '-p') {
      projectId = args[i + 1];
    }
  }

  if (!projectId) {
    console.error('Usage: tsx mcp-server/run.ts --project <projectId>');
    process.exit(1);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  rl.on('line', async (line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    try {
      const rpcRequest = JSON.parse(trimmed);
      const response = await handleMCPRequest(projectId, rpcRequest);
      process.stdout.write(JSON.stringify(response) + '\n');
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      process.stdout.write(
        JSON.stringify({
          jsonrpc: '2.0',
          id: null,
          error: { code: -32700, message: `Parse error: ${errorMsg}` },
        }) + '\n'
      );
    }
  });

  process.stderr.write(`[Web2MCP stdio] MCP Server active for project ${projectId}\n`);
}

main().catch((err) => {
  console.error('[Web2MCP stdio] Fatal startup error:', err);
  process.exit(1);
});
