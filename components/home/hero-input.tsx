'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Globe, Lock, Sparkles, BookOpen, ExternalLink } from 'lucide-react';

const EXAMPLES = [
  {
    name: 'Stripe docs',
    url: 'https://docs.stripe.com',
    goal: 'Extract payments, refunds, webhooks, and customer API endpoints',
  },
  {
    name: 'TinyFish docs',
    url: 'https://tinyfish.io/docs',
    goal: 'Crawl dynamic SPA pages and extract autonomous browser workflows',
  },
  {
    name: 'Hacker News',
    url: 'https://news.ycombinator.com',
    goal: 'Search tech stories, get discussions, and extract top submissions',
  },
  {
    name: 'GitHub API',
    url: 'https://docs.github.com/en/rest',
    goal: 'Inspect repository endpoints, commit schemas, and pull request tools',
  },
];

export function HeroInput() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [selectedExample, setSelectedExample] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetUrl = url.trim();
    if (!targetUrl) return;

    const matched = EXAMPLES.find((ex) => ex.url === targetUrl);
    const query = new URLSearchParams({
      url: targetUrl,
      ...(matched ? { name: matched.name, goal: matched.goal } : {}),
    });

    router.push(`/projects/new?${query.toString()}`);
  };

  const handleSelectExample = (ex: typeof EXAMPLES[0]) => {
    setUrl(ex.url);
    setSelectedExample(ex.name);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Interactive URL Input Card */}
      <form
        onSubmit={handleSubmit}
        className="relative rounded-xl border border-[#E5EDF5] dark:border-[#1E293B] bg-white dark:bg-[#0D1527] p-2 sm:p-2.5 shadow-[0_13px_27px_-5px_rgba(50,50,93,0.1),0_8px_16px_-8px_rgba(0,0,0,0.06)] dark:shadow-[0_13px_27px_-5px_rgba(0,0,0,0.5)] transition-all hover:border-[#CFD8E3] dark:hover:border-[#334155]"
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1 flex items-center">
            <Globe className="absolute left-3.5 h-4 w-4 text-[#94A3B8] shrink-0 pointer-events-none" />
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setSelectedExample(null);
              }}
              placeholder="https://docs.example.com or any website URL"
              className="w-full pl-10 pr-3 py-2.5 bg-transparent border-0 text-xs sm:text-sm text-[#061B31] dark:text-[#F8FAFC] placeholder:text-[#94A3B8] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={!url.trim()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#533AFD] hover:bg-[#5452FB] active:bg-[#4032C8] text-white text-xs sm:text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_2px_6px_rgba(83,58,253,0.3)] hover:shadow-[0_4px_12px_rgba(83,58,253,0.4)] shrink-0"
          >
            <span>Create MCP</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>

      {/* Try an Example Chips */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
        <span className="text-[#50617A] dark:text-[#94A3B8] font-medium text-[11px] uppercase tracking-wider font-mono">
          Try an example:
        </span>
        {EXAMPLES.map((ex) => {
          const isActive = selectedExample === ex.name || url === ex.url;
          return (
            <button
              key={ex.name}
              type="button"
              onClick={() => handleSelectExample(ex)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#533AFD] text-white shadow-sm'
                  : 'bg-[#F8FAFD] dark:bg-[#131E35] border border-[#E5EDF5] dark:border-[#1E293B] text-[#3C4F69] dark:text-[#CBD5E1] hover:border-[#533AFD] dark:hover:border-[#818CF8] hover:text-[#533AFD] dark:hover:text-[#A5B4FC]'
              }`}
            >
              {ex.name}
            </button>
          );
        })}
      </div>

      {/* Sign-in Preservation Notice */}
      <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[11px] text-[#64748D] dark:text-[#94A3B8]">
        <Lock className="h-3 w-3 text-[#94A3B8]" />
        <span>Sign in when prompted. Your URL and options will be preserved.</span>
      </div>

      {/* Direct Workspace & Quick Start Action Links */}
      <div className="pt-2 flex items-center justify-center sm:justify-start gap-4 text-xs font-medium">
        <Link
          href="/projects/new"
          className="inline-flex items-center gap-1.5 text-[#533AFD] dark:text-[#A5B4FC] hover:text-[#4032C8] dark:hover:text-white font-semibold group"
        >
          <span>Open workspace</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
        <span className="text-[#CFD8E3] dark:text-[#334155]">·</span>
        <Link
          href="/docs"
          className="inline-flex items-center gap-1.5 text-[#50617A] dark:text-[#94A3B8] hover:text-[#0A2540] dark:hover:text-white"
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>Read the quick start</span>
        </Link>
      </div>
    </div>
  );
}
