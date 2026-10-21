'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Layers } from 'lucide-react';

export function CtaBanner() {
  return (
    <section className="max-w-6xl mx-auto px-4">
      <div className="relative rounded-3xl overflow-hidden border border-[#E5EDF5] dark:border-[#1E293B] bg-gradient-to-b from-[#F8FAFD] via-white to-white dark:from-[#0D1527] dark:via-[#090E1A] dark:to-[#070B14] p-10 sm:p-16 text-center space-y-7 shadow-[0_20px_50px_-20px_rgba(83,58,253,0.12)]">
        {/* Ambient radial blur orbs */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#533AFD]/10 dark:bg-[#533AFD]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
          <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#533AFD] dark:text-[#A5B4FC] font-semibold">
            YOUR NEXT IDEA DESERVES GOOD CONTEXT
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0A2540] dark:text-white leading-[1.12]">
            Bring your docs. <br />
            <span className="bg-gradient-to-r from-[#533AFD] via-[#635BFF] to-[#00D4FF] bg-clip-text text-transparent">
              Build from there.
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-[#50617A] dark:text-[#94A3B8] leading-relaxed">
            One URL is a good place to start. Turn human websites and documentation into live Model Context Protocol tools for Cursor, Claude, and Windsurf in minutes.
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/projects/new"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#533AFD] hover:bg-[#5452FB] active:bg-[#4032C8] text-white text-xs sm:text-sm font-semibold transition-all shadow-[0_4px_16px_rgba(83,58,253,0.35)] hover:-translate-y-0.5"
          >
            <Sparkles className="h-4 w-4" />
            <span>Create your MCP</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#E5EDF5] dark:border-[#1E293B] bg-white dark:bg-[#111827] text-[#0A2540] dark:text-white text-xs sm:text-sm font-semibold hover:bg-[#F8FAFD] dark:hover:bg-[#1E293B] transition-all"
          >
            <span>Explore documentation</span>
          </Link>
        </div>

        <div className="relative z-10 text-[11px] font-mono text-[#64748D] dark:text-[#94A3B8]">
          <span>Free guest exploration · No credit card required · 10 free credits on sign up</span>
        </div>
      </div>
    </section>
  );
}
