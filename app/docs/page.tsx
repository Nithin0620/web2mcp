'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Terminal,
  Cpu,
  Shield,
  Layers,
  Code2,
  Copy,
  Check,
  Server,
  Zap,
  Sparkles,
} from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';

const SECTIONS = [
  { id: 'quickstart', title: 'Quickstart', icon: Zap },
  { id: 'architecture', title: 'System Architecture', icon: Layers },
  { id: 'clients', title: 'IDE & Client Integration', icon: Terminal },
  { id: 'protocol', title: 'Streamable MCP Protocol', icon: Server },
  { id: 'safety', title: 'Safety Gate & Approvals', icon: Shield },
  { id: 'cli', title: 'CLI Tool Reference', icon: Code2 },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('quickstart');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 lg:py-16 bg-transparent text-[#061B31] dark:text-[#F8FAFC] overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sticky Sidebar Navigation */}
        <aside className="lg:w-64 shrink-0">
          <div className="sticky top-24 space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748D] block mb-2 px-3">
                Documentation
              </span>
              <nav className="space-y-1">
                {SECTIONS.map((sec) => {
                  const Icon = sec.icon;
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => {
                        setActiveSection(sec.id);
                        document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-left transition-colors ${
                        isActive
                          ? 'bg-[#F8FAFD] text-[#533AFD] font-semibold border-l-2 border-[#533AFD]'
                          : 'text-[#50617A] hover:text-[#0A2540] hover:bg-[#F8FAFD]'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{sec.title}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-4 rounded-lg bg-[#F8FAFD] border border-[#E5EDF5] text-xs text-[#50617A] space-y-3 shadow-[0_1px_2px_rgba(50,50,93,0.04)]">
              <div className="flex items-center gap-2 text-[#0A2540] font-semibold">
                <Sparkles className="h-4 w-4 text-[#533AFD]" />
                <span>Need an MCP now?</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Generate verified MCP tools for any site in seconds.
              </p>
              <Link
                href="/projects/new"
                className="block text-center py-2 px-3 bg-[#533AFD] hover:bg-[#5452FB] text-white rounded-md font-semibold text-xs transition-colors shadow-[0_2px_4px_rgba(83,58,253,0.2)]"
              >
                Launch Generator
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Documentation Content */}
        <div className="flex-1 max-w-4xl space-y-16">
          {/* Quickstart */}
          <Reveal animation="fade-up" delay={50}>
            <section id="quickstart" className="space-y-6 scroll-mt-24">
              <div className="border-b border-[#E5EDF5] pb-4">
                <span className="text-xs font-semibold text-[#533AFD] uppercase tracking-wider">Getting Started</span>
                <h1 className="text-3xl font-bold text-[#0A2540] tracking-tight mt-1">
                  Web2MCP Quickstart Guide
                </h1>
                <p className="text-[#50617A] text-sm mt-2 leading-relaxed">
                  Web2MCP transforms human-facing websites, web applications, and internal portals into live, verified Model Context Protocol (MCP) endpoints for Cursor, Claude, VS Code, and autonomous AI agents.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-bold text-[#0A2540]">How to generate your first MCP server in 3 steps:</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-[#F8FAFD] border border-[#E5EDF5] space-y-2 shadow-[0_1px_2px_rgba(50,50,93,0.04)] stripe-hover-card">
                    <span className="text-xs font-bold text-[#533AFD]">Step 1</span>
                    <h3 className="font-semibold text-[#0A2540] text-sm">Provide Target URL</h3>
                    <p className="text-xs text-[#50617A]">
                      Input any web address (e.g., flight booking, ecommerce, portal, or search catalog).
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#F8FAFD] border border-[#E5EDF5] space-y-2 shadow-[0_1px_2px_rgba(50,50,93,0.04)] stripe-hover-card">
                    <span className="text-xs font-bold text-[#533AFD]">Step 2</span>
                    <h3 className="font-semibold text-[#0A2540] text-sm">Autonomous Exploration</h3>
                    <p className="text-xs text-[#50617A]">
                      TinyFish crawler inspects DOM forms, buttons, inputs, schemas, and verifies probes live.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#F8FAFD] border border-[#E5EDF5] space-y-2 shadow-[0_1px_2px_rgba(50,50,93,0.04)] stripe-hover-card">
                    <span className="text-xs font-bold text-[#533AFD]">Step 3</span>
                    <h3 className="font-semibold text-[#0A2540] text-sm">Connect to AI IDE</h3>
                    <p className="text-xs text-[#50617A]">
                      Copy the Streamable HTTP endpoint or run 1-click CLI installer into Cursor / Claude.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Test CLI */}
              <div className="p-4 rounded-lg bg-[#0A2540] border border-[#1A2C44] space-y-3 shadow-[0_2px_4px_rgba(50,50,93,0.1)] stripe-hover-card">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[#D6D9FC]">Try via Web2MCP CLI</span>
                  <button
                    onClick={() => copyToClipboard('npx web2mcp add https://news.ycombinator.com', 'cli-quickstart')}
                    className="text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    {copiedKey === 'cli-quickstart' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedKey === 'cli-quickstart' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="text-xs font-mono text-emerald-300 overflow-x-auto p-2 bg-[#061B31] rounded-md">
                  npx web2mcp add https://news.ycombinator.com
                </pre>
              </div>
            </section>
          </Reveal>

          {/* Architecture */}
          <Reveal animation="fade-up" delay={100}>
            <section id="architecture" className="space-y-6 scroll-mt-24">
              <div className="border-b border-[#E5EDF5] pb-4">
                <span className="text-xs font-semibold text-[#533AFD] uppercase tracking-wider">Under The Hood</span>
                <h2 className="text-2xl font-bold text-[#0A2540] tracking-tight mt-1">
                  System Architecture
                </h2>
                <p className="text-[#50617A] text-sm mt-2">
                  Web2MCP replaces brittle handwritten web scrapers with an end-to-end autonomous discovery and protocol synthesis pipeline.
                </p>
              </div>

              <div className="p-6 rounded-lg bg-[#F8FAFD] border border-[#E5EDF5] font-mono text-xs text-[#061B31] space-y-4 shadow-[0_1px_2px_rgba(50,50,93,0.04)]">
                <div className="text-[#50617A] mb-2 font-semibold">// Web2MCP Execution Pipeline:</div>
                <div className="flex flex-col gap-2">
                  <div className="p-3 rounded-md bg-white border border-[#E5EDF5]">
                    <span className="text-[#533AFD] font-bold">1. Crawler Engine:</span> TinyFish SDK + Cheerio Fallback Driver navigates SPA/HTML, extracts forms, inputs, and catalogs.
                  </div>
                  <div className="text-center text-[#94A3B8]">↓</div>
                  <div className="p-3 rounded-md bg-white border border-[#E5EDF5]">
                    <span className="text-[#533AFD] font-bold">2. Schema Inference:</span> Synthesizes JSON Schema parameter models and filters out non-functional fields.
                  </div>
                  <div className="text-center text-[#94A3B8]">↓</div>
                  <div className="p-3 rounded-md bg-white border border-[#E5EDF5]">
                    <span className="text-amber-700 font-bold">3. Safety Gate:</span> Classifies risk levels (read_only vs consequential actions like bookings or payments).
                  </div>
                  <div className="text-center text-[#94A3B8]">↓</div>
                  <div className="p-3 rounded-md bg-white border border-[#E5EDF5]">
                    <span className="text-emerald-700 font-bold">4. Evidence Vault:</span> Runs synthetic probes, records DOM hash, validates responses, and assigns health scores.
                  </div>
                  <div className="text-center text-[#94A3B8]">↓</div>
                  <div className="p-3 rounded-md bg-white border border-[#E5EDF5]">
                    <span className="text-[#0A2540] font-bold">5. Streamable MCP Server:</span> Standard JSON-RPC 2.0 endpoint ready for Cursor, Claude, and VS Code.
                  </div>
                </div>
              </div>
            </section>
          </Reveal>

          {/* IDE & Client Integration */}
          <Reveal animation="fade-up" delay={100}>
            <section id="clients" className="space-y-6 scroll-mt-24">
              <div className="border-b border-[#E5EDF5] pb-4">
                <span className="text-xs font-semibold text-[#533AFD] uppercase tracking-wider">Setup</span>
                <h2 className="text-2xl font-bold text-[#0A2540] tracking-tight mt-1">
                  Connecting to AI Clients & IDEs
                </h2>
                <p className="text-[#50617A] text-sm mt-2">
                  Connect your generated MCP server to your favorite coding assistant in less than 30 seconds.
                </p>
              </div>

              {/* Client Cards */}
              <div className="space-y-6">
                {/* Cursor */}
                <div className="p-5 rounded-lg bg-white border border-[#E5EDF5] space-y-3 shadow-[0_2px_4px_rgba(50,50,93,0.05)] stripe-hover-card">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-[#0A2540] text-sm flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#533AFD]" /> Cursor IDE Configuration
                    </h3>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          JSON.stringify(
                            {
                              mcpServers: {
                                'web2mcp-server': {
                                  url: 'https://web2mcp.ssh.net.in/api/mcp/YOUR_PROJECT_ID/mcp',
                                  headers: {
                                    Authorization: 'Bearer YOUR_API_KEY',
                                  },
                                },
                              },
                            },
                            null,
                            2
                          ),
                          'cursor-json'
                        )
                      }
                      className="text-xs text-[#50617A] hover:text-[#0A2540] flex items-center gap-1 transition-colors"
                    >
                      {copiedKey === 'cursor-json' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedKey === 'cursor-json' ? 'Copied' : 'Copy JSON'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-[#50617A]">
                    Open <strong>Cursor Settings &gt; Features &gt; MCP</strong> and add your server as an <strong>HTTP</strong> server, or paste into <code>~/.cursor/mcp.json</code>:
                  </p>
                  <pre className="p-3 bg-[#0A2540] text-[#D6D9FC] rounded-md text-xs font-mono overflow-x-auto">
{`{
  "mcpServers": {
    "web2mcp-server": {
      "url": "https://web2mcp.ssh.net.in/api/mcp/YOUR_PROJECT_ID/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}`}
                  </pre>
                </div>

                {/* Claude Code */}
                <div className="p-5 rounded-lg bg-white border border-[#E5EDF5] space-y-3 shadow-[0_2px_4px_rgba(50,50,93,0.05)] stripe-hover-card">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-[#0A2540] text-sm flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-orange-500" /> Claude Code CLI
                    </h3>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          'claude mcp add --transport http web2mcp https://web2mcp.ssh.net.in/api/mcp/YOUR_PROJECT_ID/mcp',
                          'claude-cmd'
                        )
                      }
                      className="text-xs text-[#50617A] hover:text-[#0A2540] flex items-center gap-1 transition-colors"
                    >
                      {copiedKey === 'claude-cmd' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedKey === 'claude-cmd' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-[#50617A]">Run this command directly in your terminal:</p>
                  <pre className="p-3 bg-[#0A2540] text-amber-300 rounded-md text-xs font-mono overflow-x-auto">
                    claude mcp add --transport http web2mcp https://web2mcp.ssh.net.in/api/mcp/YOUR_PROJECT_ID/mcp
                  </pre>
                </div>

                {/* Claude Desktop */}
                <div className="p-5 rounded-lg bg-white border border-[#E5EDF5] space-y-3 shadow-[0_2px_4px_rgba(50,50,93,0.05)] stripe-hover-card">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-[#0A2540] text-sm flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#533AFD]" /> Claude Desktop
                    </h3>
                  </div>
                  <p className="text-xs text-[#50617A]">
                    Add the stdio bridge runner to <code>claude_desktop_config.json</code>:
                  </p>
                  <pre className="p-3 bg-[#0A2540] text-[#D6D9FC] rounded-md text-xs font-mono overflow-x-auto">
{`{
  "mcpServers": {
    "web2mcp": {
      "command": "npx",
      "args": ["-y", "web2mcp", "serve", "YOUR_PROJECT_ID"]
    }
  }
}`}
                  </pre>
                </div>
              </div>
            </section>
          </Reveal>

          {/* Protocol Specifications */}
          <Reveal animation="fade-up" delay={100}>
            <section id="protocol" className="space-y-6 scroll-mt-24">
              <div className="border-b border-[#E5EDF5] pb-4">
                <span className="text-xs font-semibold text-[#533AFD] uppercase tracking-wider">Standards</span>
                <h2 className="text-2xl font-bold text-[#0A2540] tracking-tight mt-1">
                  Streamable HTTP & JSON-RPC 2.0 Protocol
                </h2>
                <p className="text-[#50617A] text-sm mt-2">
                  All Web2MCP endpoints implement standard Model Context Protocol (2024-11-05 & 2025-11-25 specifications).
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-[#0A2540] text-sm">Supported Methods</h3>
                <div className="border border-[#E5EDF5] rounded-lg overflow-hidden text-xs bg-white shadow-[0_1px_2px_rgba(50,50,93,0.04)]">
                  <table className="w-full text-left">
                    <thead className="bg-[#F8FAFD] text-[#0A2540] border-b border-[#E5EDF5]">
                      <tr>
                        <th className="p-3">Method</th>
                        <th className="p-3">Description</th>
                        <th className="p-3">Sample Parameters</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5EDF5] font-mono text-[11px] text-[#3C4F69]">
                      <tr className="hover:bg-[#F8FAFD]/50 transition-colors">
                        <td className="p-3 text-[#533AFD] font-bold">initialize</td>
                        <td className="p-3 font-sans text-[#50617A]">Handshake returning server capabilities & tools list support</td>
                        <td className="p-3 text-[#64748D]">{"{ protocolVersion: '2024-11-05' }"}</td>
                      </tr>
                      <tr className="hover:bg-[#F8FAFD]/50 transition-colors">
                        <td className="p-3 text-[#533AFD] font-bold">tools/list</td>
                        <td className="p-3 font-sans text-[#50617A]">Returns array of all verified tools with typed JSON schemas</td>
                        <td className="p-3 text-[#64748D]">{"{}"}</td>
                      </tr>
                      <tr className="hover:bg-[#F8FAFD]/50 transition-colors">
                        <td className="p-3 text-[#533AFD] font-bold">tools/call</td>
                        <td className="p-3 font-sans text-[#50617A]">Executes tool action, runs validation probe & logs evidence</td>
                        <td className="p-3 text-[#64748D]">{"{ name: 'search_news', arguments: { query: 'ai' } }"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </Reveal>

          {/* Safety Gate */}
          <Reveal animation="fade-up" delay={100}>
            <section id="safety" className="space-y-6 scroll-mt-24">
              <div className="border-b border-[#E5EDF5] pb-4">
                <span className="text-xs font-semibold text-[#533AFD] uppercase tracking-wider">Security</span>
                <h2 className="text-2xl font-bold text-[#0A2540] tracking-tight mt-1">
                  Safety Gate & Consequential Actions
                </h2>
                <p className="text-[#50617A] text-sm mt-2">
                  Protect users from unintended mutations, bookings, or financial transactions.
                </p>
              </div>

              <div className="p-5 rounded-lg bg-amber-50/80 border border-amber-200 text-xs text-[#3C4F69] space-y-3 shadow-[0_1px_2px_rgba(50,50,93,0.04)] stripe-hover-card">
                <h3 className="font-bold text-[#0A2540] flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-amber-600" /> Two-Phase Consequential Execution
                </h3>
                <p className="leading-relaxed">
                  When an AI agent invokes a tool marked with <code>requiresApproval: true</code> (such as <code>book_flight</code> or <code>submit_order</code>), Web2MCP intercepts the call and issues a temporary authorization token. The user must approve the action before execution proceeds.
                </p>
              </div>
            </section>
          </Reveal>

          {/* CLI Reference */}
          <Reveal animation="fade-up" delay={100}>
            <section id="cli" className="space-y-6 scroll-mt-24">
              <div className="border-b border-[#E5EDF5] pb-4">
                <span className="text-xs font-semibold text-[#533AFD] uppercase tracking-wider">CLI Tools</span>
                <h2 className="text-2xl font-bold text-[#0A2540] tracking-tight mt-1">
                  Standalone CLI Reference
                </h2>
                <p className="text-[#50617A] text-sm mt-2 leading-relaxed">
                  The <code>web2mcp</code> CLI provides powerful commands to discover, test, serve, and configure MCP servers directly from your terminal or CI/CD pipelines.
                </p>
              </div>

              <div className="space-y-6 text-xs">
                {/* web2mcp add */}
                <div className="p-5 rounded-lg bg-white border border-[#E5EDF5] space-y-3 shadow-[0_2px_4px_rgba(50,50,93,0.05)] stripe-hover-card">
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-sm font-bold text-[#0A2540] flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#F0F3FF] text-[#533AFD] text-xs">add</span>
                      <code>web2mcp add &lt;url&gt;</code>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          'web2mcp add https://example.com/flights --goal "Search flights and fares"',
                          'cli-add-cmd'
                        )
                      }
                      className="text-xs text-[#50617A] hover:text-[#0A2540] flex items-center gap-1 transition-colors"
                    >
                      {copiedKey === 'cli-add-cmd' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedKey === 'cli-add-cmd' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-[#50617A] text-xs leading-relaxed">
                    Dispatches the crawler to explore a website, infer schema parameters with AI, execute initial probe tests, and register live MCP tools.
                  </p>
                  <div className="space-y-1.5 pt-1">
                    <p className="font-semibold text-[#0A2540] text-[11px]">Options & Flags:</p>
                    <ul className="space-y-1 text-[#50617A] font-mono text-[11px] list-disc list-inside">
                      <li><span className="font-bold text-[#3C4F69]">--goal &lt;text&gt;</span> : Operational intent (e.g. &quot;Search flights and fares&quot;)</li>
                      <li><span className="font-bold text-[#3C4F69]">--name &lt;text&gt;</span> : Custom project identifier name</li>
                      <li><span className="font-bold text-[#3C4F69]">--host &lt;url&gt;</span> : Web2MCP host domain (default: https://web2mcp.ssh.net.in)</li>
                      <li><span className="font-bold text-[#3C4F69]">--skip-probe</span> : Skip initial live probe validation step</li>
                    </ul>
                  </div>
                  <pre className="p-3 bg-[#0A2540] text-emerald-300 rounded-md text-xs font-mono overflow-x-auto">
                    web2mcp add https://example.com/flights --goal &quot;Search flights and fares&quot;
                  </pre>
                </div>

                {/* web2mcp list */}
                <div className="p-5 rounded-lg bg-white border border-[#E5EDF5] space-y-3 shadow-[0_2px_4px_rgba(50,50,93,0.05)] stripe-hover-card">
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-sm font-bold text-[#0A2540] flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#F0F3FF] text-[#533AFD] text-xs">list</span>
                      <code>web2mcp list</code>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard('web2mcp list --project proj-84bd028d', 'cli-list-cmd')
                      }
                      className="text-xs text-[#50617A] hover:text-[#0A2540] flex items-center gap-1 transition-colors"
                    >
                      {copiedKey === 'cli-list-cmd' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedKey === 'cli-list-cmd' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-[#50617A] text-xs leading-relaxed">
                    Lists all registered Web2MCP projects, target URLs, health status, and active tool endpoints.
                  </p>
                  <div className="space-y-1.5 pt-1">
                    <p className="font-semibold text-[#0A2540] text-[11px]">Options & Flags:</p>
                    <ul className="space-y-1 text-[#50617A] font-mono text-[11px] list-disc list-inside">
                      <li><span className="font-bold text-[#3C4F69]">--project &lt;id&gt;</span> : Display generated tools and detailed schema for a specific project</li>
                      <li><span className="font-bold text-[#3C4F69]">--host &lt;url&gt;</span> : Custom host domain</li>
                    </ul>
                  </div>
                  <pre className="p-3 bg-[#0A2540] text-[#D6D9FC] rounded-md text-xs font-mono overflow-x-auto">
                    web2mcp list --project proj-84bd028d
                  </pre>
                </div>

                {/* web2mcp test */}
                <div className="p-5 rounded-lg bg-white border border-[#E5EDF5] space-y-3 shadow-[0_2px_4px_rgba(50,50,93,0.05)] stripe-hover-card">
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-sm font-bold text-[#0A2540] flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#F0F3FF] text-[#533AFD] text-xs">test</span>
                      <code>web2mcp test &lt;tool_name&gt;</code>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          'web2mcp test search_flights --params "{\"origin\":\"NYC\"}"',
                          'cli-test-cmd'
                        )
                      }
                      className="text-xs text-[#50617A] hover:text-[#0A2540] flex items-center gap-1 transition-colors"
                    >
                      {copiedKey === 'cli-test-cmd' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedKey === 'cli-test-cmd' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-[#50617A] text-xs leading-relaxed">
                    Executes a live probe test against a generated tool schema to verify handler responsiveness and output structure.
                  </p>
                  <div className="space-y-1.5 pt-1">
                    <p className="font-semibold text-[#0A2540] text-[11px]">Options & Flags:</p>
                    <ul className="space-y-1 text-[#50617A] font-mono text-[11px] list-disc list-inside">
                      <li><span className="font-bold text-[#3C4F69]">--project &lt;id&gt;</span> : Filter tool matching by project ID</li>
                      <li><span className="font-bold text-[#3C4F69]">--params &lt;json&gt;</span> : Custom JSON parameter payload to pass into the probe execution</li>
                    </ul>
                  </div>
                  <pre className="p-3 bg-[#0A2540] text-amber-300 rounded-md text-xs font-mono overflow-x-auto">
                    {`web2mcp test search_flights --params '{"origin":"NYC"}'`}
                  </pre>
                </div>

                {/* web2mcp install */}
                <div className="p-5 rounded-lg bg-white border border-[#E5EDF5] space-y-3 shadow-[0_2px_4px_rgba(50,50,93,0.05)] stripe-hover-card">
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-sm font-bold text-[#0A2540] flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#F0F3FF] text-[#533AFD] text-xs">install</span>
                      <code>web2mcp install &lt;ide&gt;</code>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          'web2mcp install cursor --project proj-84bd028d',
                          'cli-install-cmd'
                        )
                      }
                      className="text-xs text-[#50617A] hover:text-[#0A2540] flex items-center gap-1 transition-colors"
                    >
                      {copiedKey === 'cli-install-cmd' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedKey === 'cli-install-cmd' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-[#50617A] text-xs leading-relaxed">
                    Auto-configures an IDE client (<code>cursor</code>, <code>claude</code>, or <code>vscode</code>) by automatically editing settings files with MCP server configurations.
                  </p>
                  <div className="space-y-1.5 pt-1">
                    <p className="font-semibold text-[#0A2540] text-[11px]">Options & Flags:</p>
                    <ul className="space-y-1 text-[#50617A] font-mono text-[11px] list-disc list-inside">
                      <li><span className="font-bold text-[#3C4F69]">--project &lt;id&gt;</span> : Target Web2MCP project ID</li>
                      <li><span className="font-bold text-[#3C4F69]">--name &lt;name&gt;</span> : Custom server identifier name in configuration</li>
                      <li><span className="font-bold text-[#3C4F69]">--host &lt;url&gt;</span> : Host domain (default: https://web2mcp.ssh.net.in)</li>
                      <li><span className="font-bold text-[#3C4F69]">--endpoint &lt;url&gt;</span> : Explicit MCP endpoint URL</li>
                      <li><span className="font-bold text-[#3C4F69]">--apiKey &lt;key&gt;</span> : Bearer API key authentication credential</li>
                    </ul>
                  </div>
                  <pre className="p-3 bg-[#0A2540] text-[#D6D9FC] rounded-md text-xs font-mono overflow-x-auto">
                    web2mcp install cursor --project proj-84bd028d
                  </pre>
                </div>

                {/* web2mcp serve */}
                <div className="p-5 rounded-lg bg-white border border-[#E5EDF5] space-y-3 shadow-[0_2px_4px_rgba(50,50,93,0.05)] stripe-hover-card">
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-sm font-bold text-[#0A2540] flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#F0F3FF] text-[#533AFD] text-xs">serve</span>
                      <code>web2mcp serve</code>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard('web2mcp serve --project proj-84bd028d', 'cli-serve-cmd')
                      }
                      className="text-xs text-[#50617A] hover:text-[#0A2540] flex items-center gap-1 transition-colors"
                    >
                      {copiedKey === 'cli-serve-cmd' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedKey === 'cli-serve-cmd' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-[#50617A] text-xs leading-relaxed">
                    Runs a local stdio Model Context Protocol (MCP) server for local IDE tools or Desktop applications (e.g. Claude Desktop).
                  </p>
                  <div className="space-y-1.5 pt-1">
                    <p className="font-semibold text-[#0A2540] text-[11px]">Options & Flags:</p>
                    <ul className="space-y-1 text-[#50617A] font-mono text-[11px] list-disc list-inside">
                      <li><span className="font-bold text-[#3C4F69]">--project &lt;id&gt;</span> : (Required) Project ID to serve over stdio</li>
                    </ul>
                  </div>
                  <pre className="p-3 bg-[#0A2540] text-[#D6D9FC] rounded-md text-xs font-mono overflow-x-auto">
                    web2mcp serve --project proj-84bd028d
                  </pre>
                </div>
              </div>
            </section>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
