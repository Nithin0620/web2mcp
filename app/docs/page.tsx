'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Terminal,
  Cpu,
  Shield,
  Layers,
  Code2,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  Server,
  Zap,
  Sparkles,
} from 'lucide-react';

const SECTIONS = [
  { id: 'quickstart', title: 'Quickstart', icon: Zap },
  { id: 'architecture', title: 'System Architecture', icon: Layers },
  { id: 'clients', title: 'IDE & Client Integration', icon: Terminal },
  { id: 'protocol', title: 'Streamable MCP Protocol', icon: Server },
  { id: 'safety', title: 'Safety Gate & Approvals', icon: Shield },
  { id: 'evidence', title: 'Evidence Vault & Audits', icon: Cpu },
  { id: 'cli', title: 'CLI Tool Reference', icon: Code2 },
  { id: 'api', title: 'REST API Reference', icon: BookOpen },
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
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sticky Sidebar Navigation */}
        <aside className="lg:w-64 shrink-0">
          <div className="sticky top-24 space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2 px-3">
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
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{sec.title}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-3">
              <div className="flex items-center gap-2 text-white font-semibold">
                <Sparkles className="h-4 w-4 text-blue-400" />
                <span>Need an MCP now?</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Generate verified MCP tools for any site in seconds.
              </p>
              <Link
                href="/projects/new"
                className="block text-center py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-xs transition-colors"
              >
                Launch Generator
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Documentation Content */}
        <div className="flex-1 max-w-4xl space-y-16">
          {/* Quickstart */}
          <section id="quickstart" className="space-y-6 scroll-mt-24">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Getting Started</span>
              <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
                Web2MCP Quickstart Guide
              </h1>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                Web2MCP transforms human-facing websites, web applications, and internal portals into live, verified Model Context Protocol (MCP) endpoints for Cursor, Claude, VS Code, and autonomous AI agents.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">How to generate your first MCP server in 3 steps:</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-blue-400">Step 1</span>
                  <h3 className="font-semibold text-white text-sm">Provide Target URL</h3>
                  <p className="text-xs text-slate-400">
                    Input any web address (e.g., flight booking, ecommerce, portal, or search catalog).
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-blue-400">Step 2</span>
                  <h3 className="font-semibold text-white text-sm">Autonomous Exploration</h3>
                  <p className="text-xs text-slate-400">
                    TinyFish crawler inspects DOM forms, buttons, inputs, schemas, and verifies probes live.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-blue-400">Step 3</span>
                  <h3 className="font-semibold text-white text-sm">Connect to AI IDE</h3>
                  <p className="text-xs text-slate-400">
                    Copy the Streamable HTTP endpoint or run 1-click CLI installer into Cursor / Claude.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Test CLI */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400">Try via Web2MCP CLI</span>
                <button
                  onClick={() => copyToClipboard('npx web2mcp add https://news.ycombinator.com', 'cli-quickstart')}
                  className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  {copiedKey === 'cli-quickstart' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedKey === 'cli-quickstart' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="text-xs font-mono text-blue-300 overflow-x-auto p-2 bg-slate-900 rounded-lg">
                npx web2mcp add https://news.ycombinator.com
              </pre>
            </div>
          </section>

          {/* Architecture */}
          <section id="architecture" className="space-y-6 scroll-mt-24">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Under The Hood</span>
              <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
                System Architecture
              </h2>
              <p className="text-slate-400 text-sm mt-2">
                Web2MCP replaces brittle handwritten web scrapers with an end-to-end autonomous discovery and protocol synthesis pipeline.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 font-mono text-xs text-slate-300 space-y-4">
              <div className="text-slate-400 mb-2">// Web2MCP Execution Pipeline:</div>
              <div className="flex flex-col gap-2">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-blue-400 font-bold">1. Crawler Engine:</span> TinyFish SDK + Cheerio Fallback Driver navigates SPA/HTML, extracts forms, inputs, and catalogs.
                </div>
                <div className="text-center text-slate-600">↓</div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-purple-400 font-bold">2. Schema Inference:</span> Synthesizes JSON Schema parameter models and filters out non-functional fields.
                </div>
                <div className="text-center text-slate-600">↓</div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-amber-400 font-bold">3. Safety Gate:</span> Classifies risk levels (read_only vs consequential actions like bookings or payments).
                </div>
                <div className="text-center text-slate-600">↓</div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-emerald-400 font-bold">4. Evidence Vault:</span> Runs synthetic probes, records DOM hash, validates responses, and assigns health scores.
                </div>
                <div className="text-center text-slate-600">↓</div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-cyan-400 font-bold">5. Streamable MCP Server:</span> Standard JSON-RPC 2.0 endpoint ready for Cursor, Claude, and VS Code.
                </div>
              </div>
            </div>
          </section>

          {/* IDE & Client Integration */}
          <section id="clients" className="space-y-6 scroll-mt-24">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Setup</span>
              <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
                Connecting to AI Clients & IDEs
              </h2>
              <p className="text-slate-400 text-sm mt-2">
                Connect your generated MCP server to your favorite coding assistant in less than 30 seconds.
              </p>
            </div>

            {/* Client Tabs */}
            <div className="space-y-6">
              {/* Cursor */}
              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" /> Cursor IDE Configuration
                  </h3>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        JSON.stringify(
                          {
                            mcpServers: {
                              'web2mcp-server': {
                                url: 'https://web2mcp.com/api/mcp/YOUR_PROJECT_ID/mcp',
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
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    {copiedKey === 'cursor-json' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedKey === 'cursor-json' ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  Open <strong>Cursor Settings &gt; Features &gt; MCP</strong> and add your server as an <strong>HTTP</strong> server, or paste into <code>~/.cursor/mcp.json</code>:
                </p>
                <pre className="p-3 bg-slate-950 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto">
{`{
  "mcpServers": {
    "web2mcp-server": {
      "url": "https://web2mcp.com/api/mcp/YOUR_PROJECT_ID/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}`}
                </pre>
              </div>

              {/* Claude Code */}
              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-orange-400" /> Claude Code CLI
                  </h3>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        'claude mcp add --transport http web2mcp https://web2mcp.com/api/mcp/YOUR_PROJECT_ID/mcp',
                        'claude-cmd'
                      )
                    }
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    {copiedKey === 'claude-cmd' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedKey === 'claude-cmd' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-400">Run this command directly in your terminal:</p>
                <pre className="p-3 bg-slate-950 rounded-lg text-xs font-mono text-orange-300 overflow-x-auto">
                  claude mcp add --transport http web2mcp https://web2mcp.com/api/mcp/YOUR_PROJECT_ID/mcp
                </pre>
              </div>

              {/* Claude Desktop */}
              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-purple-400" /> Claude Desktop
                  </h3>
                </div>
                <p className="text-xs text-slate-400">
                  Add the stdio bridge runner to <code>claude_desktop_config.json</code>:
                </p>
                <pre className="p-3 bg-slate-950 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto">
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

          {/* Protocol Specifications */}
          <section id="protocol" className="space-y-6 scroll-mt-24">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Standards</span>
              <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
                Streamable HTTP & JSON-RPC 2.0 Protocol
              </h2>
              <p className="text-slate-400 text-sm mt-2">
                All Web2MCP endpoints implement standard Model Context Protocol (2024-11-05 & 2025-11-25 specifications).
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-white text-sm">Supported Methods</h3>
              <div className="border border-slate-800 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">Method</th>
                      <th className="p-3">Description</th>
                      <th className="p-3">Sample Parameters</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px] text-slate-300">
                    <tr>
                      <td className="p-3 text-blue-400 font-bold">initialize</td>
                      <td className="p-3 font-sans text-slate-400">Handshake returning server capabilities & tools list support</td>
                      <td className="p-3 text-slate-500">{"{ protocolVersion: '2024-11-05' }"}</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-blue-400 font-bold">tools/list</td>
                      <td className="p-3 font-sans text-slate-400">Returns array of all verified tools with typed JSON schemas</td>
                      <td className="p-3 text-slate-500">{"{}"}</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-blue-400 font-bold">tools/call</td>
                      <td className="p-3 font-sans text-slate-400">Executes tool action, runs validation probe & logs evidence</td>
                      <td className="p-3 text-slate-500">{"{ name: 'search_news', arguments: { query: 'ai' } }"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Safety Gate */}
          <section id="safety" className="space-y-6 scroll-mt-24">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Security</span>
              <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
                Safety Gate & Consequential Actions
              </h2>
              <p className="text-slate-400 text-sm mt-2">
                Protect users from unintended mutations, bookings, or financial transactions.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs text-slate-300 space-y-3">
              <h3 className="font-bold text-amber-300 flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-amber-400" /> Two-Phase Consequential Execution
              </h3>
              <p className="leading-relaxed">
                When an AI agent invokes a tool marked with <code>requiresApproval: true</code> (such as <code>book_flight</code> or <code>submit_order</code>), Web2MCP intercepts the call and issues a temporary authorization token. The user must approve the action before execution proceeds.
              </p>
            </div>
          </section>

          {/* CLI Reference */}
          <section id="cli" className="space-y-6 scroll-mt-24">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">CLI Tools</span>
              <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
                Standalone CLI Reference
              </h2>
              <p className="text-slate-400 text-sm mt-2">
                Use <code>web2mcp</code> directly from your terminal or CI/CD pipelines.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <p className="font-mono text-emerald-400 font-bold">web2mcp add &lt;url&gt; [--goal &quot;...&quot;]</p>
                <p className="text-slate-400">Dispatches crawler, creates project, infers tools, and outputs live endpoint.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <p className="font-mono text-emerald-400 font-bold">web2mcp test &lt;projectId&gt; [toolName]</p>
                <p className="text-slate-400">Executes synthetic validation probes against active MCP tools.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <p className="font-mono text-emerald-400 font-bold">web2mcp install &lt;projectId&gt; --client [cursor|claude|code]</p>
                <p className="text-slate-400">Automatically registers the MCP server into local IDE settings files.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <p className="font-mono text-emerald-400 font-bold">web2mcp list</p>
                <p className="text-slate-400">Lists all active projects and healthy endpoints.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
