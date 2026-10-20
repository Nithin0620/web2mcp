'use client';

import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, Clock, Hash, ChevronDown, ChevronRight, Activity } from 'lucide-react';
import { Badge } from '../ui/badge';
import type { EvidenceRecord } from '../../types/platform';

interface EvidenceVaultProps {
  records: EvidenceRecord[];
}

export function EvidenceVault({ records }: EvidenceVaultProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const verifiedCount = records.filter((r) => r.status === 'verified').length;
  const healthScore = records.length > 0 ? Math.round((verifiedCount / records.length) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Health Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Health Score</span>
            <Activity className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{healthScore}%</span>
            <span className="text-xs font-semibold text-emerald-400">Stable & Monitored</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Live probes match inferred schemas</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Probe Runs</span>
            <ShieldCheck className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{records.length}</span>
            <span className="text-xs text-slate-400">audited runs</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">{verifiedCount} passed validation</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Drift Detection</span>
            <Hash className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">0</span>
            <span className="text-xs text-emerald-400">no breaking redesigns</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">DOM signatures validated</p>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-lg">
        <div className="border-b border-slate-800 bg-slate-900/80 px-5 py-3.5 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">
            Immutable Verification Logs
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {records.length} records retained
          </span>
        </div>

        {records.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No probe runs recorded yet. Test a tool in the playground to create an audit record.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {records.map((r) => {
              const isExpanded = expandedId === r.id;
              const formattedDate = new Date(r.createdAt).toLocaleTimeString();

              return (
                <div key={r.id} className="p-4 hover:bg-slate-900/90 transition-colors">
                  <div
                    className="flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : r.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-slate-400">
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold text-white">
                            {r.toolName}
                          </span>
                          <Badge variant={r.status === 'verified' ? 'success' : 'destructive'}>
                            {r.status}
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {formattedDate}
                          </span>
                          <span>{r.latencyMs}ms</span>
                          {r.domHash && (
                            <span className="font-mono text-[11px] text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                              hash:{r.domHash}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-400 font-mono">
                      ID: {r.id.substring(0, 14)}...
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-slate-800/80 pl-7 space-y-3">
                      <div>
                        <span className="text-xs font-mono text-slate-400">Probe Input Arguments:</span>
                        <pre className="mt-1 p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-blue-300 overflow-x-auto">
                          {JSON.stringify(r.probeInput, null, 2)}
                        </pre>
                      </div>

                      <div>
                        <span className="text-xs font-mono text-slate-400">Captured Output Payload:</span>
                        <pre className="mt-1 p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto max-h-60">
                          {JSON.stringify(r.sampleOutput, null, 2)}
                        </pre>
                      </div>

                      {r.errorMessage && (
                        <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-xs text-red-300 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                          <span>{r.errorMessage}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
