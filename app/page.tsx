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
  Wrench,
  Zap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Reveal } from '@/components/ui/reveal';
import { initDb, db } from '@/lib/db/client';
import { projects, tools } from '@/lib/db/schema';
import { HeroInput } from '@/components/home/hero-input';
import { ToolEcosystem } from '@/components/home/tool-ecosystem';
import { StepSequence } from '@/components/home/step-sequence';
import { InteractiveDemo } from '@/components/home/interactive-demo';
import { FaqAccordion } from '@/components/home/faq-accordion';
import { CtaBanner } from '@/components/home/cta-banner';

export default async function HomePage() {
  await initDb();
  const allProjects = await db.select().from(projects);
  const allTools = await db.select().from(tools);

  // Filter out internal test runner artifacts to feature authentic, user-generated MCP servers
  const cleanProjects = allProjects
    .filter(
      (p) =>
        !p.id.startsWith('test-') &&
        !p.id.includes('val-') &&
        !p.id.includes('e2e-') &&
        !p.id.startsWith('proj-mcp-')
    )
    .reverse();

  const displayProjects = cleanProjects.length > 0 ? cleanProjects : allProjects.slice(0, 6);

  return (
    <div className="space-y-24 sm:space-y-32 pb-28 bg-transparent text-[#061B31] dark:text-[#F8FAFC] overflow-hidden">
      {/* ============================================================
          HERO SECTION (High-Craft Editorial & Live Input)
          Kept clean and out of the background particle animation
          ============================================================ */}
      <section className="relative z-20 pt-20 sm:pt-28 pb-16 sm:pb-24 border-b border-[#E5EDF5] dark:border-[#1E293B] bg-gradient-to-b from-[#F8FAFD] via-white to-white dark:from-[#070B14] dark:via-[#0A0F1D] dark:to-[#0A0F1D] overflow-hidden shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
        {/* Ambient Faded Blurred Colorful Moving Bubbles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Bubble 1: Vibrant Indigo / Violet (Top-Left) */}
          <div className="absolute -top-12 left-[10%] w-[26rem] h-[26rem] sm:w-[32rem] sm:h-[32rem] rounded-full bg-gradient-to-tr from-[#635BFF] to-[#8B5CF6] opacity-25 dark:opacity-30 blur-[90px] animate-bubble-1 mix-blend-multiply dark:mix-blend-screen" />

          {/* Bubble 2: Warm Rose / Coral / Pink (Top-Right) */}
          <div className="absolute -top-16 right-[12%] w-[24rem] h-[24rem] sm:w-[30rem] sm:h-[30rem] rounded-full bg-gradient-to-br from-[#EC4899] to-[#F43F5E] opacity-20 dark:opacity-25 blur-[90px] animate-bubble-2 mix-blend-multiply dark:mix-blend-screen" />

          {/* Bubble 3: Electric Cyan / Sky Blue (Center / Mid-Left) */}
          <div className="absolute top-40 left-[26%] w-[22rem] h-[22rem] sm:w-[28rem] sm:h-[28rem] rounded-full bg-gradient-to-r from-[#00D4FF] to-[#06B6D4] opacity-20 dark:opacity-25 blur-[95px] animate-bubble-3 mix-blend-multiply dark:mix-blend-screen" />

          {/* Bubble 4: Soft Emerald / Violet (Mid-Right / Lower) */}
          <div className="absolute top-44 right-[22%] w-[20rem] h-[20rem] sm:w-[26rem] sm:h-[26rem] rounded-full bg-gradient-to-tl from-[#10B981] to-[#635BFF] opacity-15 dark:opacity-20 blur-[100px] animate-bubble-4 mix-blend-multiply dark:mix-blend-screen" />
        </div>

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10 space-y-8">
          {/* Eyebrow Pill */}
          <Reveal animation="fade-down" delay={50}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D6D9FC] dark:border-[#312E81] bg-white/80 dark:bg-[#131E35]/80 backdrop-blur-sm text-xs text-[#533AFD] dark:text-[#A5B4FC] font-semibold tracking-wide shadow-[0_1px_2px_rgba(50,50,93,0.06)] animate-shimmer">
              <span className="h-1.5 w-1.5 rounded-full bg-[#533AFD] dark:bg-[#818CF8] animate-pulse" />
              <span>THE LIVE WEB & DOCUMENTATION LAYER FOR AI</span>
            </div>
          </Reveal>

          {/* Söhne / Grotesque Display Headline */}
          <Reveal animation="fade-up" delay={120}>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#0A2540] dark:text-white leading-[1.08] max-w-4xl mx-auto">
              Great work starts <br />
              <span className="bg-gradient-to-r from-[#533AFD] via-[#635BFF] to-[#00D4FF] bg-clip-text text-transparent">
                with the right context.
              </span>
            </h1>
          </Reveal>

          {/* Layered Sub-phrases (Trust, Tools, Answers) */}
          <Reveal animation="fade-up" delay={180}>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium text-[#50617A] dark:text-[#94A3B8]">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8FAFD] dark:bg-[#131E35] border border-[#E5EDF5] dark:border-[#1E293B]">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                docs you can trust.
              </span>
              <span className="hidden sm:inline text-[#CFD8E3] dark:text-[#334155]">·</span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8FAFD] dark:bg-[#131E35] border border-[#E5EDF5] dark:border-[#1E293B]">
                <Sparkles className="h-3.5 w-3.5 text-[#533AFD] dark:text-[#A5B4FC]" />
                live tools that take action.
              </span>
              <span className="hidden sm:inline text-[#CFD8E3] dark:text-[#334155]">·</span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8FAFD] dark:bg-[#131E35] border border-[#E5EDF5] dark:border-[#1E293B]">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                answers that help.
              </span>
            </div>
          </Reveal>

          {/* Subtitle */}
          <Reveal animation="fade-up" delay={220}>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#3C4F69] dark:text-[#CBD5E1] leading-relaxed font-normal">
              Turn any documentation or website URL into an MCP source. Give your AI the pages, code, and context it needs to build.
            </p>
          </Reveal>

          {/* Interactive URL Input & Example Chips */}
          <Reveal animation="fade-up" delay={300}>
            <HeroInput />
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          ONE SOURCE. YOUR FAVORITE TOOLS. (Ecosystem Bar)
          ============================================================ */}
      <Reveal animation="fade-up" delay={100}>
        <ToolEcosystem />
      </Reveal>

      {/* ============================================================
          A SMALL INPUT. A BETTER START. (Numbered Sequence 01, 02, 03)
          ============================================================ */}
      <Reveal animation="fade-up" delay={120}>
        <StepSequence />
      </Reveal>

      {/* ============================================================
          BUILT FOR THE WORK BETWEEN THE LINES (Interactive Result Mockup)
          ============================================================ */}
      <Reveal animation="fade-up" delay={120}>
        <InteractiveDemo />
      </Reveal>

      {/* ============================================================
          ACTIVE SHOWCASE: LIVE MCP SERVERS
          ============================================================ */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">
        <Reveal animation="fade-up" delay={50}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#533AFD] dark:text-[#A5B4FC] font-semibold">
                LIVE MCP SOURCE REGISTRY
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0A2540] dark:text-white">
                Generated MCP Projects
              </h2>
              <p className="text-xs text-[#50617A] dark:text-[#94A3B8]">
                Websites and docs exposed as verified Model Context Protocol tools with evidence vaults
              </p>
            </div>
            <Link
              href="/projects/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#E5EDF5] dark:border-[#1E293B] bg-white dark:bg-[#111827] text-xs font-semibold text-[#0A2540] dark:text-white hover:border-[#533AFD] transition-all shadow-[0_1px_2px_rgba(50,50,93,0.04)]"
            >
              <Sparkles className="h-3 w-3 text-[#533AFD]" />
              <span>Convert New URL</span>
            </Link>
          </div>
        </Reveal>

        {displayProjects.length === 0 ? (
          <Reveal animation="fade-up" delay={150}>
            <div className="p-12 text-center rounded-2xl border border-[#E5EDF5] dark:border-[#1E293B] bg-[#F8FAFD] dark:bg-[#0D1527] space-y-3">
              <p className="text-sm text-[#50617A] dark:text-[#94A3B8]">No websites converted yet.</p>
              <Link
                href="/projects/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#533AFD] text-white text-xs font-semibold"
              >
                Convert Your First Website
              </Link>
            </div>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {displayProjects.map((p, idx) => {
              const projectTools = allTools.filter((t) => t.projectId === p.id);
              const consequentialCount = projectTools.filter((t) => t.requiresApproval).length;

              return (
                <Reveal key={p.id} animation="fade-up" delay={idx * 80}>
                  <div className="rounded-2xl border border-[#E5EDF5] dark:border-[#1E293B] bg-white dark:bg-[#0D1527] p-5 sm:p-6 hover:border-[#533AFD] dark:hover:border-[#818CF8] stripe-hover-card flex flex-col justify-between group space-y-4 shadow-[0_2px_4px_rgba(50,50,93,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)] h-full">
                    {/* Project Header */}
                    <div>
                      <div className="flex items-center justify-between">
                        <Link href={`/projects/${p.id}`} className="group-hover:text-[#533AFD] dark:group-hover:text-[#A5B4FC] transition-colors">
                          <h3 className="font-semibold text-base text-[#0A2540] dark:text-white group-hover:text-[#533AFD] dark:group-hover:text-[#A5B4FC] transition-colors flex items-center gap-2">
                            {p.name}
                          </h3>
                        </Link>
                        <Badge variant="success" className="text-[10px] gap-1 font-medium">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                        </Badge>
                      </div>

                      <a
                        href={p.targetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#50617A] dark:text-[#94A3B8] hover:text-[#533AFD] dark:hover:text-[#A5B4FC] flex items-center gap-1 font-mono mt-1.5 truncate"
                      >
                        <Globe className="h-3 w-3 shrink-0" />
                        <span className="truncate">{p.targetUrl}</span>
                      </a>
                    </div>

                    {/* Showcased Generated Tools List */}
                    <div className="space-y-2 py-1">
                      <div className="flex items-center justify-between text-[11px] text-[#64748D] dark:text-[#94A3B8] uppercase tracking-wider font-semibold">
                        <span className="flex items-center gap-1">
                          <Wrench className="h-3 w-3 text-[#533AFD] dark:text-[#A5B4FC]" /> Generated Tools ({projectTools.length})
                        </span>
                        {consequentialCount > 0 && (
                          <span className="text-amber-700 dark:text-amber-400 font-medium normal-case text-[10px] bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                            {consequentialCount} approval gated
                          </span>
                        )}
                      </div>

                      {projectTools.length === 0 ? (
                        <p className="text-xs text-[#94A3B8] italic">No tools generated yet.</p>
                      ) : (
                        <div className="space-y-1.5">
                          {projectTools.slice(0, 3).map((t) => (
                            <div
                              key={t.id}
                              className="p-2.5 rounded-lg bg-[#F8FAFD] dark:bg-[#131E35] border border-[#E5EDF5] dark:border-[#1E293B] flex items-start justify-between gap-2"
                            >
                              <div className="space-y-0.5 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono text-xs font-semibold text-[#533AFD] dark:text-[#A5B4FC]">
                                    {t.name}()
                                  </span>
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-white dark:bg-[#0D1527] border border-[#E5EDF5] dark:border-[#1E293B] text-[#50617A] dark:text-[#94A3B8] uppercase font-mono">
                                    {t.category}
                                  </span>
                                  {t.requiresApproval && (
                                    <span className="text-[9px] px-1 py-0.2 rounded bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 font-semibold uppercase">
                                      Gated
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-[#50617A] dark:text-[#94A3B8] line-clamp-1 leading-snug">
                                  {t.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Streamable HTTP Endpoint & Quick Actions */}
                    <div className="pt-3 border-t border-[#E5EDF5] dark:border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="font-mono text-[11px] text-[#50617A] dark:text-[#94A3B8] bg-[#F8FAFD] dark:bg-[#131E35] border border-[#E5EDF5] dark:border-[#1E293B] px-2 py-1 rounded truncate max-w-full sm:max-w-[260px]">
                        <span className="text-[#533AFD] dark:text-[#A5B4FC] font-bold">POST</span> /api/mcp/{p.id}/mcp
                      </div>

                      <Link
                        href={`/projects/${p.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#533AFD] dark:text-[#A5B4FC] hover:text-[#5452FB] transition-colors shrink-0"
                      >
                        Playground <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </section>

      {/* ============================================================
          BEFORE YOU GET STARTED (Interactive Collapsible FAQ)
          ============================================================ */}
      <Reveal animation="fade-up" delay={100}>
        <FaqAccordion />
      </Reveal>

      {/* ============================================================
          YOUR NEXT IDEA DESERVES GOOD CONTEXT (Final CTA Banner)
          ============================================================ */}
      <Reveal animation="fade-up" delay={100}>
        <CtaBanner />
      </Reveal>
    </div>
  );
}
