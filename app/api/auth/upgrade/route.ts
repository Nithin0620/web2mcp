import { NextRequest, NextResponse } from 'next/server';
import {
  getSessionFromTokens,
  upgradeUserTier,
  getPaymentTransactionByPaymentId,
  recordPaymentTransaction,
} from '@/lib/auth/session';

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

    const body = await req.json().catch(() => ({}));
    const { plan, paymentId, paymentMethod, billingCycle, amount } = body;

    if (plan !== 'starter' && plan !== 'pro') {
      return NextResponse.json(
        { error: 'Invalid plan selected. Choose either Starter or Pro.' },
        { status: 400 }
      );
    }

    // Protection 1: Prevent duplicate upgrades to the active plan
    if (session.user.tier === plan) {
      return NextResponse.json(
        {
          error: `You are already subscribed to the ${plan.toUpperCase()} plan. Your credits renew automatically each billing cycle.`,
          code: 'ALREADY_SUBSCRIBED',
        },
        { status: 400 }
      );
    }

    // Protection 2: Prevent downgrade to lower plan while on active Pro
    if (session.user.tier === 'pro' && plan === 'starter') {
      return NextResponse.json(
        {
          error: 'You are currently on the Pro plan, which already includes all Starter benefits and higher allowances.',
          code: 'HIGHER_TIER_ACTIVE',
        },
        { status: 400 }
      );
    }

    // Protection 3: Require valid payment confirmation / transaction token
    if (!paymentId || typeof paymentId !== 'string' || paymentId.trim().length < 6) {
      return NextResponse.json(
        {
          error: 'Payment verification failed. A completed payment transaction is required before credits can be added.',
          code: 'PAYMENT_REQUIRED',
        },
        { status: 402 }
      );
    }

    // Protection 4: Guard against replay attacks or reused payment tokens
    const existingTx = await getPaymentTransactionByPaymentId(paymentId.trim());
    if (existingTx) {
      return NextResponse.json(
        {
          error: 'This payment transaction ID has already been processed and cannot be reused.',
          code: 'TRANSACTION_ALREADY_USED',
        },
        { status: 400 }
      );
    }

    const isPro = plan === 'pro';
    const tier: 'starter' | 'pro' = isPro ? 'pro' : 'starter';
    const additionalCredits = isPro ? 500 : 50;
    const defaultAmount = isPro ? 2000 : 200; // in cents ($20 or $2)

    // Record the payment transaction
    const tx = await recordPaymentTransaction({
      userId: session.user.id,
      plan: tier,
      amount: typeof amount === 'number' ? amount : defaultAmount,
      currency: 'USD',
      billingCycle: billingCycle === 'annual' ? 'annual' : 'monthly',
      paymentId: paymentId.trim(),
      paymentProvider: paymentMethod ? `razorpay_${paymentMethod}` : 'razorpay',
    });

    // Replenish credits and update user tier
    const result = await upgradeUserTier(session.user.id, tier, additionalCredits);

    return NextResponse.json({
      success: true,
      message: `Payment successful! Upgraded to ${tier.toUpperCase()} plan. Added ${additionalCredits} credits.`,
      tier: result.tier,
      creditsRemaining: result.newCredits,
      transactionId: tx.id,
      paymentId: paymentId.trim(),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
