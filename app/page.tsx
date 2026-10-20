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
    <div className="space-y-20 pb-24 bg-white text-[#061B31]">
      {/* Stripe Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden border-b border-[#E5EDF5] bg-gradient-to-b from-[#F8FAFD] via-white to-white">
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D6D9FC] bg-[#D6D9FC]/30 text-xs text-[#533AFD] font-medium shadow-[0_1px_2px_rgba(50,50,93,0.04)]">
            <Sparkles className="h-3.5 w-3.5" /> TinyFish Agent + Model Context Protocol
          </div>

          <h1 className="text-4xl sm:text-6xl font-medium tracking-tight text-[#0A2540] leading-[1.12]">
            Turn Any Website into <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#533AFD] via-[#635BFF] to-[#2E2B8C] bg-clip-text text-transparent font-semibold">
              Live, Verified MCP Tools
            </span>{' '}
            for AI Agents
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#3C4F69] leading-relaxed font-normal">
            Websites are built for humans, not agents. Web2MCP autonomously navigates forms, infers typed schemas, verifies live responses against saved evidence, and generates hosted & stdio MCP servers in minutes.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/projects/new">
              <Button size="lg" className="gap-2 font-medium bg-[#533AFD] hover:bg-[#5452FB] text-white shadow-[0_2px_4px_rgba(83,58,253,0.25)] rounded-md">
                Explore Website & Generate Tools <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-md border border-[#E5EDF5] bg-[#F8FAFD] font-mono text-xs text-[#061B31] shadow-[0_1px_2px_rgba(50,50,93,0.04)]">
              <Terminal className="h-3.5 w-3.5 text-[#533AFD]" /> npx web2mcp add &lt;url&gt;
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Interactive Pipeline */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 scroll-mt-24">
        <div className="text-center space-y-2 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D6D9FC]/40 text-[#533AFD] text-xs font-semibold border border-[#D6D9FC]">
            Step-by-Step Architecture
          </div>
          <h2 className="text-3xl font-bold text-[#0A2540]">How Web2MCP Works</h2>
          <p className="text-sm text-[#50617A]">From a raw human portal to an authenticated Model Context Protocol tool</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-lg border border-[#E5EDF5] bg-[#F8FAFD] p-6 space-y-3 relative overflow-hidden group hover:border-[#CFD8E3] transition-all shadow-[0_2px_4px_rgba(50,50,93,0.04)]">
            <div className="h-10 w-10 rounded-md bg-[#D6D9FC]/50 border border-[#D6D9FC] flex items-center justify-center text-[#533AFD] font-bold text-sm">
              1
            </div>
            <h3 className="font-semibold text-lg text-[#0A2540]">Autonomous Web Exploration</h3>
            <p className="text-xs text-[#3C4F69] leading-relaxed">
              TinyFish browser agents navigate complex SPAs, exercise search filters, detect form inputs, and inspect dynamic responses with anti-bot resilience.
            </p>
            <div className="pt-2 text-xs font-mono text-[#533AFD] flex items-center gap-1">
              <Globe className="h-3.5 w-3.5" /> Portal & DOM Extraction
            </div>
          </div>

          <div className="rounded-lg border border-[#E5EDF5] bg-[#F8FAFD] p-6 space-y-3 relative overflow-hidden group hover:border-[#CFD8E3] transition-all shadow-[0_2px_4px_rgba(50,50,93,0.04)]">
            <div className="h-10 w-10 rounded-md bg-[#D6D9FC]/50 border border-[#D6D9FC] flex items-center justify-center text-[#533AFD] font-bold text-sm">
              2
            </div>
            <h3 className="font-semibold text-lg text-[#0A2540]">AI Schema Inference & Safety Gate</h3>
            <p className="text-xs text-[#3C4F69] leading-relaxed">
              LLMs analyze observed fields to synthesize typed JSON Schemas. Consequential actions (bookings, purchases) are classified with human confirmation gates.
            </p>
            <div className="pt-2 text-xs font-mono text-[#533AFD] flex items-center gap-1">
              <Cpu className="h-3.5 w-3.5" /> Typed Schemas & Approval Gates
            </div>
          </div>

          <div className="rounded-lg border border-[#E5EDF5] bg-[#F8FAFD] p-6 space-y-3 relative overflow-hidden group hover:border-[#CFD8E3] transition-all shadow-[0_2px_4px_rgba(50,50,93,0.04)]">
            <div className="h-10 w-10 rounded-md bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-sm">
              3
            </div>
            <h3 className="font-semibold text-lg text-[#0A2540]">Live Validation & Evidence Vault</h3>
            <p className="text-xs text-[#3C4F69] leading-relaxed">
              Synthetic probes test real pages before deployment. Every run captures an immutable DOM hash and payload trace to instantly detect website redesign drift.
            </p>
            <div className="pt-2 text-xs font-mono text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Continuous Health & Drift Detection
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section id="features" className="max-w-6xl mx-auto px-4 scroll-mt-24 space-y-12">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D6D9FC]/40 text-[#533AFD] text-xs font-semibold border border-[#D6D9FC]">
            Enterprise-Grade Platform
          </div>
          <h2 className="text-3xl font-bold text-[#0A2540]">Production-Ready MCP Capabilities</h2>
          <p className="text-sm text-[#50617A]">Everything AI agents need to operate human websites reliably.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg bg-white border border-[#E5EDF5] space-y-3 shadow-[0_2px_4px_rgba(50,50,93,0.04)] hover:shadow-[0_4px_8px_rgba(50,50,93,0.08)] transition-all">
            <div className="h-10 w-10 rounded-md bg-[#F8FAFD] border border-[#E5EDF5] text-[#533AFD] flex items-center justify-center font-bold">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-[#0A2540] text-base">Streamable HTTP Transport</h3>
            <p className="text-xs text-[#3C4F69] leading-relaxed">
              Standard JSON-RPC 2.0 streaming endpoints compliant with the 2024-11-05 & 2025-11-25 MCP specifications.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-white border border-[#E5EDF5] space-y-3 shadow-[0_2px_4px_rgba(50,50,93,0.04)] hover:shadow-[0_4px_8px_rgba(50,50,93,0.08)] transition-all">
            <div className="h-10 w-10 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
              <Activity className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-[#0A2540] text-base">Evidence Vault Auditing</h3>
            <p className="text-xs text-[#3C4F69] leading-relaxed">
              Every synthetic probe captures execution traces and DOM hashes so you know when a target site changes structure.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-white border border-[#E5EDF5] space-y-3 shadow-[0_2px_4px_rgba(50,50,93,0.04)] hover:shadow-[0_4px_8px_rgba(50,50,93,0.08)] transition-all">
            <div className="h-10 w-10 rounded-md bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-[#0A2540] text-base">Two-Phase Safety Gate</h3>
            <p className="text-xs text-[#3C4F69] leading-relaxed">
              Automatic interception for consequential actions (orders, payments) requiring human token authorization.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-white border border-[#E5EDF5] space-y-3 shadow-[0_2px_4px_rgba(50,50,93,0.04)] hover:shadow-[0_4px_8px_rgba(50,50,93,0.08)] transition-all">
            <div className="h-10 w-10 rounded-md bg-[#F8FAFD] border border-[#E5EDF5] text-[#533AFD] flex items-center justify-center font-bold">
              <Terminal className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-[#0A2540] text-base">1-Click IDE Installers</h3>
            <p className="text-xs text-[#3C4F69] leading-relaxed">
              Install generated servers directly into Cursor, Claude Desktop, and VS Code with a single CLI command.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-white border border-[#E5EDF5] space-y-3 shadow-[0_2px_4px_rgba(50,50,93,0.04)] hover:shadow-[0_4px_8px_rgba(50,50,93,0.08)] transition-all">
            <div className="h-10 w-10 rounded-md bg-cyan-50 border border-cyan-200 text-cyan-700 flex items-center justify-center font-bold">
              <Globe className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-[#0A2540] text-base">TinyFish Cloud Automation</h3>
            <p className="text-xs text-[#3C4F69] leading-relaxed">
              Cloud browser agents navigate complex SPAs, solve multi-step forms, and maintain authenticated sessions.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-white border border-[#E5EDF5] space-y-3 shadow-[0_2px_4px_rgba(50,50,93,0.04)] hover:shadow-[0_4px_8px_rgba(50,50,93,0.08)] transition-all">
            <div className="h-10 w-10 rounded-md bg-[#F8FAFD] border border-[#D6D9FC] text-[#533AFD] flex items-center justify-center font-bold">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-[#0A2540] text-base">Free Tier & Micro-Pricing</h3>
            <p className="text-xs text-[#3C4F69] leading-relaxed">
              3 free generations as a guest, 10 on signup, and affordable $2 Starter and $20 Pro tiers with generous quotas.
            </p>
          </div>
        </div>
      </section>

      {/* Safety Gate Alert Banner */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_1px_2px_rgba(50,50,93,0.04)]">
          <div className="flex items-start gap-3.5">
            <div className="h-10 w-10 rounded-md bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#0A2540]">
                Human-in-the-Loop Safety Gate
              </h3>
              <p className="text-xs text-[#3C4F69] mt-1 max-w-2xl leading-relaxed">
                Agents are powerful, but consequential operations shouldn&apos;t run wild. Any generated tool performing bookings, transactions, or state mutations requires explicit confirmation before executing.
              </p>
            </div>
          </div>
          <Badge variant="warning" className="shrink-0 text-xs font-medium">
            Zero Unintended Actions
          </Badge>
        </div>
      </section>

      {/* Active Projects Directory */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#0A2540]">Generated MCP Projects</h2>
            <p className="text-xs text-[#50617A]">
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
          <div className="p-12 text-center rounded-lg border border-[#E5EDF5] bg-[#F8FAFD] space-y-3">
            <p className="text-sm text-[#50617A]">No websites converted yet.</p>
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
                  className="rounded-lg border border-[#E5EDF5] bg-white p-5 hover:border-[#CFD8E3] hover:shadow-[0_4px_8px_rgba(50,50,93,0.06)] transition-all flex flex-col justify-between group space-y-4 shadow-[0_1px_2px_rgba(50,50,93,0.04)]"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-[#0A2540] group-hover:text-[#533AFD] transition-colors">
                        {p.name}
                      </h3>
                      <Badge variant="success" className="text-[10px]">
                        Active
                      </Badge>
                    </div>
                    <p className="text-xs text-[#50617A] line-clamp-1 mt-1 font-mono">
                      {p.targetUrl}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E5EDF5] flex items-center justify-between text-xs text-[#50617A]">
                    <span>{projectTools.length} live tools</span>
                    {consequentialCount > 0 && (
                      <span className="text-amber-700 font-medium text-[11px]">
                        {consequentialCount} approval-gated
                      </span>
                    )}
                    <ChevronRight className="h-4 w-4 text-[#94A3B8] group-hover:text-[#0A2540] transition-colors" />
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
