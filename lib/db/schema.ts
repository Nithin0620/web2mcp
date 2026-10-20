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

export type ProjectRow = typeof projects.$inferSelect;
export type InsertProjectRow = typeof projects.$inferInsert;
export type ToolRow = typeof tools.$inferSelect;
export type InsertToolRow = typeof tools.$inferInsert;
export type EvidenceRow = typeof evidence.$inferSelect;
export type InsertEvidenceRow = typeof evidence.$inferInsert;
