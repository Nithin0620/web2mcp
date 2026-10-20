import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { db, initDb } from '@/lib/db/client';
import { users } from '@/lib/db/schema';
import { hashPassword, createUserSession } from '@/lib/auth/session';

export async function POST(req: Request) {
  try {
    await initDb();
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (String(password).length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // Check existing
    const [existing] = await db.select().from(users).where(eq(users.email, cleanEmail)).all();
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please log in.' },
        { status: 409 }
      );
    }

    const userId = `usr_${crypto.randomBytes(12).toString('hex')}`;
    const passwordHash = hashPassword(String(password));
    const now = new Date();

    await db.insert(users).values({
      id: userId,
      email: cleanEmail,
      name: String(name).trim(),
      passwordHash,
      tier: 'free',
      creditsRemaining: 10, // 10 free credits for registered users!
      creditsUsed: 0,
      createdAt: now,
      updatedAt: now,
    });

    const sessionId = await createUserSession(userId);

    const response = NextResponse.json({
      success: true,
      user: {
        id: userId,
        email: cleanEmail,
        name: String(name).trim(),
        tier: 'free',
        creditsRemaining: 10,
        creditsUsed: 0,
      },
      message: 'Account created! 10 free MCP generation credits unlocked.',
    });

    // Set HTTP-only session cookie (30 days)
    response.cookies.set('web2mcp_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Registration error: ${msg}` }, { status: 500 });
  }
}
