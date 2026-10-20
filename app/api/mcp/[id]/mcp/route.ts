import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db/client';
import { projects } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { handleMCPRequest } from '@/services/mcp/runtime';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await initDb();
  const { id: projectId } = await context.params;

  // Verify project exists
  const [project] = await db.select().from(projects).where(eq(projects.id, projectId));
  if (!project) {
    return NextResponse.json(
      {
        jsonrpc: '2.0',
        id: null,
        error: { code: -32000, message: `Project '${projectId}' not found.` },
      },
      { status: 404 }
    );
  }

  // Check Bearer Token if provided
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '').trim();
    if (token !== project.apiKey && token !== process.env.GLOBAL_API_KEY) {
      return NextResponse.json(
        {
          jsonrpc: '2.0',
          id: null,
          error: { code: -32001, message: 'Unauthorized: Invalid Project API Key.' },
        },
        { status: 401 }
      );
    }
  }

  try {
    const rpcBody = await req.json();
    const response = await handleMCPRequest(projectId, rpcBody);
    return NextResponse.json(response);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        jsonrpc: '2.0',
        id: null,
        error: { code: -32700, message: `Parse error: ${errorMsg}` },
      },
      { status: 400 }
    );
  }
}

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await context.params;
  return NextResponse.json({
    status: 'online',
    server: 'Web2MCP Streamable HTTP Server',
    projectId,
    protocolVersion: '2024-11-05',
    docs: 'Send JSON-RPC 2.0 requests via POST to this endpoint.',
  });
}
