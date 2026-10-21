'use client';

import React, { useState } from 'react';
import {
  Search,
  FileText,
  Key,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Terminal,
} from 'lucide-react';

export function InteractiveDemo() {
  const [activeTab, setActiveTab] = useState<'search' | 'docs' | 'tokens'>('search');
  const [copied, setCopied] = useState(false);

  const searchCode = `const event = verifySignature(
  payload, signingSecret
);`;

  const docsCode = `# Webhooks: Verification
> Source: https://docs.stripe.com/webhooks
> Status: Verified · DOM Hash: #sha256:7f4a...

Verify signatures manually using the HMAC-SHA256 hash
computed with your endpoint's signing secret.`;

  const tokensCode = `{
  "mcpServers": {
    "web2mcp-stripe": {
      "url": "https://web2mcp.ssh.net.in/api/mcp/proj-stripe/mcp",
      "headers": {
        "Authorization": "Bearer mcp_live_9a4f21e8d02c"
      }
    }
  }
}`;

  const currentCode =
    activeTab === 'search'
      ? searchCode
      : activeTab === 'docs'
        ? docsCode
        : tokensCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#533AFD] dark:text-[#A5B4FC] font-semibold">
          BUILT FOR THE WORK BETWEEN THE LINES
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0A2540] dark:text-white leading-[1.15]">
          Less tab hopping. <br />
          <span className="text-[#50617A] dark:text-[#94A3B8]">More understanding.</span>
        </h2>
        <p className="text-sm text-[#50617A] dark:text-[#94A3B8] max-w-xl">
          Find the relevant section. Read the example. Go straight to the source.
        </p>
      </div>

      {/* Main Interactive Showcase Window */}
      <div className="rounded-2xl border border-[#E5EDF5] dark:border-[#1E293B] bg-white dark:bg-[#0D1527] shadow-[0_20px_40px_-15px_rgba(50,50,93,0.1)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* Window Chrome */}
        <div className="p-3.5 sm:px-6 bg-[#F8FAFD] dark:bg-[#0F172A] border-b border-[#E5EDF5] dark:border-[#1E293B] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-400/80" />
            <span className="h-3 w-3 rounded-full bg-amber-400/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
            <span className="ml-3 font-mono text-xs text-[#50617A] dark:text-[#94A3B8]">
              web2mcp / documentation / live-mcp-source
            </span>
          </div>

          {/* Interactive Mode Tabs */}
          <div className="flex items-center gap-1 p-1 bg-white dark:bg-[#131E35] border border-[#E5EDF5] dark:border-[#1E293B] rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('search')}
              className={`px-3 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'search'
                  ? 'bg-[#533AFD] text-white shadow-sm'
                  : 'text-[#50617A] dark:text-[#94A3B8] hover:text-[#0A2540] dark:hover:text-white'
              }`}
            >
              <Search className="h-3 w-3" />
              <span>Source-cited search</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('docs')}
              className={`px-3 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'docs'
                  ? 'bg-[#533AFD] text-white shadow-sm'
                  : 'text-[#50617A] dark:text-[#94A3B8] hover:text-[#0A2540] dark:hover:text-white'
              }`}
            >
              <FileText className="h-3 w-3" />
              <span>Saved documentation</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tokens')}
              className={`px-3 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'tokens'
                  ? 'bg-[#533AFD] text-white shadow-sm'
                  : 'text-[#50617A] dark:text-[#94A3B8] hover:text-[#0A2540] dark:hover:text-white'
              }`}
            >
              <Key className="h-3 w-3" />
              <span>Project-scoped tokens</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Query Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E5EDF5] dark:border-[#1E293B]">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold px-2 py-0.5 rounded bg-[#D6D9FC]/40 text-[#533AFD] dark:text-[#A5B4FC]">
                {activeTab === 'search' ? 'EXAMPLE PROBE' : activeTab === 'docs' ? 'EXTRACTED MARKDOWN' : 'MCP CONFIGURATION'}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-[#0A2540] dark:text-white">
                {activeTab === 'search'
                  ? 'How do I verify a webhook signature?'
                  : activeTab === 'docs'
                    ? 'Structured Markdown & Code Block Extraction'
                    : '1-Click JSON-RPC Configuration for Cursor & Claude'}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#50617A] dark:text-[#94A3B8] px-2 py-1 rounded bg-[#F8FAFD] dark:bg-[#131E35] border border-[#E5EDF5] dark:border-[#1E293B] hidden sm:inline">
                Webhooks
              </span>
              <span className="text-[11px] font-mono text-[#50617A] dark:text-[#94A3B8] px-2 py-1 rounded bg-[#F8FAFD] dark:bg-[#131E35] border border-[#E5EDF5] dark:border-[#1E293B] hidden sm:inline">
                Authentication
              </span>
            </div>
          </div>

          {/* Explanation Text */}
          <p className="text-xs sm:text-sm text-[#3C4F69] dark:text-[#CBD5E1] leading-relaxed">
            {activeTab === 'search' &&
              'Verify the request before you trust it. Use the original payload and your signing secret to validate the incoming signature.'}
            {activeTab === 'docs' &&
              'TinyFish cleans noise, navigation sidebars, and ads, preserving clean markdown tables, typed arguments, and exact code snippets.'}
            {activeTab === 'tokens' &&
              'Issue isolated project tokens with granular rate limits. Connect Cursor Composer, Windsurf, or Claude Desktop in seconds.'}
          </p>

          {/* Code Card */}
          <div className="relative rounded-xl bg-[#0A2540] dark:bg-[#070B14] p-4 sm:p-5 font-mono text-xs text-[#D6D9FC] border border-[#1E293B] overflow-x-auto">
            <button
              onClick={handleCopy}
              className="absolute top-3.5 right-3.5 p-1.5 rounded-md bg-[#131E35] hover:bg-[#1E293B] text-gray-300 hover:text-white transition-colors"
              title="Copy code"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
            <pre className="leading-relaxed">
              <code>{currentCode}</code>
            </pre>
          </div>

          {/* Footnote with source link and verification status */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#64748D] dark:text-[#94A3B8]">
            <a
              href="https://docs.stripe.com/webhooks"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-mono hover:text-[#533AFD] dark:hover:text-[#A5B4FC] transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>docs.example.com / webhooks</span>
            </a>
            <span className="text-[11px] italic">
              Illustrative result. Your MCP searches your saved documentation.
            </span>
          </div>
        </div>
      </div>

      {/* 3 Detail Columns underneath */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        <div className="space-y-2">
          <h3 className="text-base font-bold text-[#0A2540] dark:text-white">
            Find the part that matters
          </h3>
          <p className="text-xs text-[#50617A] dark:text-[#94A3B8] leading-relaxed">
            Search documentation sections with headings and breadcrumbs. Every result points directly back to its source URL.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-bold text-[#0A2540] dark:text-white">
            Keep the useful details
          </h3>
          <p className="text-xs text-[#50617A] dark:text-[#94A3B8] leading-relaxed">
            Browse saved Markdown, code examples, and tables. See page coverage and extraction failures before relying on a result.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-bold text-[#0A2540] dark:text-white">
            Your context. Your access.
          </h3>
          <p className="text-xs text-[#50617A] dark:text-[#94A3B8] leading-relaxed">
            Create, replace, or revoke a project token anytime. Your saved documentation and live tools stay in place when access changes.
          </p>
        </div>
      </div>
    </section>
  );
}
