'use client';

import React from 'react';
import Link from 'next/link';
import {
  Boxes,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';

const PRESETS = [
  {
    name: 'Hacker News (Y Combinator)',
    url: 'https://news.ycombinator.com',
    category: 'News & Tech',
    description: 'Query frontpage tech stories, search developer posts via Algolia, and retrieve top discussion comments.',
    tools: ['search_news', 'get_news_details'],
  },
  {
    name: 'Stripe Documentation & APIs',
    url: 'https://stripe.com',
    category: 'Fintech & Docs',
    description: 'Explore payment APIs, inspect checkout workflows, and extract webhook specs directly into Cursor.',
    tools: ['search_products', 'get_api_spec'],
  },
  {
    name: 'Public Procurement & Tenders',
    url: 'https://httpbin.org/forms/post',
    category: 'Government & RFP',
    description: 'Extract contract opportunities, deadline dates, vendor prerequisites, and submission forms.',
    tools: ['search_tenders', 'submit_tender_form'],
  },
  {
    name: 'Flight & Hotel Aggregator',
    url: 'https://httpbin.org/html',
    category: 'Travel & Booking',
    description: 'Search origin/destination airfares, compare seat classes, and verify ticket availability.',
    tools: ['search_flights', 'get_flight_details', 'book_flight'],
  },
];

const GUIDES = [
  {
    title: 'TinyFish Web Acquisition Engine',
    description: 'Learn how TinyFish navigates complex JavaScript SPAs, handles cookie banners, and renders pages in a cloud browser.',
    link: 'https://docs.tinyfish.ai',
    badge: 'Core Engine',
  },
  {
    title: 'Model Context Protocol (MCP) Official Spec',
    description: 'Explore the open standard developed by Anthropic connecting AI assistants to data systems and tools.',
    link: 'https://modelcontextprotocol.io',
    badge: 'Protocol',
  },
  {
    title: 'Web2MCP Architecture & Philosophy',
    description: 'Read the architectural philosophy behind Web2MCP and our presentation deck on turning websites into agent tools.',
    link: '/docs#architecture',
    badge: 'Presentation',
  },
  {
    title: 'Cursor & Claude Integration Best Practices',
    description: 'Configure multi-tool setups, custom approval prompts, and latency optimization inside your IDE.',
    link: '/docs#clients',
    badge: 'Guide',
  },
];

export default function ResourcesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16 space-y-16 bg-white text-[#061B31]">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6D9FC]/30 border border-[#D6D9FC] text-[#533AFD] text-xs font-semibold shadow-[0_1px_2px_rgba(50,50,93,0.04)]">
          <Boxes className="h-3.5 w-3.5" />
          <span>Ecosystem & Presets</span>
        </div>
        <h1 className="text-4xl font-bold text-[#0A2540] tracking-tight">
          Web2MCP Resources & Presets Library
        </h1>
        <p className="text-[#50617A] text-sm leading-relaxed">
          Pre-built MCP tool templates, developer guides, and architecture references for integrating web capabilities into your agentic workflow.
        </p>
      </div>

      {/* Pre-built MCP Presets Catalog */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#0A2540]">Pre-configured MCP Presets</h2>
            <p className="text-xs text-[#50617A]">Launch a live server from these popular website patterns with one click.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PRESETS.map((preset) => (
            <div
              key={preset.name}
              className="p-6 rounded-lg bg-white border border-[#E5EDF5] hover:border-[#CFD8E3] hover:shadow-[0_4px_8px_rgba(50,50,93,0.06)] transition-all flex flex-col justify-between space-y-4 shadow-[0_2px_4px_rgba(50,50,93,0.04)]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#F8FAFD] text-[#50617A] border border-[#E5EDF5]">
                    {preset.category}
                  </span>
                  <span className="text-xs font-mono text-[#64748D] truncate max-w-[180px]">{preset.url}</span>
                </div>

                <h3 className="font-bold text-[#0A2540] text-base">{preset.name}</h3>
                <p className="text-xs text-[#3C4F69] leading-relaxed">{preset.description}</p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {preset.tools.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded bg-[#F8FAFD] text-[#533AFD] font-mono text-[10px] border border-[#D6D9FC]"
                    >
                      {t}()
                    </span>
                  ))}
                </div>
              </div>

              <Link
                href={`/projects/new?url=${encodeURIComponent(preset.url)}`}
                className="w-full py-2.5 px-4 bg-[#F8FAFD] hover:bg-[#EEF2F6] text-[#0A2540] rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-[#E5EDF5] shadow-[0_1px_2px_rgba(50,50,93,0.04)]"
              >
                Use Preset in Generator <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Guides & Documentation */}
      <div className="space-y-6 pt-6 border-t border-[#E5EDF5]">
        <div>
          <h2 className="text-xl font-bold text-[#0A2540]">Guides & External References</h2>
          <p className="text-xs text-[#50617A]">Documentation and official specifications for agents and protocols.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {GUIDES.map((guide) => (
            <a
              key={guide.title}
              href={guide.link}
              target={guide.link.startsWith('http') ? '_blank' : '_self'}
              rel="noreferrer"
              className="p-5 rounded-lg bg-white border border-[#E5EDF5] hover:border-[#CFD8E3] hover:shadow-[0_4px_8px_rgba(50,50,93,0.06)] transition-all block group shadow-[0_1px_2px_rgba(50,50,93,0.04)]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-semibold text-[#533AFD] bg-[#D6D9FC]/40 px-2 py-0.5 rounded-full border border-[#D6D9FC]">
                  {guide.badge}
                </span>
                <ExternalLink className="h-4 w-4 text-[#94A3B8] group-hover:text-[#533AFD] transition-colors" />
              </div>
              <h3 className="font-semibold text-[#0A2540] text-sm group-hover:text-[#533AFD] transition-colors">
                {guide.title}
              </h3>
              <p className="text-xs text-[#50617A] mt-1 leading-relaxed">{guide.description}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
