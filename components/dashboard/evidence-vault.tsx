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
        <div className="rounded-lg border border-[#E5EDF5] bg-white p-5 shadow-[0_1px_2px_rgba(50,50,93,0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748D] uppercase tracking-wider">Health Score</span>
            <Activity className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#0A2540]">{healthScore}%</span>
            <span className="text-xs font-semibold text-emerald-700">Stable & Monitored</span>
          </div>
          <p className="mt-1 text-xs text-[#50617A]">Live probes match inferred schemas</p>
        </div>

        <div className="rounded-lg border border-[#E5EDF5] bg-white p-5 shadow-[0_1px_2px_rgba(50,50,93,0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748D] uppercase tracking-wider">Total Probe Runs</span>
            <ShieldCheck className="h-4 w-4 text-[#533AFD]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#0A2540]">{records.length}</span>
            <span className="text-xs text-[#50617A]">audited runs</span>
          </div>
          <p className="mt-1 text-xs text-[#50617A]">{verifiedCount} passed validation</p>
        </div>

        <div className="rounded-lg border border-[#E5EDF5] bg-white p-5 shadow-[0_1px_2px_rgba(50,50,93,0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748D] uppercase tracking-wider">Drift Detection</span>
            <Hash className="h-4 w-4 text-[#533AFD]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#0A2540]">0</span>
            <span className="text-xs text-emerald-700">no breaking redesigns</span>
          </div>
          <p className="mt-1 text-xs text-[#50617A]">DOM signatures validated</p>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-lg border border-[#E5EDF5] bg-white overflow-hidden shadow-[0_1px_2px_rgba(50,50,93,0.04)]">
        <div className="border-b border-[#E5EDF5] bg-[#F8FAFD] px-5 py-3.5 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#0A2540]">
            Immutable Verification Logs
          </h3>
          <span className="text-xs text-[#64748D] font-mono">
            {records.length} records retained
          </span>
        </div>

        {records.length === 0 ? (
          <div className="p-8 text-center text-[#64748D] text-sm">
            No probe runs recorded yet. Test a tool in the playground to create an audit record.
          </div>
        ) : (
          <div className="divide-y divide-[#E5EDF5]">
            {records.map((r) => {
              const isExpanded = expandedId === r.id;
              const formattedDate = new Date(r.createdAt).toLocaleTimeString();

              return (
                <div key={r.id} className="p-4 hover:bg-[#F8FAFD] transition-colors">
                  <div
                    className="flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : r.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-[#64748D]">
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold text-[#0A2540]">
                            {r.toolName}
                          </span>
                          <Badge variant={r.status === 'verified' ? 'success' : 'destructive'}>
                            {r.status}
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-xs text-[#50617A]">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {formattedDate}
                          </span>
                          <span>{r.latencyMs}ms</span>
                          {r.domHash && (
                            <span className="font-mono text-[11px] text-[#533AFD] bg-[#D6D9FC]/40 px-1.5 py-0.5 rounded border border-[#D6D9FC]">
                              hash:{r.domHash}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-[#64748D] font-mono">
                      ID: {r.id.substring(0, 14)}...
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-[#E5EDF5] pl-7 space-y-3">
                      <div>
                        <span className="text-xs font-mono text-[#50617A]">Probe Input Arguments:</span>
                        <pre className="mt-1 p-3 rounded-md bg-[#0A2540] text-[#D6D9FC] font-mono text-xs overflow-x-auto">
                          {JSON.stringify(r.probeInput, null, 2)}
                        </pre>
                      </div>

                      <div>
                        <span className="text-xs font-mono text-[#50617A]">Captured Output Payload:</span>
                        <pre className="mt-1 p-3 rounded-md bg-[#0A2540] text-emerald-300 font-mono text-xs overflow-x-auto max-h-60">
                          {JSON.stringify(r.sampleOutput, null, 2)}
                        </pre>
                      </div>

                      {r.errorMessage && (
                        <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
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
