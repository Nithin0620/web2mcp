'use client';

import React from 'react';
import { Terminal, CheckCircle2 } from 'lucide-react';

const TOOLS = [
  {
    name: 'Cursor',
    type: 'Editor & Composer',
    badge: 'Native MCP',
    iconColor: '#000000',
    darkIconColor: '#FFFFFF',
    desc: 'Stream tools into Cursor Composer and Chat with 1-click install',
  },
  {
    name: 'Claude',
    type: 'Desktop & Code',
    badge: 'Official Protocol',
    iconColor: '#D97706',
    darkIconColor: '#F59E0B',
    desc: 'Full stdio & streamable HTTP transport for Claude Desktop & Code CLI',
  },
  {
    name: 'VS Code',
    type: 'GitHub Copilot & Roo',
    badge: 'Verified Extension',
    iconColor: '#0284C7',
    darkIconColor: '#38BDF8',
    desc: 'Connect live endpoints via VS Code MCP extension or Cline/Roo Code',
  },
  {
    name: 'Windsurf',
    type: 'Cascade Agent',
    badge: 'Full Tool Loop',
    iconColor: '#10B981',
    darkIconColor: '#34D399',
    desc: 'Equip Windsurf Cascade with real-time website exploration and actions',
  },
];

export function ToolEcosystem() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 space-y-6">
      <div className="text-center space-y-1.5">
        <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#533AFD] dark:text-[#A5B4FC] font-semibold">
          ONE SOURCE. YOUR FAVORITE TOOLS.
        </p>
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0A2540] dark:text-white">
          A clearer path from docs and live websites to code
        </h3>
        <p className="text-xs text-[#50617A] dark:text-[#94A3B8] max-w-lg mx-auto">
          Standard Model Context Protocol (JSON-RPC 2.0). Connect once, query anywhere.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {TOOLS.map((tool) => (
          <div
            key={tool.name}
            className="p-4 rounded-xl bg-white dark:bg-[#0D1527] border border-[#E5EDF5] dark:border-[#1E293B] shadow-[0_2px_4px_rgba(50,50,93,0.03)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:border-[#CFD8E3] dark:hover:border-[#334155] transition-all flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#0A2540] dark:text-white group-hover:text-[#533AFD] dark:group-hover:text-[#A5B4FC] transition-colors">
                  {tool.name}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-medium bg-[#F8FAFD] dark:bg-[#131E35] border border-[#E5EDF5] dark:border-[#1E293B] text-[#50617A] dark:text-[#94A3B8]">
                  {tool.badge}
                </span>
              </div>
              <p className="text-[11px] text-[#50617A] dark:text-[#94A3B8] leading-relaxed">
                {tool.desc}
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-[#E5EDF5] dark:border-[#1E293B] flex items-center justify-between text-[10px] font-mono text-[#64748D] dark:text-[#94A3B8]">
              <span>{tool.type}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Ready
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
