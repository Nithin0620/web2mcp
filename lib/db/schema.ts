import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  targetUrl: text('target_url').notNull(),
  goal: text('goal'),
  status: text('status').notNull().default('idle'),
  apiKey: text('api_key').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const tools = sqliteTable('tools', {
  id: text('id').primaryKey(),
  projectId: text('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull().default('search'),
  parameters: text('parameters').notNull(), // JSON string
  handlerType: text('handler_type').notNull().default('selector'),
  handlerConfig: text('handler_config').notNull().default('{}'), // JSON string
  requiresApproval: integer('requires_approval', { mode: 'boolean' }).notNull().default(false),
  riskLevel: text('risk_level').notNull().default('read_only'),
  status: text('status').notNull().default('active'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const evidence = sqliteTable('evidence', {
  id: text('id').primaryKey(),
  projectId: text('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  toolId: text('tool_id')
    .references(() => tools.id, { onDelete: 'cascade' }),
  toolName: text('tool_name').notNull(),
  probeInput: text('probe_input').notNull(), // JSON string
  sampleOutput: text('sample_output').notNull(), // JSON string
  domHash: text('dom_hash'),
  status: text('status').notNull().default('verified'),
  latencyMs: integer('latency_ms').notNull().default(0),
  errorMessage: text('error_message'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  tier: text('tier').notNull().default('free'), // 'free' | 'starter' | 'pro' | 'enterprise'
  creditsRemaining: integer('credits_remaining').notNull().default(10),
  creditsUsed: integer('credits_used').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const anonymousSessions = sqliteTable('anonymous_sessions', {
  id: text('id').primaryKey(),
  creditsRemaining: integer('credits_remaining').notNull().default(3),
  creditsUsed: integer('credits_used').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const userSessions = sqliteTable('user_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export type ProjectRow = typeof projects.$inferSelect;
export type InsertProjectRow = typeof projects.$inferInsert;
export type ToolRow = typeof tools.$inferSelect;
export type InsertToolRow = typeof tools.$inferInsert;
export type EvidenceRow = typeof evidence.$inferSelect;
export type InsertEvidenceRow = typeof evidence.$inferInsert;
export type UserRow = typeof users.$inferSelect;
export type InsertUserRow = typeof users.$inferInsert;
export type AnonymousSessionRow = typeof anonymousSessions.$inferSelect;
export type InsertAnonymousSessionRow = typeof anonymousSessions.$inferInsert;
export type UserSessionRow = typeof userSessions.$inferSelect;
export type InsertUserSessionRow = typeof userSessions.$inferInsert;
