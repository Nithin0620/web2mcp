import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromTokens } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  try {
    const userSessionToken = req.cookies.get('web2mcp_session')?.value;
    const anonSessionToken = req.cookies.get('web2mcp_anon')?.value;

    const session = await getSessionFromTokens(userSessionToken, anonSessionToken);

    const response = NextResponse.json({
      authenticated: session.type === 'user',
      type: session.type,
      user: session.user || null,
      creditsRemaining: session.creditsRemaining,
      tier: session.tier,
    });

    // If anonymous and cookie not set or changed, set it
    if (session.type === 'anonymous' && session.anonId && (!anonSessionToken || anonSessionToken !== session.anonId)) {
      response.cookies.set('web2mcp_anon', session.anonId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 365 * 24 * 60 * 60, // 1 year
      });
    }

    return response;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
