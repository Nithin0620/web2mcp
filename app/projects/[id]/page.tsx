import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { initDb, db } from '@/lib/db/client';
import { projects, tools, evidence } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { ArrowLeft, ExternalLink, Globe, Sparkles, Key } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProjectDashboardClient } from './dashboard-client';
import type { GeneratedTool, EvidenceRecord } from '@/types/platform';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  await initDb();
  const { id } = await params;

  const [project] = await db.select().from(projects).where(eq(projects.id, id));
  if (!project) {
    notFound();
  }

  const toolRows = await db.select().from(tools).where(eq(tools.projectId, id));
  const evidenceRows = await db
    .select()
    .from(evidence)
    .where(eq(evidence.projectId, id))
    .orderBy(desc(evidence.createdAt))
    .limit(50);

  const parsedTools: GeneratedTool[] = toolRows.map((t) => ({
    id: t.id,
    projectId: t.projectId,
    name: t.name,
    description: t.description,
    category: t.category as any,
    parameters: JSON.parse(t.parameters),
    handlerType: t.handlerType as any,
    handlerConfig: JSON.parse(t.handlerConfig),
    requiresApproval: Boolean(t.requiresApproval),
    riskLevel: t.riskLevel as any,
    status: t.status as any,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  }));

  const parsedEvidence: EvidenceRecord[] = evidenceRows.map((e) => ({
    id: e.id,
    projectId: e.projectId,
    toolId: e.toolId || '',
    toolName: e.toolName,
    probeInput: JSON.parse(e.probeInput),
    sampleOutput: JSON.parse(e.sampleOutput),
    domHash: e.domHash || undefined,
    status: e.status as any,
    latencyMs: e.latencyMs,
    errorMessage: e.errorMessage,
    createdAt: e.createdAt,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Overview
        </Link>
        <Link href="/projects/new">
          <Button size="sm" className="gap-1.5 text-xs">
            <Sparkles className="h-3.5 w-3.5" /> New Project
          </Button>
        </Link>
      </div>

      {/* Project Header Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">{project.name}</h1>
              <Badge variant="success">● Active MCP Server</Badge>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <a
                href={project.targetUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-blue-400 hover:underline"
              >
                <Globe className="h-3.5 w-3.5" /> {project.targetUrl}
                <ExternalLink className="h-3 w-3" />
              </a>
              <span className="flex items-center gap-1">
                <Key className="h-3.5 w-3.5 text-slate-500" />
                API Key: <code className="text-slate-300 bg-slate-950 px-1 rounded">{project.apiKey}</code>
              </span>
              <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <div className="text-xs text-slate-500 uppercase font-mono">Streamable HTTP</div>
              <div className="text-xs font-mono text-emerald-400">/api/mcp/{project.id}/mcp</div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Interactive Tab Controller */}
      <ProjectDashboardClient
        projectId={project.id}
        projectName={project.name}
        apiKey={project.apiKey}
        endpointUrl={`/api/mcp/${project.id}/mcp`}
        initialTools={parsedTools}
        initialEvidence={parsedEvidence}
      />
    </div>
  );
}
