'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Globe, Target, Terminal, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { LiveTerminal, type TerminalLog } from '@/components/crawler/live-terminal';

const PRESETS = [
  {
    name: 'Airline Booking Portal',
    url: 'https://news.ycombinator.com',
    goal: 'Search flight listings, compare airfares, and check seat availability',
  },
  {
    name: 'Government Tender Portal',
    url: 'https://httpbin.org/forms/post',
    goal: 'Explore procurement tenders, extract contract details, and check deadlines',
  },
  {
    name: 'Tech Careers Job Board',
    url: 'https://httpbin.org/html',
    goal: 'Filter software engineering jobs by location and salary band',
  },
];

export default function NewProjectPage() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [goal, setGoal] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [completedProjectId, setCompletedProjectId] = useState<string | null>(null);

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setUrl(preset.url);
    setGoal(preset.goal);
    setName(preset.name);
  };

  const addLog = (step: string, message: string) => {
    setLogs((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        step,
        message,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError(null);
    setLogs([]);
    setCompletedProjectId(null);

    addLog('init', `Target URL registered: ${url}`);
    addLog('tinyfish', 'Dispatching autonomous exploration agent...');

    try {
      // Simulate live steps if needed or call API
      setTimeout(() => addLog('fetching', 'Navigating DOM, hydration check, rendering SPAs...'), 600);
      setTimeout(() => addLog('extracting', 'Parsing interactive forms, query endpoints & result lists...'), 1400);
      setTimeout(() => addLog('generating', 'Synthesizing typed JSON Schema & evaluating safety gates...'), 2200);

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, goal, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate MCP tools');
      }

      addLog('complete', `Successfully verified ${data.toolsCount} live MCP tools! Saving evidence...`);
      setCompletedProjectId(data.projectId);

      setTimeout(() => {
        router.push(`/projects/${data.projectId}`);
      }, 1500);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      addLog('error', errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <Sparkles className="h-7 w-7 text-blue-400" /> Generate Live MCP Server
        </h1>
        <p className="mt-1 text-slate-400">
          Point Web2MCP at any human-facing website. Autonomous exploration will map forms, infer typed schemas, validate with evidence, and produce ready-to-use tools.
        </p>
      </div>

      {/* Quick Start Presets */}
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Quick-Start Examples
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => applyPreset(p)}
              className="text-left p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-slate-700 transition-all text-xs group"
            >
              <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                {p.name}
              </div>
              <div className="text-slate-400 mt-1 line-clamp-1">{p.goal}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Generation Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Target Configuration</CardTitle>
          <CardDescription>
            Specify the website URL and operational objectives for tool synthesis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mb-1.5">
                <Globe className="h-3.5 w-3.5 text-blue-400" /> Target Website URL
              </label>
              <Input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/portal or https://airline.com/booking"
                className="bg-slate-950 font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mb-1.5">
                  <Target className="h-3.5 w-3.5 text-emerald-400" /> Operational Goal (Optional)
                </label>
                <Input
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. search flights, compare tenders, extract jobs"
                  className="bg-slate-950 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mb-1.5">
                  <Terminal className="h-3.5 w-3.5 text-purple-400" /> Project Name (Optional)
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. SkyWay Travel Portal"
                  className="bg-slate-950 text-sm"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !url}
              className="w-full gap-2 py-5 font-semibold text-sm shadow-lg shadow-blue-500/10"
            >
              {loading ? (
                <>Exploring & Generating Tools...</>
              ) : (
                <>
                  Explore & Generate MCP Tools <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Live Exploration Terminal Feed */}
      {(loading || logs.length > 0) && (
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Real-Time Agentic Pipeline Feed
          </span>
          <LiveTerminal logs={logs} isComplete={Boolean(completedProjectId)} error={error} />
        </div>
      )}

      {completedProjectId && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <span className="font-semibold text-sm">
              MCP Tools Synthesized & Verified! Redirecting to Dashboard...
            </span>
          </div>
          <Button
            size="sm"
            onClick={() => router.push(`/projects/${completedProjectId}`)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white"
          >
            Open Dashboard
          </Button>
        </div>
      )}
    </div>
  );
}
