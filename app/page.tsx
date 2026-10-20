import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  Terminal,
  Activity,
  Globe,
  CheckCircle2,
  Lock,
  ChevronRight,
  Cpu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { initDb, db } from '@/lib/db/client';
import { projects, tools } from '@/lib/db/schema';

export default async function HomePage() {
  await initDb();
  const allProjects = await db.select().from(projects);
  const allTools = await db.select().from(tools);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 overflow-hidden border-b border-slate-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))]" />

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-xs text-blue-400 font-medium">
            <Sparkles className="h-3.5 w-3.5" /> TinyFish Agent + Model Context Protocol
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Turn Any Website into <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Live, Verified MCP Tools
            </span>{' '}
            for AI Agents
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed">
            Websites are built for humans, not agents. Web2MCP autonomously navigates forms, infers typed schemas, verifies live responses against saved evidence, and generates hosted & stdio MCP servers in minutes.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/projects/new">
              <Button size="lg" className="gap-2 font-semibold shadow-lg shadow-blue-500/20">
                Explore Website & Generate Tools <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-900/80 font-mono text-xs text-slate-300">
              <Terminal className="h-3.5 w-3.5 text-blue-400" /> npx web2mcp add &lt;url&gt;
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Interactive Pipeline */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-2xl font-bold text-white">How Web2MCP Works</h2>
          <p className="text-sm text-slate-400">From a raw human portal to an authenticated Model Context Protocol tool</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-3 relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
              1
            </div>
            <h3 className="font-semibold text-lg text-white">Autonomous Web Exploration</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              TinyFish browser agents navigate complex SPAs, exercise search filters, detect form inputs, and inspect dynamic responses with anti-bot resilience.
            </p>
            <div className="pt-2 text-xs font-mono text-blue-400 flex items-center gap-1">
              <Globe className="h-3.5 w-3.5" /> Portal & DOM Extraction
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-3 relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
              2
            </div>
            <h3 className="font-semibold text-lg text-white">AI Schema Inference & Safety Gate</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              LLMs analyze observed fields to synthesize typed JSON Schemas. Consequential actions (bookings, purchases) are classified with human confirmation gates.
            </p>
            <div className="pt-2 text-xs font-mono text-purple-400 flex items-center gap-1">
              <Cpu className="h-3.5 w-3.5" /> Typed Schemas & Approval Gates
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-3 relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
              3
            </div>
            <h3 className="font-semibold text-lg text-white">Live Validation & Evidence Vault</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Synthetic probes test real pages before deployment. Every run captures an immutable DOM hash and payload trace to instantly detect website redesign drift.
            </p>
            <div className="pt-2 text-xs font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Continuous Health & Drift Detection
            </div>
          </div>
        </div>
      </section>

      {/* Safety Gate Alert Banner */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-amber-300">
                Human-in-the-Loop Safety Gate
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Agents are powerful, but consequential operations shouldn&apos;t run wild. Any generated tool performing bookings, transactions, or state mutations requires explicit confirmation before executing.
              </p>
            </div>
          </div>
          <Badge variant="warning" className="shrink-0 text-xs">
            Zero Unintended Actions
          </Badge>
        </div>
      </section>

      {/* Active Projects Directory */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Generated MCP Projects</h2>
            <p className="text-xs text-slate-400">
              Live websites currently exposed as verified MCP servers
            </p>
          </div>
          <Link href="/projects/new">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs">
              <Sparkles className="h-3 w-3" /> New Website
            </Button>
          </Link>
        </div>

        {allProjects.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
            <p className="text-sm text-slate-400">No websites converted yet.</p>
            <Link href="/projects/new">
              <Button size="sm">Convert Your First Website</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allProjects.map((p) => {
              const projectTools = allTools.filter((t) => t.projectId === p.id);
              const consequentialCount = projectTools.filter((t) => t.requiresApproval).length;

              return (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 hover:border-slate-700 hover:bg-slate-900 transition-all flex flex-col justify-between group space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {p.name}
                      </h3>
                      <Badge variant="success" className="text-[10px]">
                        Active
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-1 font-mono">
                      {p.targetUrl}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span>{projectTools.length} live tools</span>
                    {consequentialCount > 0 && (
                      <span className="text-amber-400 text-[11px]">
                        {consequentialCount} approval-gated
                      </span>
                    )}
                    <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
