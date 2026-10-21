'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Minus, ArrowRight } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'What happens after I paste a URL?',
    answer:
      'Web2MCP immediately dispatches an autonomous TinyFish browser exploration agent. It traverses the target site, navigates through dynamic SPAs, extracts interactive forms, search filters, and structured endpoints, infers typed JSON Schemas with AI, and verifies each action with synthetic live probes.',
  },
  {
    question: 'Does this replace my editor or AI model?',
    answer:
      'No. Web2MCP is the live context and tool layer that sits between the real web and your preferred AI environment. It generates standard Model Context Protocol (MCP) endpoints that connect directly into Cursor, Claude Desktop, Claude Code, VS Code, or Windsurf alongside Claude 3.7 Sonnet, GPT-4o, or any local model.',
  },
  {
    question: 'Will it include every page and form?',
    answer:
      'It crawls according to the boundary and goal you provide. Common documentation pages, interactive search inputs, query forms, and detail views are discovered and extracted into clean Markdown and typed MCP tools. You can also specify exact page budgets and topics to focus on.',
  },
  {
    question: 'How does the Two-Phase Safety Gate protect against unintended actions?',
    answer:
      'Read-only operations (searches, queries, data extraction) execute smoothly and automatically. Consequential actions that perform bookings, cart checkouts, or external state mutations are classified with a human confirmation gate that requires a one-time approval token before running.',
  },
  {
    question: 'Can I change, rotate, or revoke access?',
    answer:
      'Yes. Every project has dedicated, project-scoped API tokens. You can regenerate or revoke tokens at any time directly from your dashboard. Your saved documentation, evidence vault history, and schema models remain intact when access changes.',
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((current) => (current === idx ? null : idx));
  };

  return (
    <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
      {/* Left Column: Heading & Docs Link */}
      <div className="md:col-span-5 space-y-4">
        <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#533AFD] dark:text-[#A5B4FC] font-semibold">
          BEFORE YOU GET STARTED
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0A2540] dark:text-white leading-[1.15]">
          A few things <br />
          <span className="text-[#50617A] dark:text-[#94A3B8]">worth knowing.</span>
        </h2>
        <div className="pt-2">
          <Link
            href="/docs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#533AFD] dark:text-[#A5B4FC] hover:text-[#4032C8] dark:hover:text-white group"
          >
            <span>Explore the documentation</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Right Column: Interactive Accordion */}
      <div className="md:col-span-7 divide-y divide-[#E5EDF5] dark:divide-[#1E293B] border-y border-[#E5EDF5] dark:border-[#1E293B]">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={faq.question} className="py-4 sm:py-5">
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between text-left gap-4 group"
              >
                <span className="text-sm sm:text-base font-semibold text-[#0A2540] dark:text-white group-hover:text-[#533AFD] dark:group-hover:text-[#A5B4FC] transition-colors">
                  {faq.question}
                </span>
                <span className="h-7 w-7 rounded-full bg-[#F8FAFD] dark:bg-[#131E35] border border-[#E5EDF5] dark:border-[#1E293B] flex items-center justify-center text-[#50617A] dark:text-[#94A3B8] shrink-0 group-hover:border-[#533AFD] group-hover:text-[#533AFD] transition-all">
                  {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                </span>
              </button>

              {isOpen && (
                <div className="pt-3 pr-8 text-xs sm:text-sm text-[#50617A] dark:text-[#94A3B8] leading-relaxed animate-in fade-in duration-200">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
