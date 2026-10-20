import { initDb, db } from '../../../lib/db/client';
import { projects } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';
import { installToCursor } from '../installers/cursor';
import { installToClaude } from '../installers/claude';
import { installToVSCode } from '../installers/vscode';

export async function installCommand(
  targetIde: string,
  options: { project?: string; endpoint?: string; apiKey?: string; name?: string }
) {
  await initDb();
  let endpoint = options.endpoint;
  let apiKey = options.apiKey;
  let serverName = options.name || 'web2mcp';

  if (options.project) {
    const [proj] = await db.select().from(projects).where(eq(projects.id, options.project));
    if (proj) {
      endpoint = endpoint || `http://localhost:3000/api/mcp/${proj.id}/mcp`;
      apiKey = apiKey || proj.apiKey;
      serverName = `web2mcp-${proj.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    }
  }

  if (!endpoint) {
    endpoint = 'http://localhost:3000/api/mcp/default/mcp';
  }

  const normalized = targetIde.toLowerCase();
  let result: { success: boolean; path: string; error?: string };

  if (normalized === 'cursor') {
    result = installToCursor(serverName, endpoint, apiKey);
  } else if (normalized === 'claude') {
    result = installToClaude(serverName, endpoint, apiKey);
  } else if (normalized === 'vscode') {
    result = installToVSCode(serverName, endpoint, apiKey);
  } else {
    console.error(`❌ Unsupported IDE '${targetIde}'. Supported targets: cursor, claude, vscode`);
    process.exit(1);
  }

  if (result.success) {
    console.log(`\n✅ Successfully installed '${serverName}' to ${targetIde}!`);
    console.log(`Config written to: ${result.path}`);
    console.log(`Endpoint:          ${endpoint}`);
    console.log(`\nRestart your ${targetIde} application to begin using your live MCP tools.`);
  } else {
    console.error(`❌ Installation failed: ${result.error}`);
    process.exit(1);
  }
}
