import { db } from '../../lib/db/client';
import { evidence, type EvidenceRow } from '../../lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { EvidenceRecord, ValidationStatus } from '../../types/platform';

function rowToRecord(row: EvidenceRow): EvidenceRecord {
  return {
    id: row.id,
    projectId: row.projectId,
    toolId: row.toolId || '',
    toolName: row.toolName,
    probeInput: JSON.parse(row.probeInput),
    sampleOutput: JSON.parse(row.sampleOutput),
    domHash: row.domHash || undefined,
    status: row.status as ValidationStatus,
    latencyMs: row.latencyMs,
    errorMessage: row.errorMessage,
    createdAt: row.createdAt,
  };
}

export async function recordEvidence(
  entry: Omit<EvidenceRecord, 'id' | 'createdAt'>
): Promise<EvidenceRecord> {
  const id = `ev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date();

  await db.insert(evidence).values({
    id,
    projectId: entry.projectId,
    toolId: entry.toolId || null,
    toolName: entry.toolName,
    probeInput: JSON.stringify(entry.probeInput),
    sampleOutput: JSON.stringify(entry.sampleOutput),
    domHash: entry.domHash || null,
    status: entry.status,
    latencyMs: entry.latencyMs,
    errorMessage: entry.errorMessage || null,
    createdAt: now,
  });

  return {
    ...entry,
    id,
    createdAt: now,
  };
}

export async function getEvidenceForProject(projectId: string): Promise<EvidenceRecord[]> {
  const rows = await db
    .select()
    .from(evidence)
    .where(eq(evidence.projectId, projectId))
    .orderBy(desc(evidence.createdAt))
    .limit(50);

  return rows.map(rowToRecord);
}

export function calculateHealthScore(records: EvidenceRecord[]): {
  score: number;
  status: 'healthy' | 'degraded' | 'broken';
  totalRuns: number;
  verifiedRuns: number;
} {
  if (records.length === 0) {
    return { score: 100, status: 'healthy', totalRuns: 0, verifiedRuns: 0 };
  }

  const verified = records.filter(r => r.status === 'verified').length;
  const score = Math.round((verified / records.length) * 100);

  let status: 'healthy' | 'degraded' | 'broken' = 'healthy';
  if (score < 50) {
    status = 'broken';
  } else if (score < 85) {
    status = 'degraded';
  }

  return {
    score,
    status,
    totalRuns: records.length,
    verifiedRuns: verified,
  };
}
