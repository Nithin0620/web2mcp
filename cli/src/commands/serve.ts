import readline from 'readline';
import { initDb } from '../../../lib/db/client';
import { handleMCPRequest } from '../../../services/mcp/runtime';

export async function serveCommand(options: { project: string }) {
  await initDb();
  const projectId = options.project;

  if (!projectId) {
    console.error('❌ Error: --project <projectId> is required.');
    process.exit(1);
  }

  process.stderr.write(`[Web2MCP stdio] Active MCP Server listening on stdio for project: ${projectId}\n`);

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
}
