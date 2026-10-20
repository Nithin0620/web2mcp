'use client';

import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Play, Code, ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import type { GeneratedTool } from '../../types/platform';

interface ToolListProps {
  tools: GeneratedTool[];
  onSelectToolForTesting?: (tool: GeneratedTool) => void;
}

export function ToolList({ tools, onSelectToolForTesting }: ToolListProps) {
  const [expandedToolId, setExpandedToolId] = useState<string | null>(tools[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedToolId(expandedToolId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {tools.map((tool) => {
        const isExpanded = expandedToolId === tool.id;
        const paramKeys = Object.keys(tool.parameters.properties || {});

        return (
          <div
            key={tool.id}
            className="rounded-lg border border-[#E5EDF5] bg-white p-5 transition-all hover:border-[#CFD8E3] shadow-[0_1px_2px_rgba(50,50,93,0.04)]"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div
                className="flex items-start gap-3 cursor-pointer flex-1"
                onClick={() => toggleExpand(tool.id)}
              >
                <div className="mt-1 text-[#50617A]">
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-mono text-base font-semibold text-[#0A2540]">
                      {tool.name}
                    </h3>
                    <Badge variant={tool.category === 'search' ? 'default' : tool.category === 'action' ? 'warning' : 'secondary'}>
                      {tool.category}
                    </Badge>
                    {tool.requiresApproval ? (
                      <Badge variant="destructive" className="gap-1">
                        <ShieldAlert className="h-3 w-3" /> Requires Human Approval
                      </Badge>
                    ) : (
                      <Badge variant="success" className="gap-1">
                        <ShieldCheck className="h-3 w-3" /> Safe (Read-Only)
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-[#50617A]">{tool.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pl-7 md:pl-0">
                {onSelectToolForTesting && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-xs text-[#533AFD] border-[#E5EDF5] hover:bg-[#F8FAFD]"
                    onClick={() => onSelectToolForTesting(tool)}
                  >
                    <Play className="h-3 w-3 fill-current" /> Test in Playground
                  </Button>
                )}
              </div>
            </div>

            {/* Expanded JSON Schema Inspector */}
            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-[#E5EDF5] pl-7">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#64748D] mb-3 flex items-center gap-1.5">
                  <Code className="h-3.5 w-3.5" /> Inferred JSON Schema Parameters ({paramKeys.length})
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  {paramKeys.map((key) => {
                    const prop = tool.parameters.properties[key];
                    const isRequired = tool.parameters.required?.includes(key);

                    return (
                      <div
                        key={key}
                        className="p-3 rounded-lg bg-[#F8FAFD] border border-[#E5EDF5] flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-semibold text-[#533AFD]">
                            {key}
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-mono text-[#50617A] bg-white border border-[#E5EDF5] px-1.5 py-0.5 rounded">
                              {prop.type}
                            </span>
                            {isRequired && (
                              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                required
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="mt-1.5 text-xs text-[#50617A] leading-snug">
                          {prop.description}
                        </p>
                        {prop.enum && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {prop.enum.map((e) => (
                              <span
                                key={String(e)}
                                className="text-[10px] font-mono bg-white border border-[#E5EDF5] text-[#0A2540] px-1.5 py-0.5 rounded"
                              >
                                {String(e)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 text-xs text-[#64748D]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Handler: {tool.handlerType} driver · Evidence audit active
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
