'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '../ui/button';

interface ConnectModalProps {
  projectId: string;
  projectName: string;
  apiKey: string;
  endpointUrl: string;
}

export function ConnectModal({ projectId, projectName, apiKey, endpointUrl }: ConnectModalProps) {
  const [activeTab, setActiveTab] = useState<'cursor' | 'claude' | 'vscode' | 'cli'>('cursor');
  const [copied, setCopied] = useState(false);

  const fullEndpoint = typeof window !== 'undefined'
    ? `${window.location.origin}${endpointUrl}`
    : `http://localhost:3000${endpointUrl}`;

  const serverKey = `web2mcp-${projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  const cursorJson = JSON.stringify(
    {
      mcpServers: {
        [serverKey]: {
          url: fullEndpoint,
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        },
      },
    },
    null,
    2
  );

  const claudeJson = JSON.stringify(
    {
      mcpServers: {
        [serverKey]: {
          url: fullEndpoint,
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        },
      },
    },
    null,
    2
  );

  const vscodeJson = JSON.stringify(
    {
      'mcp.servers': {
        [serverKey]: {
          url: fullEndpoint,
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        },
      },
    },
    null,
    2
  );

  const cliCommand = `web2mcp install ${activeTab === 'vscode' ? 'vscode' : activeTab === 'claude' ? 'claude' : 'cursor'} --project ${projectId}`;

  const activeSnippet =
    activeTab === 'cursor' ? cursorJson : activeTab === 'claude' ? claudeJson : activeTab === 'vscode' ? vscodeJson : cliCommand;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-[#E5EDF5] bg-white p-6 shadow-[0_2px_4px_rgba(50,50,93,0.05)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#E5EDF5] gap-4">
        <div>
          <h2 className="text-lg font-semibold text-[#0A2540] flex items-center gap-2">
            🔌 Connect Live MCP Server to AI Clients
          </h2>
          <p className="text-sm text-[#50617A]">
            Use these MCP tools instantly in Claude Desktop, Cursor, or VS Code.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-[#F8FAFD] p-1 rounded-md border border-[#E5EDF5]">
          {(['cursor', 'claude', 'vscode', 'cli'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === tab
                  ? 'bg-[#533AFD] text-white shadow-sm'
                  : 'text-[#50617A] hover:text-[#0A2540]'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-[#50617A]">
            {activeTab === 'cursor' && 'Add to ~/.cursor/mcp.json:'}
            {activeTab === 'claude' && 'Add to claude_desktop_config.json:'}
            {activeTab === 'vscode' && 'Add to .vscode/settings.json:'}
            {activeTab === 'cli' && 'Run in terminal:'}
          </span>
          <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 text-xs gap-1.5 text-[#50617A] hover:text-[#0A2540]">
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied!' : 'Copy Config'}
          </Button>
        </div>

        <pre className="p-4 rounded-md bg-[#0A2540] text-[#D6D9FC] border border-[#1A2C44] font-mono text-xs overflow-x-auto">
          {activeSnippet}
        </pre>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-[#50617A] pt-3 border-t border-[#E5EDF5]">
        <span>Bearer API Key: <code className="text-[#0A2540] bg-[#F8FAFD] px-1.5 py-0.5 rounded border border-[#E5EDF5]">{apiKey}</code></span>
        <span className="text-emerald-700 font-semibold flex items-center gap-1">● Live Streamable HTTP Ready</span>
      </div>
    </div>
  );
}
