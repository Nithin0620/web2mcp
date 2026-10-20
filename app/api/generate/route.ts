import { NextRequest, NextResponse } from 'next/server';
import { initDb, db } from '@/lib/db/client';
import { projects, tools } from '@/lib/db/schema';
import { exploreWebsite } from '@/services/crawler/explorer';
import { inferToolsFromExploration } from '@/services/ai/schema-inference';
import { executeProbe } from '@/services/validation/probe-runner';
import { recordEvidence } from '@/services/validation/evidence-vault';
import { getSessionFromTokens, deductCredit } from '@/lib/auth/session';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  await initDb();

  try {
    const userSessionToken = req.cookies.get('web2mcp_session')?.value;
    const anonSessionToken = req.cookies.get('web2mcp_anon')?.value;
    const session = await getSessionFromTokens(userSessionToken, anonSessionToken);

    if (session.creditsRemaining <= 0) {
      const isAnon = session.type === 'anonymous';
      return NextResponse.json(
        {
          error: isAnon
            ? 'Free guest credits (3) exhausted. Sign in or create a free account to unlock 10 credits!'
            : 'Account credits exhausted. Please upgrade to Starter ($2/mo) or Pro ($20/mo) for more credits.',
          code: 'CREDIT_LIMIT_REACHED',
          isAnonymous: isAnon,
          creditsRemaining: 0,
          upgradeUrl: '/pricing',
        },
        { status: 402 }
      );
    }

    const { url, goal, name } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'Target URL is required' }, { status: 400 });
    }

    const projectId = `proj-${crypto.randomBytes(4).toString('hex')}`;
    const apiKey = `mcp_${crypto.randomBytes(16).toString('hex')}`;

    // 1. Explore site
    const exploration = await exploreWebsite(url, goal);

    // 2. Infer tools
    const inferredTools = await inferToolsFromExploration(exploration, projectId, goal);

    // 3. Save project
    const now = new Date();
    const projectName = name || exploration.title || new URL(url).hostname;

    await db.insert(projects).values({
      id: projectId,
      name: projectName,
      targetUrl: url,
      goal: goal || null,
      status: 'ready',
      apiKey,
      userId: session.type === 'user' && session.user ? session.user.id : null,
      createdAt: now,
      updatedAt: now,
    });

    // 4. Save tools & run probes
    for (const tool of inferredTools) {
      await db.insert(tools).values({
        id: tool.id,
        projectId: tool.projectId,
        name: tool.name,
        description: tool.description,
        category: tool.category,
        parameters: JSON.stringify(tool.parameters),
        handlerType: tool.handlerType,
        handlerConfig: JSON.stringify(tool.handlerConfig),
        requiresApproval: tool.requiresApproval,
        riskLevel: tool.riskLevel,
        status: tool.status,
        createdAt: now,
        updatedAt: now,
      });

      const probeResult = await executeProbe(tool);
      await recordEvidence({
        projectId,
        toolId: tool.id,
        toolName: tool.name,
        probeInput: probeResult.input,
        sampleOutput: probeResult.output,
        domHash: probeResult.domHash,
        status: probeResult.status,
        latencyMs: probeResult.latencyMs,
      });
    }

    // 5. Deduct 1 credit upon successful generation
    const deductRes = await deductCredit(session);

    const response = NextResponse.json({
      success: true,
      projectId,
      apiKey,
      projectName,
      targetUrl: url,
      toolsCount: inferredTools.length,
      tools: inferredTools,
      endpointUrl: `/api/mcp/${projectId}/mcp`,
      creditsRemaining: deductRes.creditsRemaining,
    });

    // Ensure anonymous session cookie is stored on client
    if (session.type === 'anonymous' && session.anonId && !anonSessionToken) {
      response.cookies.set('web2mcp_anon', session.anonId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 365 * 24 * 60 * 60,
      });
    }

    return response;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
