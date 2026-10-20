'use client';

import React, { useEffect, useRef } from 'react';
import { Terminal, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export interface TerminalLog {
  id: string;
  step: string;
  message: string;
  timestamp: string;
}

interface LiveTerminalProps {
  logs: TerminalLog[];
  isComplete: boolean;
  error?: string | null;
}

export function LiveTerminal({ logs, isComplete, error }: LiveTerminalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getStepBadgeColor = (step: string) => {
    switch (step) {
      case 'tinyfish':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'extracting':
      case 'generating':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'complete':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'error':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      default:
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="w-full rounded-xl border border-slate-800 bg-slate-950/90 shadow-2xl overflow-hidden font-mono text-xs">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 px-4 py-2.5">
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 rounded-full bg-red-500/80" />
          <div className="h-3 w-3 rounded-full bg-amber-500/80" />
          <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
          <span className="ml-2 flex items-center gap-1.5 text-slate-400 font-sans text-xs font-medium">
            <Terminal className="h-3.5 w-3.5" /> Web2MCP Autonomous Exploration Stream
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!isComplete && !error && (
            <span className="flex items-center gap-1 text-blue-400 text-[11px]">
              <Loader2 className="h-3 w-3 animate-spin" /> Live Crawler Active
            </span>
          )}
          {isComplete && (
            <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
              <CheckCircle2 className="h-3 w-3" /> Tools Verified
            </span>
          )}
          {error && (
            <span className="flex items-center gap-1 text-red-400 text-[11px]">
              <AlertCircle className="h-3 w-3" /> Failed
            </span>
          )}
        </div>
      </div>

      {/* Terminal Output */}
      <div
        ref={scrollRef}
        className="h-64 overflow-y-auto p-4 space-y-2 text-slate-300 scroll-smooth leading-relaxed"
      >
        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-2.5">
            <span className="text-slate-500 select-none">{log.timestamp}</span>
            <span
              className={`px-1.5 py-0.5 rounded border text-[10px] font-semibold uppercase tracking-wider ${getStepBadgeColor(
                log.step
              )}`}
            >
              {log.step}
            </span>
            <span className="flex-1">{log.message}</span>
          </div>
        ))}

        {!isComplete && !error && (
          <div className="flex items-center gap-2 text-blue-400 pt-1">
            <span className="inline-block h-3.5 w-1.5 animate-pulse bg-blue-500" />
            <span className="text-slate-500 italic">Processing DOM and inferring schema...</span>
          </div>
        )}

        {error && (
          <div className="p-3 mt-2 rounded bg-red-950/40 border border-red-800/50 text-red-300">
            Error: {error}
          </div>
        )}
      </div>
    </div>
  );
}
