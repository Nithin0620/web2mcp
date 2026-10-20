import { Pool } from '@neondatabase/serverless';
import { drizzle, type NeonDatabase } from 'drizzle-orm/neon-serverless';
import * as schema from './schema';

const DB_URL =
  process.env.DATABASE_URL ||
  'postgresql://neondb_owner:npg_nutzI7W2Sdml@ep-calm-thunder-aouhth7a-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

let poolInstance: Pool | null = null;
let dbInstance: NeonDatabase<typeof schema> | null = null;

export function getPool(): Pool {
  if (!poolInstance) {
    poolInstance = new Pool({ connectionString: DB_URL });
  }
  return poolInstance;
}

export function getDb(): NeonDatabase<typeof schema> {
  if (!dbInstance) {
    dbInstance = drizzle(getPool(), { schema });
  }
  return dbInstance;
}

export async function initDb(): Promise<void> {
  const pool = getPool();

  // Users table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      tier TEXT NOT NULL DEFAULT 'free',
      credits_remaining INTEGER NOT NULL DEFAULT 10,
      credits_used INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL,
      updated_at TIMESTAMP NOT NULL
    );
  `);

  // Projects table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      target_url TEXT NOT NULL,
      goal TEXT,
      status TEXT NOT NULL DEFAULT 'idle',
      api_key TEXT NOT NULL,
      user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP NOT NULL,
      updated_at TIMESTAMP NOT NULL
    );
  `);

  // Tools table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tools (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'search',
      parameters TEXT NOT NULL,
      handler_type TEXT NOT NULL DEFAULT 'selector',
      handler_config TEXT NOT NULL DEFAULT '{}',
      requires_approval BOOLEAN NOT NULL DEFAULT false,
      risk_level TEXT NOT NULL DEFAULT 'read_only',
      status TEXT NOT NULL DEFAULT 'active',
      created_at TIMESTAMP NOT NULL,
      updated_at TIMESTAMP NOT NULL
    );
  `);

  // Evidence table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS evidence (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      tool_id TEXT REFERENCES tools(id) ON DELETE CASCADE,
      tool_name TEXT NOT NULL,
      probe_input TEXT NOT NULL,
      sample_output TEXT NOT NULL,
      dom_hash TEXT,
      status TEXT NOT NULL DEFAULT 'verified',
      latency_ms INTEGER NOT NULL DEFAULT 0,
      error_message TEXT,
      created_at TIMESTAMP NOT NULL
    );
  `);

  // Anonymous Sessions table (3 free credits)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS anonymous_sessions (
      id TEXT PRIMARY KEY,
      credits_remaining INTEGER NOT NULL DEFAULT 3,
      credits_used INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL,
      updated_at TIMESTAMP NOT NULL
    );
  `);

  // User Sessions table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP NOT NULL
    );
  `);
}

export const db = new Proxy({} as NeonDatabase<typeof schema>, {
  get(_target, prop, receiver) {
    const database = getDb();
    const value = Reflect.get(database, prop, receiver);
    return typeof value === 'function' ? value.bind(database) : value;
  },
});
