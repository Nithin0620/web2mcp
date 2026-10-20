'use client';

import React, { useState } from 'react';
import { Wrench, ShieldCheck, Play, Plug } from 'lucide-react';
import { ToolList } from '@/components/dashboard/tool-list';
import { EvidenceVault } from '@/components/dashboard/evidence-vault';
import { Playground } from '@/components/dashboard/playground';
import { ConnectModal } from '@/components/dashboard/connect-modal';
import type { GeneratedTool, EvidenceRecord } from '@/types/platform';

interface DashboardClientProps {
  projectId: string;
  projectName: string;
  apiKey: string;
  endpointUrl: string;
  initialTools: GeneratedTool[];
  initialEvidence: EvidenceRecord[];
}

export function ProjectDashboardClient({
  projectId,
  projectName,
  apiKey,
  endpointUrl,
  initialTools,
  initialEvidence,
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'tools' | 'evidence' | 'playground' | 'connect'>('tools');
  const [tools] = useState<GeneratedTool[]>(initialTools);
  const [evidenceList, setEvidenceList] = useState<EvidenceRecord[]>(initialEvidence);
  const [toolToTest, setToolToTest] = useState<GeneratedTool | null>(initialTools[0] || null);

  const handleSelectToolForTesting = (tool: GeneratedTool) => {
    setToolToTest(tool);
    setActiveTab('playground');
  };

  const handleEvidenceRecorded = (newRecord: EvidenceRecord) => {
    setEvidenceList((prev) => [newRecord, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 space-x-1 sm:space-x-4">
        <button
          onClick={() => setActiveTab('tools')}
          className={`flex items-center gap-2 pb-3.5 px-3 text-sm font-medium border-b-2 transition-all ${
            activeTab === 'tools'
              ? 'border-blue-500 text-white font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wrench className="h-4 w-4" /> Generated Tools ({tools.length})
        </button>

        <button
          onClick={() => setActiveTab('evidence')}
          className={`flex items-center gap-2 pb-3.5 px-3 text-sm font-medium border-b-2 transition-all ${
            activeTab === 'evidence'
              ? 'border-blue-500 text-white font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="h-4 w-4" /> Evidence Vault & Health
        </button>

        <button
          onClick={() => setActiveTab('playground')}
          className={`flex items-center gap-2 pb-3.5 px-3 text-sm font-medium border-b-2 transition-all ${
            activeTab === 'playground'
              ? 'border-blue-500 text-white font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Play className="h-4 w-4" /> Testing Playground
        </button>

        <button
          onClick={() => setActiveTab('connect')}
          className={`flex items-center gap-2 pb-3.5 px-3 text-sm font-medium border-b-2 transition-all ${
            activeTab === 'connect'
              ? 'border-blue-500 text-white font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Plug className="h-4 w-4" /> Connect to IDE
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'tools' && (
          <ToolList
            tools={tools}
            onSelectToolForTesting={handleSelectToolForTesting}
          />
        )}

        {activeTab === 'evidence' && (
          <EvidenceVault records={evidenceList} />
        )}

        {activeTab === 'playground' && (
          <Playground
            projectId={projectId}
            tools={tools}
            selectedTool={toolToTest}
            onEvidenceRecorded={handleEvidenceRecorded}
          />
        )}

        {activeTab === 'connect' && (
          <ConnectModal
            projectId={projectId}
            projectName={projectName}
            apiKey={apiKey}
            endpointUrl={endpointUrl}
          />
        )}
      </div>
    </div>
  );
}
