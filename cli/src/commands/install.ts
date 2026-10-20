import { initDb, db } from '../../../lib/db/client';
import { projects } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';
import { installToCursor } from '../installers/cursor';
import { installToClaude } from '../installers/claude';
import { installToVSCode } from '../installers/vscode';

const DEFAULT_HOST = (process.env.WEB2MCP_HOST || process.env.NEXT_PUBLIC_APP_URL || 'https://web2mcp.ssh.net.in').replace(/\/$/, '');

export async function installCommand(
  targetIde: string,
  options: { project?: string; endpoint?: string; apiKey?: string; name?: string; host?: string }
) {
  let endpoint = options.endpoint;
  let apiKey = options.apiKey;
  let serverName = options.name;
  const host = (options.host || DEFAULT_HOST).replace(/\/$/, '');

  if (options.project) {
    try {
      await initDb();
      const [proj] = await db.select().from(projects).where(eq(projects.id, options.project));
      if (proj) {
        endpoint = endpoint || `${host}/api/mcp/${proj.id}/mcp`;
        apiKey = apiKey || proj.apiKey;
        if (!serverName) {
          const cleanSlug = proj.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 32);
          serverName = `web2mcp-${cleanSlug || 'server'}`;
        }
      } else {
        endpoint = endpoint || `${host}/api/mcp/${options.project}/mcp`;
        if (!serverName) {
          serverName = `web2mcp-${options.project}`;
        }
      }
    } catch {
      endpoint = endpoint || `${host}/api/mcp/${options.project}/mcp`;
      if (!serverName) {
        serverName = `web2mcp-${options.project}`;
      }
    }
  }

  if (!serverName) {
    serverName = 'web2mcp';
  }

  if (!endpoint) {
    endpoint = `${host}/api/mcp/default/mcp`;
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
    if (apiKey) {
      console.log(`Auth Header:       Bearer ${apiKey.slice(0, 10)}...`);
    }
    console.log(`\nRestart your ${targetIde} application to begin using your live MCP tools.`);
  } else {
    console.error(`❌ Installation failed: ${result.error}`);
    process.exit(1);
  }
}
