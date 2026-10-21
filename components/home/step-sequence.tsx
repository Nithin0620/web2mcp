'use client';

import React from 'react';
import { Globe, Cpu, Terminal, ArrowUpRight } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    title: 'Bring your docs',
    desc: 'Paste a public docs or website URL. Choose the topics, endpoints, and page budget that matter to your project.',
    badge: 'URL Discovery',
    icon: Globe,
  },
  {
    num: '02',
    title: 'Make them useful',
    desc: 'TinyFish discovers and extracts pages. We save the Markdown, typed schemas, code examples, and verified live probes.',
    badge: 'TinyFish Extraction',
    icon: Cpu,
  },
  {
    num: '03',
    title: 'Connect your AI',
    desc: 'Issue a project token, add the MCP configuration to your editor, and start asking better questions.',
    badge: 'Live MCP Stream',
    icon: Terminal,
  },
];

export function StepSequence() {
  return (
    <section id="how-it-works" className="max-w-6xl mx-auto px-4 scroll-mt-24 space-y-12">
      {/* Editorial Header */}
      <div className="space-y-3">
        <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#533AFD] dark:text-[#A5B4FC] font-semibold">
          A SMALL INPUT. A BETTER START.
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0A2540] dark:text-white leading-[1.15]">
          One URL. <br />
          <span className="text-[#50617A] dark:text-[#94A3B8]">A shared source of truth.</span>
        </h2>
        <p className="text-sm text-[#50617A] dark:text-[#94A3B8] max-w-xl">
          Keep building. Let Web2MCP bring the documentation and live tools into the conversation.
        </p>
      </div>

      {/* 3 Numbered Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STEPS.map((step) => {
          const IconComponent = step.icon;
          return (
            <div
              key={step.num}
              className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#0D1527] border border-[#E5EDF5] dark:border-[#1E293B] shadow-[0_2px_4px_rgba(50,50,93,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)] flex flex-col justify-between space-y-8 hover:border-[#CFD8E3] dark:hover:border-[#334155] transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl sm:text-4xl font-mono font-bold text-[#533AFD] dark:text-[#818CF8] tracking-tight">
                    {step.num}
                  </span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#F8FAFD] dark:bg-[#131E35] border border-[#E5EDF5] dark:border-[#1E293B] text-[#50617A] dark:text-[#94A3B8] font-semibold">
                    {step.badge}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-[#0A2540] dark:text-white group-hover:text-[#533AFD] dark:group-hover:text-[#A5B4FC] transition-colors flex items-center justify-between">
                    <span>{step.title}</span>
                    <IconComponent className="h-4 w-4 text-[#94A3B8] group-hover:text-[#533AFD] dark:group-hover:text-[#A5B4FC] transition-colors" />
                  </h3>
                  <p className="text-xs text-[#50617A] dark:text-[#94A3B8] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E5EDF5] dark:border-[#1E293B] text-[11px] font-mono text-[#64748D] dark:text-[#94A3B8] flex items-center justify-between">
                <span>Phase {step.num} of 03</span>
                <span className="text-[#533AFD] dark:text-[#A5B4FC] font-semibold flex items-center gap-0.5">
                  Explore <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
