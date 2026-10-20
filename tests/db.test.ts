import { describe, it, expect, beforeAll } from 'vitest';
import { initDb, db } from '../lib/db/client';
import { projects, tools, evidence } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

describe('Database Schema & Operations', () => {
  beforeAll(async () => {
    await initDb();
  });

  it('should insert a project and retrieve it', async () => {
    const testProjectId = 'test-proj-' + Date.now();
    await db.insert(projects).values({
      id: testProjectId,
      name: 'Flight Booking Portal',
      targetUrl: 'https://example.com/flights',
      goal: 'Search flights and get prices',
      status: 'ready',
      apiKey: 'key_' + Math.random().toString(36).substring(2),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const [found] = await db.select().from(projects).where(eq(projects.id, testProjectId));
    expect(found).toBeDefined();
    expect(found.name).toBe('Flight Booking Portal');
    expect(found.targetUrl).toBe('https://example.com/flights');
  });

  it('should insert a tool linked to a project', async () => {
    const testProjectId = 'test-proj-tool-' + Date.now();
    await db.insert(projects).values({
      id: testProjectId,
      name: 'Job Board',
      targetUrl: 'https://example.com/jobs',
      status: 'ready',
      apiKey: 'key_job',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const toolId = 'tool-' + Date.now();
    await db.insert(tools).values({
      id: toolId,
      projectId: testProjectId,
      name: 'search_jobs',
      description: 'Search open job listings',
      category: 'search',
      parameters: JSON.stringify({
        type: 'object',
        properties: { query: { type: 'string', description: 'Job role' } },
        required: ['query'],
      }),
      handlerType: 'selector',
      handlerConfig: JSON.stringify({ itemSelector: '.job-card' }),
      requiresApproval: false,
      riskLevel: 'read_only',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const [tool] = await db.select().from(tools).where(eq(tools.id, toolId));
    expect(tool).toBeDefined();
    expect(tool.name).toBe('search_jobs');
    expect(tool.requiresApproval).toBe(false);
  });

  it('should insert an evidence record and verify cascade delete', async () => {
    const testProjectId = 'test-proj-cascade-' + Date.now();
    await db.insert(projects).values({
      id: testProjectId,
      name: 'Cascade Test',
      targetUrl: 'https://example.com/cascade',
      status: 'ready',
      apiKey: 'key_cascade',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const toolId = 'tool-cascade-' + Date.now();
    await db.insert(tools).values({
      id: toolId,
      projectId: testProjectId,
      name: 'sample_tool',
      description: 'Sample description',
      parameters: '{}',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const evidenceId = 'ev-' + Date.now();
    await db.insert(evidence).values({
      id: evidenceId,
      projectId: testProjectId,
      toolId: toolId,
      toolName: 'sample_tool',
      probeInput: JSON.stringify({ q: 'engineer' }),
      sampleOutput: JSON.stringify([{ title: 'Lead Engineer' }]),
      domHash: 'hash_abc123',
      status: 'verified',
      latencyMs: 142,
      createdAt: new Date(),
    });

    const [ev] = await db.select().from(evidence).where(eq(evidence.id, evidenceId));
    expect(ev).toBeDefined();
    expect(ev.status).toBe('verified');

    // Delete project -> should cascade delete tools and evidence
    await db.delete(projects).where(eq(projects.id, testProjectId));

    const toolAfter = await db.select().from(tools).where(eq(tools.id, toolId));
    expect(toolAfter.length).toBe(0);

    const evAfter = await db.select().from(evidence).where(eq(evidence.id, evidenceId));
    expect(evAfter.length).toBe(0);
  });
});
