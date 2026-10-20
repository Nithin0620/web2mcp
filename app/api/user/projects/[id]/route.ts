import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db/client';
import { projects } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getSessionFromTokens } from '@/lib/auth/session';
import crypto from 'crypto';

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await initDb();
  const { id: projectId } = await context.params;

  try {
    const userSessionToken = req.cookies.get('web2mcp_session')?.value;
    const anonSessionToken = req.cookies.get('web2mcp_anon')?.value;
    const session = await getSessionFromTokens(userSessionToken, anonSessionToken);

    if (session.type !== 'user' || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, session.user.id)));

    if (!project) {
      return NextResponse.json({ error: 'Project not found or not owned by you.' }, { status: 404 });
    }

    // Delete project (cascade deletes tools & evidence)
    await db.delete(projects).where(eq(projects.id, projectId));

    return NextResponse.json({ success: true, message: 'MCP project deleted successfully.' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await initDb();
  const { id: projectId } = await context.params;

  try {
    const userSessionToken = req.cookies.get('web2mcp_session')?.value;
    const anonSessionToken = req.cookies.get('web2mcp_anon')?.value;
    const session = await getSessionFromTokens(userSessionToken, anonSessionToken);

    if (session.type !== 'user' || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, session.user.id)));

    if (!project) {
      return NextResponse.json({ error: 'Project not found or not owned by you.' }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));

    // If requesting new API key
    if (body.action === 'regenerate_key') {
      const newApiKey = `mcp_${crypto.randomBytes(16).toString('hex')}`;
      await db
        .update(projects)
        .set({ apiKey: newApiKey, updatedAt: new Date() })
        .where(eq(projects.id, projectId));

      return NextResponse.json({ success: true, apiKey: newApiKey });
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
