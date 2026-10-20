import { initDb, db } from '../../../lib/db/client';
import { projects, tools } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';

const DEFAULT_HOST = (process.env.WEB2MCP_HOST || process.env.NEXT_PUBLIC_APP_URL || 'https://web2mcp.ssh.net.in').replace(/\/$/, '');

export async function listCommand(options: { project?: string; host?: string }) {
  await initDb();
  const host = (options.host || DEFAULT_HOST).replace(/\/$/, '');

  if (options.project) {
    const [proj] = await db.select().from(projects).where(eq(projects.id, options.project));
    if (!proj) {
      console.error(`❌ Project '${options.project}' not found.`);
      process.exit(1);
    }

    const projTools = await db.select().from(tools).where(eq(tools.projectId, proj.id));
    console.log(`\n📦 Project: ${proj.name} (${proj.id})`);
    console.log(`Target:   ${proj.targetUrl}`);
    console.log(`Endpoint: ${host}/api/mcp/${proj.id}/mcp`);
    console.log(`\nTools (${projTools.length}):`);
    for (const t of projTools) {
      const badge = t.requiresApproval ? '[⚠️ Approval Required]' : '[✓ Safe/Read]';
      console.log(`  • ${t.name} ${badge}`);
      console.log(`    ↳ ${t.description}`);
    }
    return;
  }

  const allProjects = await db.select().from(projects);
  console.log(`\n📋 Registered Web2MCP Projects (${allProjects.length}):`);
  console.log(`--------------------------------------------------------------------------------`);
  for (const p of allProjects) {
    const pTools = await db.select().from(tools).where(eq(tools.projectId, p.id));
    console.log(`• [${p.id}] ${p.name}`);
    console.log(`  Target: ${p.targetUrl}`);
    console.log(`  Tools:  ${pTools.length} generated`);
    console.log(`  MCP:    ${host}/api/mcp/${p.id}/mcp\n`);
  }
}
