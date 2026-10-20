import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db, initDb } from '@/lib/db/client';
import { users } from '@/lib/db/schema';
import { verifyPassword, createUserSession } from '@/lib/auth/session';

export async function POST(req: Request) {
  try {
    await initDb();
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const [user] = await db.select().from(users).where(eq(users.email, cleanEmail)).all();

    if (!user || !verifyPassword(String(password), user.passwordHash)) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const sessionId = await createUserSession(user.id);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        tier: user.tier,
        creditsRemaining: user.creditsRemaining,
        creditsUsed: user.creditsUsed,
      },
    });

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
    return NextResponse.json({ error: `Login error: ${msg}` }, { status: 500 });
  }
}
