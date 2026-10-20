import { createClient, type Client } from '@libsql/client';
import { drizzle, type LibSQLDatabase } from 'drizzle-orm/libsql';
import * as schema from './schema';

const DB_URL = process.env.DATABASE_URL || 'file:./web2mcp.db';

let rawClient: Client | null = null;
let dbInstance: LibSQLDatabase<typeof schema> | null = null;

export function getRawClient(): Client {
  if (!rawClient) {
    rawClient = createClient({
      url: DB_URL,
    });
  }
  return rawClient;
}

export function getDb(): LibSQLDatabase<typeof schema> {
  if (!dbInstance) {
    dbInstance = drizzle(getRawClient(), { schema });
  }
  return dbInstance;
}

export async function initDb(): Promise<void> {
  const client = getRawClient();
  
  // Pragmas
  await client.execute('PRAGMA foreign_keys = ON;');
  await client.execute('PRAGMA journal_mode = WAL;');
  await client.execute('PRAGMA busy_timeout = 5000;');

  // Projects table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      target_url TEXT NOT NULL,
      goal TEXT,
      status TEXT NOT NULL DEFAULT 'idle',
      api_key TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);

  // Tools table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS tools (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'search',
      parameters TEXT NOT NULL,
      handler_type TEXT NOT NULL DEFAULT 'selector',
      handler_config TEXT NOT NULL DEFAULT '{}',
      requires_approval INTEGER NOT NULL DEFAULT 0,
      risk_level TEXT NOT NULL DEFAULT 'read_only',
      status TEXT NOT NULL DEFAULT 'active',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);

  // Evidence table
  await client.execute(`
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
      created_at INTEGER NOT NULL
    );
  `);
}

export const db = new Proxy({} as LibSQLDatabase<typeof schema>, {
  get(_target, prop, receiver) {
    const database = getDb();
    const value = Reflect.get(database, prop, receiver);
    return typeof value === 'function' ? value.bind(database) : value;
  },
});
