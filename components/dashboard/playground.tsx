'use client';

import React, { useState, useEffect } from 'react';
import { Play, Loader2, ShieldAlert, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import type { GeneratedTool, EvidenceRecord } from '../../types/platform';
import { generateSyntheticInput } from '../../services/validation/probe-runner';

interface PlaygroundProps {
  projectId: string;
  tools: GeneratedTool[];
  selectedTool?: GeneratedTool | null;
  onEvidenceRecorded?: (evidence: EvidenceRecord) => void;
}

export function Playground({ projectId, tools, selectedTool: initialSelectedTool, onEvidenceRecorded }: PlaygroundProps) {
  const [activeTool, setActiveTool] = useState<GeneratedTool | null>(initialSelectedTool || tools[0] || null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [approvalToken, setApprovalToken] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialSelectedTool) {
      setActiveTool(initialSelectedTool);
    }
  }, [initialSelectedTool]);

  useEffect(() => {
    if (activeTool) {
      // Auto-populate with synthetic default values
      const defaults = generateSyntheticInput(activeTool);
      setFormValues(defaults);
      setResponse(null);
      setError(null);
      setApprovalToken('');
    }
  }, [activeTool]);

  const handleInputChange = (key: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleRun = async () => {
    if (!activeTool) return;
    setLoading(true);
    setError(null);
    setResponse(null);

    const startTime = performance.now();

    try {
      const args = { ...formValues };
      if (activeTool.requiresApproval && approvalToken) {
        args.approvalToken = approvalToken;
      }

      const res = await fetch(`/api/mcp/${projectId}/mcp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: {
            name: activeTool.name,
            arguments: args,
          },
        }),
      });

      const elapsed = Math.round(performance.now() - startTime);
      setLatency(elapsed);

      const data = await res.json();
      setResponse(data);

      if (data.result?.requiresApproval && data.result?.approvalToken) {
        setApprovalToken(data.result.approvalToken);
      }

      if (onEvidenceRecorded && !data.error) {
        // notify parent
        onEvidenceRecorded({
          id: `ev-play-${Date.now()}`,
          projectId,
          toolId: activeTool.id,
          toolName: activeTool.name,
          probeInput: args,
          sampleOutput: data.result?.content || data,
          status: data.result?.isError ? 'warning' : 'verified',
          latencyMs: elapsed,
          createdAt: new Date(),
        });
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!activeTool) {
    return <div className="text-slate-400">No tools available to test.</div>;
  }

  const properties = activeTool.parameters.properties || {};

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Tool Selector & Form Inputs */}
      <div className="lg:col-span-5 space-y-5">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
            Select Active Tool
          </label>
          <div className="space-y-1.5">
            {tools.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTool(t)}
                className={`w-full text-left p-3 rounded-lg border text-xs font-mono transition-all flex items-center justify-between ${
                  activeTool.id === t.id
                    ? 'border-blue-500 bg-blue-500/10 text-white font-bold'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span>{t.name}</span>
                <span className="text-[10px] uppercase">{t.category}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-semibold text-white text-sm">Parameters</h3>
              <p className="text-xs text-slate-400">{activeTool.description}</p>
            </div>
            {activeTool.requiresApproval && (
              <Badge variant="destructive" className="gap-1 text-[11px]">
                <ShieldAlert className="h-3 w-3" /> Consequential
              </Badge>
            )}
          </div>

          <div className="space-y-3">
            {Object.entries(properties).map(([key, prop]) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-mono text-slate-300">
                    {key}
                    {activeTool.parameters.required?.includes(key) && (
                      <span className="text-amber-400 ml-1">*</span>
                    )}
                  </label>
                  <span className="text-[10px] text-slate-500">{prop.type}</span>
                </div>

                {prop.enum && prop.enum.length > 0 ? (
                  <select
                    value={formValues[key] || ''}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {prop.enum.map((opt) => (
                      <option key={String(opt)} value={String(opt)}>
                        {String(opt)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    value={formValues[key] ?? ''}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    placeholder={prop.description}
                    className="h-8 text-xs font-mono bg-slate-950"
                  />
                )}
              </div>
            ))}

            {activeTool.requiresApproval && (
              <div className="pt-2 border-t border-slate-800/80">
                <label className="text-xs font-mono text-amber-400 flex items-center gap-1 mb-1">
                  <ShieldAlert className="h-3.5 w-3.5" /> Approval Token (Safety Gate)
                </label>
                <Input
                  value={approvalToken}
                  onChange={(e) => setApprovalToken(e.target.value)}
                  placeholder="Click Execute to request or paste CONFIRM_xxxx"
                  className="h-8 text-xs font-mono bg-amber-950/20 border-amber-800/50 text-amber-300 placeholder:text-amber-600/50"
                />
              </div>
            )}
          </div>

          <Button
            onClick={handleRun}
            disabled={loading}
            className="w-full gap-2 text-xs mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Executing Tool Call...
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" /> Execute {activeTool.name}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Response Panel */}
      <div className="lg:col-span-7">
        <div className="rounded-xl border border-slate-800 bg-slate-950/90 p-5 h-full flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                MCP Response Stream
              </span>
              {latency !== null && (
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> {latency}ms
                </span>
              )}
            </div>

            {loading && (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                <span className="text-xs font-mono">Calling target site and generating audit trace...</span>
              </div>
            )}

            {!loading && response && (
              <div className="mt-4 space-y-3">
                {response.result?.requiresApproval && (
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
                    <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">Safety Gate Intercepted:</span>
                      <p className="mt-0.5 text-slate-300">
                        {response.result.content?.[0]?.text}
                      </p>
                    </div>
                  </div>
                )}

                <pre className="p-4 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-blue-300 overflow-x-auto max-h-[480px]">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
            )}

            {!loading && !response && !error && (
              <div className="py-24 text-center text-slate-500 text-xs font-mono">
                Ready to execute. Adjust parameters and click &quot;Execute&quot; to test live.
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 rounded-lg bg-red-950/40 border border-red-800 text-xs text-red-300 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>Error: {error}</span>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-500 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span>Standard JSON-RPC 2.0 / MCP Protocol</span>
            <span className="text-blue-400">Automated Audit Snapshots</span>
          </div>
        </div>
      </div>
    </div>
  );
}
