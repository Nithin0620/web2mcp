import { describe, it, expect, beforeAll } from 'vitest';
import { initDb, db } from '../lib/db/client';
import { projects, tools } from '../lib/db/schema';
import { generateSyntheticInput, executeProbe, validateToolOutput } from '../services/validation/probe-runner';
import { recordEvidence, getEvidenceForProject, calculateHealthScore } from '../services/validation/evidence-vault';
import type { GeneratedTool } from '../types/platform';

describe('Probe Runner & Evidence Vault', () => {
  const testProjectId = 'proj-val-' + Date.now();
  const testToolId = 'tool-val-' + Date.now() + '-' + Math.random().toString(36).substring(2);
  const testTool: GeneratedTool = {
    id: testToolId,
    projectId: testProjectId,
    name: 'search_flights',
    description: 'Search flights',
    category: 'search',
    parameters: {
      type: 'object',
      properties: {
        origin: { type: 'string', description: 'Origin city' },
        destination: { type: 'string', description: 'Destination city' },
        cabinClass: { type: 'string', description: 'Class', enum: ['economy', 'business'] },
      },
      required: ['origin', 'destination'],
    },
    handlerType: 'mock',
    handlerConfig: {},
    requiresApproval: false,
    riskLevel: 'read_only',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeAll(async () => {
    await initDb();
    await db.insert(projects).values({
      id: testProjectId,
      name: 'Validation Flight Portal',
      targetUrl: 'https://flights.example.com',
      status: 'ready',
      apiKey: 'key_val_123',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await db.insert(tools).values({
      id: testTool.id,
      projectId: testProjectId,
      name: testTool.name,
      description: testTool.description,
      parameters: JSON.stringify(testTool.parameters),
      handlerType: testTool.handlerType,
      handlerConfig: JSON.stringify(testTool.handlerConfig),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it('generateSyntheticInput produces valid sample arguments matching schema', () => {
    const input = generateSyntheticInput(testTool);
    expect(input.origin).toBeDefined();
    expect(input.destination).toBeDefined();
    expect(['economy', 'business']).toContain(input.cabinClass);
  });

  it('validateToolOutput accurately asserts schema conformity', () => {
    const validOutput = [{ airline: 'Delta', price: '$350' }];
    expect(validateToolOutput(testTool, validOutput).valid).toBe(true);

    const emptyOutput = [];
    expect(validateToolOutput(testTool, emptyOutput).valid).toBe(true);
  });

  it('executeProbe runs test probe and records evidence in the vault', async () => {
    const probeResult = await executeProbe(testTool);
    expect(probeResult.status).toBe('verified');
    expect(probeResult.latencyMs).toBeGreaterThanOrEqual(0);

    const evidenceRecord = await recordEvidence({
      projectId: testProjectId,
      toolId: testTool.id,
      toolName: testTool.name,
      probeInput: probeResult.input,
      sampleOutput: probeResult.output,
      domHash: probeResult.domHash,
      status: probeResult.status,
      latencyMs: probeResult.latencyMs,
    });

    expect(evidenceRecord.id).toBeDefined();
    expect(evidenceRecord.status).toBe('verified');

    const vaultEntries = await getEvidenceForProject(testProjectId);
    expect(vaultEntries.length).toBeGreaterThan(0);
    expect(vaultEntries[0].toolName).toBe('search_flights');

    const health = calculateHealthScore(vaultEntries);
    expect(health.score).toBe(100);
    expect(health.status).toBe('healthy');
  });
});
