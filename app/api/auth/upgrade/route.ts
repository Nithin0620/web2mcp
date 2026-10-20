import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromTokens, upgradeUserTier } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    const userSessionToken = req.cookies.get('web2mcp_session')?.value;
    const anonSessionToken = req.cookies.get('web2mcp_anon')?.value;

    const session = await getSessionFromTokens(userSessionToken, anonSessionToken);

    if (session.type !== 'user' || !session.user) {
      return NextResponse.json(
        { error: 'Please create an account or log in before upgrading your plan.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { plan } = body; // 'starter' | 'pro'

    let tier: 'starter' | 'pro' = 'starter';
    let additionalCredits = 50;

    if (plan === 'pro') {
      tier = 'pro';
      additionalCredits = 500;
    } else if (plan === 'starter') {
      tier = 'starter';
      additionalCredits = 50;
    } else {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    const result = await upgradeUserTier(session.user.id, tier, additionalCredits);

    return NextResponse.json({
      success: true,
      message: `Successfully upgraded to ${tier.toUpperCase()} plan! Added ${additionalCredits} credits.`,
      tier: result.tier,
      creditsRemaining: result.newCredits,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
