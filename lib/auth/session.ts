import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { db, initDb } from '../db/client';
import { users, userSessions, anonymousSessions, type UserRow } from '../db/schema';

const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export interface SessionContext {
  type: 'user' | 'anonymous';
  user?: {
    id: string;
    email: string;
    name: string;
    tier: string;
    creditsRemaining: number;
    creditsUsed: number;
  };
  anonId?: string;
  creditsRemaining: number;
  tier: string;
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(':');
    if (!salt || !key) return false;
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(Buffer.from(key, 'hex'), derivedKey);
  } catch {
    return false;
  }
}

export async function createAnonymousSession(): Promise<{ id: string; creditsRemaining: number }> {
  await initDb();
  const id = `anon_${crypto.randomBytes(16).toString('hex')}`;
  const now = new Date();

  await db.insert(anonymousSessions).values({
    id,
    creditsRemaining: 3,
    creditsUsed: 0,
    createdAt: now,
    updatedAt: now,
  });

  return { id, creditsRemaining: 3 };
}

export async function getOrCreateAnonymousSession(existingId?: string): Promise<{ id: string; creditsRemaining: number }> {
  await initDb();
  if (existingId) {
    const [row] = await db.select().from(anonymousSessions).where(eq(anonymousSessions.id, existingId));
    if (row) {
      return { id: row.id, creditsRemaining: row.creditsRemaining };
    }
  }
  return createAnonymousSession();
}

export async function createUserSession(userId: string): Promise<string> {
  await initDb();
  const sessionId = `sess_${crypto.randomBytes(24).toString('hex')}`;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_DURATION_MS);

  await db.insert(userSessions).values({
    id: sessionId,
    userId,
    expiresAt,
    createdAt: now,
  });

  return sessionId;
}

export async function getSessionFromTokens(
  userSessionToken?: string,
  anonSessionToken?: string
): Promise<SessionContext> {
  await initDb();

  // 1. Check logged-in user session first
  if (userSessionToken) {
    const [session] = await db
      .select()
      .from(userSessions)
      .where(eq(userSessions.id, userSessionToken));

    if (session && session.expiresAt > new Date()) {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, session.userId));

      if (user) {
        return {
          type: 'user',
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            tier: user.tier,
            creditsRemaining: user.creditsRemaining,
            creditsUsed: user.creditsUsed,
          },
          creditsRemaining: user.creditsRemaining,
          tier: user.tier,
        };
      }
    }
  }

  // 2. Fall back to anonymous session (3 credits)
  const anon = await getOrCreateAnonymousSession(anonSessionToken);
  return {
    type: 'anonymous',
    anonId: anon.id,
    creditsRemaining: anon.creditsRemaining,
    tier: 'free_guest',
  };
}

export async function deductCredit(context: SessionContext): Promise<{ success: boolean; creditsRemaining: number; error?: string }> {
  await initDb();

  if (context.creditsRemaining <= 0) {
    return {
      success: false,
      creditsRemaining: 0,
      error:
        context.type === 'anonymous'
          ? 'Free guest credits limit (3) reached. Please sign in or create an account to unlock 10 free credits!'
          : 'Credit limit reached. Please upgrade to Starter ($2/mo) or Pro ($20/mo) for more credits!',
    };
  }

  if (context.type === 'user' && context.user) {
    const newRemaining = Math.max(0, context.user.creditsRemaining - 1);
    const newUsed = context.user.creditsUsed + 1;

    await db
      .update(users)
      .set({
        creditsRemaining: newRemaining,
        creditsUsed: newUsed,
        updatedAt: new Date(),
      })
      .where(eq(users.id, context.user.id));

    return { success: true, creditsRemaining: newRemaining };
  } else if (context.anonId) {
    const newRemaining = Math.max(0, context.creditsRemaining - 1);

    await db
      .update(anonymousSessions)
      .set({
        creditsRemaining: newRemaining,
        creditsUsed: (3 - newRemaining),
        updatedAt: new Date(),
      })
      .where(eq(anonymousSessions.id, context.anonId));

    return { success: true, creditsRemaining: newRemaining };
  }

  return { success: false, creditsRemaining: 0, error: 'Session not found' };
}

export async function upgradeUserTier(
  userId: string,
  tier: 'starter' | 'pro' | 'enterprise',
  additionalCredits: number
): Promise<{ success: boolean; newCredits: number; tier: string }> {
  await initDb();

  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) throw new Error('User not found');

  const newCredits = user.creditsRemaining + additionalCredits;

  await db
    .update(users)
    .set({
      tier,
      creditsRemaining: newCredits,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  return { success: true, newCredits, tier };
}
