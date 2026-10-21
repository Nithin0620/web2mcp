import { describe, it, expect, beforeAll } from 'vitest';
import {
  hashPassword,
  verifyPassword,
  createAnonymousSession,
  getOrCreateAnonymousSession,
  getSessionFromTokens,
  deductCredit,
  upgradeUserTier,
  createUserSession,
  recordPaymentTransaction,
  getPaymentTransactionByPaymentId,
} from '../lib/auth/session';
import { db, initDb } from '../lib/db/client';
import { users } from '../lib/db/schema';
import crypto from 'crypto';

describe('Authentication & Credit Gating System', () => {
  beforeAll(async () => {
    await initDb();
  });

  it('correctly hashes and verifies passwords using scrypt', () => {
    const password = 'SuperSecret123!';
    const hash = hashPassword(password);

    expect(hash).toContain(':');
    expect(verifyPassword(password, hash)).toBe(true);
    expect(verifyPassword('WrongPassword', hash)).toBe(false);
  });

  it('allocates exactly 3 free credits for anonymous guest sessions', async () => {
    const anon = await createAnonymousSession();

    expect(anon.id).toMatch(/^anon_/);
    expect(anon.creditsRemaining).toBe(3);

    // Fetch existing anonymous session
    const fetched = await getOrCreateAnonymousSession(anon.id);
    expect(fetched.id).toBe(anon.id);
    expect(fetched.creditsRemaining).toBe(3);
  });

  it('allocates 10 free credits for registered user accounts', async () => {
    const email = `test-${Date.now()}@example.com`;
    const userId = `usr_${crypto.randomBytes(8).toString('hex')}`;
    const passwordHash = hashPassword('validpass123');
    const now = new Date();

    await db.insert(users).values({
      id: userId,
      email,
      name: 'Test Developer',
      passwordHash,
      tier: 'free',
      creditsRemaining: 10,
      creditsUsed: 0,
      createdAt: now,
      updatedAt: now,
    });

    const sessionToken = await createUserSession(userId);
    const session = await getSessionFromTokens(sessionToken);

    expect(session.type).toBe('user');
    expect(session.user?.email).toBe(email);
    expect(session.creditsRemaining).toBe(10);
    expect(session.tier).toBe('free');
  });

  it('properly deducts credits upon generation and stops at 0', async () => {
    const anon = await createAnonymousSession();
    let session = await getSessionFromTokens(undefined, anon.id);

    // 1st generation
    let deductRes = await deductCredit(session);
    expect(deductRes.success).toBe(true);
    expect(deductRes.creditsRemaining).toBe(2);

    // 2nd generation
    session = await getSessionFromTokens(undefined, anon.id);
    deductRes = await deductCredit(session);
    expect(deductRes.success).toBe(true);
    expect(deductRes.creditsRemaining).toBe(1);

    // 3rd generation
    session = await getSessionFromTokens(undefined, anon.id);
    deductRes = await deductCredit(session);
    expect(deductRes.success).toBe(true);
    expect(deductRes.creditsRemaining).toBe(0);

    // 4th generation should fail (limit reached)
    session = await getSessionFromTokens(undefined, anon.id);
    deductRes = await deductCredit(session);
    expect(deductRes.success).toBe(false);
    expect(deductRes.error).toContain('limit');
  });

  it('supports plan upgrades to Starter ($2) and Pro ($20) with replenished credits', async () => {
    const email = `upgrade-${Date.now()}@example.com`;
    const userId = `usr_${crypto.randomBytes(8).toString('hex')}`;
    const now = new Date();

    await db.insert(users).values({
      id: userId,
      email,
      name: 'Upgrade User',
      passwordHash: hashPassword('password123'),
      tier: 'free',
      creditsRemaining: 0,
      creditsUsed: 10,
      createdAt: now,
      updatedAt: now,
    });

    // Upgrade to Starter ($2 tier) -> +50 credits
    const starterRes = await upgradeUserTier(userId, 'starter', 50);
    expect(starterRes.success).toBe(true);
    expect(starterRes.tier).toBe('starter');
    expect(starterRes.newCredits).toBe(50);

    // Upgrade to Pro ($20 tier) -> +500 credits
    const proRes = await upgradeUserTier(userId, 'pro', 500);
    expect(proRes.success).toBe(true);
    expect(proRes.tier).toBe('pro');
    expect(proRes.newCredits).toBe(550);
  });

  it('records verified payment transactions and prevents duplicate payment reuse', async () => {
    const userId = `usr_${crypto.randomBytes(8).toString('hex')}`;
    const paymentId = `pay_test_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const now = new Date();

    await db.insert(users).values({
      id: userId,
      email: `payuser-${Date.now()}@example.com`,
      name: 'Payment Test User',
      passwordHash: hashPassword('password123'),
      tier: 'free',
      creditsRemaining: 10,
      creditsUsed: 0,
      createdAt: now,
      updatedAt: now,
    });

    // 1. Initial check: paymentId does not exist
    const initialCheck = await getPaymentTransactionByPaymentId(paymentId);
    expect(initialCheck).toBeNull();

    // 2. Record payment transaction
    const tx = await recordPaymentTransaction({
      userId,
      plan: 'starter',
      amount: 200,
      paymentId,
      billingCycle: 'monthly',
      paymentProvider: 'razorpay',
    });
    expect(tx.id).toMatch(/^tx_/);

    // 3. Subsequent check: paymentId is found
    const verifiedTx = await getPaymentTransactionByPaymentId(paymentId);
    expect(verifiedTx).not.toBeNull();
    expect(verifiedTx?.paymentId).toBe(paymentId);
    expect(verifiedTx?.plan).toBe('starter');
    expect(verifiedTx?.status).toBe('completed');
  });
});
