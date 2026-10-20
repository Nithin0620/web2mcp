'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Layers,
  Sparkles,
  Activity,
  Zap,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Clock,
  RefreshCw,
  Trash2,
  Key,
  Server,
  ArrowRight,
  BarChart3,
  Shield,
  Code2,
  Terminal,
  AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth/auth-context';

interface ToolMetric {
  id: string;
  name: string;
  description: string;
  category: string;
  parameters: any;
  requiresApproval: boolean;
  riskLevel: string;
  callCount: number;
  lastCalledAt: string | null;
}

interface ProjectData {
  id: string;
  name: string;
  targetUrl: string;
  goal: string | null;
  status: string;
  apiKey: string;
  createdAt: string;
  updatedAt: string;
  totalCalls: number;
  successRate: number;
  avgLatencyMs: number;
  lastCallTime: string | null;
  tools: ToolMetric[];
}

interface RecentCall {
  id: string;
  projectId: string;
  projectName: string;
  toolName: string;
  status: string;
  latencyMs: number;
  probeInput: any;
  sampleOutput: any;
  errorMessage: string | null;
  createdAt: string;
}

interface DashboardMetrics {
  totalProjects: number;
  activeProjects: number;
  totalTools: number;
  totalCalls: number;
  successCalls: number;
  failedCalls: number;
  successRate: number;
  avgLatencyMs: number;
  creditsRemaining: number;
  creditsUsed: number;
  tier: string;
}

export function UserDashboardClient() {
  const router = useRouter();
  const { user, authenticated, loading: authLoading, openAuthModal } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [projectsList, setProjectsList] = useState<ProjectData[]>([]);
  const [recentCalls, setRecentCalls] = useState<RecentCall[]>([]);
  
  // UI states
  const [activeTab, setActiveTab] = useState<'mcps' | 'calls' | 'integrations'>('mcps');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [selectedCallPayload, setSelectedCallPayload] = useState<RecentCall | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);

  // Fetch dashboard data
  const fetchDashboardData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    try {
      const res = await fetch('/api/user/dashboard');
      if (res.status === 401) {
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setMetrics(data.metrics);
        setProjectsList(data.projects || []);
        setRecentCalls(data.recentCalls || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
      if (isManualRefresh) setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (authenticated) {
        fetchDashboardData();
      } else {
        setLoading(false);
      }
    }
  }, [authenticated, authLoading]);

  // Copy helper
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Delete project
  const handleDeleteProject = async (projectId: string, projectName: string) => {
    if (!confirm(`Are you sure you want to delete "${projectName}"? This will also remove its tools and invocation history.`)) {
      return;
    }

    setDeletingId(projectId);
    try {
      const res = await fetch(`/api/user/projects/${projectId}`, { method: 'DELETE' });
      if (res.ok) {
        setProjectsList((prev) => prev.filter((p) => p.id !== projectId));
        // Refresh metrics
        fetchDashboardData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete project');
      }
    } catch (err) {
      console.error('Failed to delete project:', err);
    } finally {
      setDeletingId(null);
    }
  };

  // Regenerate API key
  const handleRegenerateKey = async (projectId: string) => {
    if (!confirm('Regenerating this API key will invalidate any external clients currently using it. Proceed?')) {
      return;
    }

    setRegeneratingId(projectId);
    try {
      const res = await fetch(`/api/user/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'regenerate_key' }),
      });
      if (res.ok) {
        const data = await res.json();
        setProjectsList((prev) =>
          prev.map((p) => (p.id === projectId ? { ...p, apiKey: data.apiKey } : p))
        );
      }
    } catch (err) {
      console.error('Failed to regenerate key:', err);
    } finally {
      setRegeneratingId(null);
    }
  };

  // Filter projects by search
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projectsList;
    const q = searchQuery.toLowerCase();
    return projectsList.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.targetUrl.toLowerCase().includes(q) ||
        p.tools.some((t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
    );
  }, [projectsList, searchQuery]);

  // Unauthenticated guard
  if (!authLoading && !authenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="h-16 w-16 mx-auto rounded-2xl bg-[#533AFD]/10 text-[#533AFD] flex items-center justify-center">
          <Shield className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-[#0A2540]">
            Sign in to access your MCP Dashboard
          </h1>
          <p className="text-[#50617A] max-w-md mx-auto text-sm leading-relaxed">
            View all your created MCP servers, monitor live tool invocations, track response latencies, and configure AI clients in one place.
          </p>
        </div>
        <div className="pt-2 flex justify-center gap-3">
          <Button
            onClick={() => openAuthModal('login')}
            className="bg-[#533AFD] hover:bg-[#5452FB] text-white shadow-sm font-medium px-6"
          >
            Sign In
          </Button>
          <Button
            variant="outline"
            onClick={() => openAuthModal('register')}
            className="border-[#D6D9FC] text-[#533AFD] hover:bg-[#F8FAFD]"
          >
            Create Free Account
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8 bg-transparent text-[#061B31] dark:text-[#F8FAFC]">
      {/* Top Banner / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#E5EDF5]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0A2540]">
              MCP Command Center
            </h1>
            <Badge variant="secondary" className="capitalize text-xs font-semibold bg-[#EEF2F6] text-[#0A2540]">
              {metrics?.tier || user?.tier || 'Free'} Tier
            </Badge>
          </div>
          <p className="text-sm text-[#50617A] mt-1">
            Manage your live Model Context Protocol servers and monitor automated agent usage.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className="h-9 gap-1.5 text-xs text-[#50617A] hover:text-[#0A2540] border-[#E5EDF5]"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Link href="/projects/new">
            <Button size="sm" className="h-9 gap-1.5 text-xs bg-[#533AFD] hover:bg-[#5452FB] text-white shadow-sm font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              New MCP Server
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Ribbon (4 Metric Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total MCPs */}
        <Card className="p-5 border-[#E5EDF5] hover:border-[#D6D9FC] transition-colors shadow-sm bg-gradient-to-br from-white to-[#F8FAFD]">
          <div className="flex items-center justify-between text-[#50617A] mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">MCP Servers</span>
            <div className="h-7 w-7 rounded-md bg-[#533AFD]/10 text-[#533AFD] flex items-center justify-center">
              <Server className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#0A2540] tracking-tight">
            {metrics?.totalProjects ?? 0}
          </div>
          <div className="text-[11px] text-[#50617A] mt-1 flex items-center gap-1">
            <span className="font-semibold text-emerald-600">{metrics?.totalTools ?? 0}</span> live tools deployed
          </div>
        </Card>

        {/* Total Calls */}
        <Card className="p-5 border-[#E5EDF5] hover:border-[#D6D9FC] transition-colors shadow-sm bg-gradient-to-br from-white to-[#F8FAFD]">
          <div className="flex items-center justify-between text-[#50617A] mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Calls</span>
            <div className="h-7 w-7 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#0A2540] tracking-tight">
            {metrics?.totalCalls ?? 0}
          </div>
          <div className="text-[11px] text-[#50617A] mt-1 flex items-center gap-1">
            <span className="font-semibold text-emerald-600">{metrics?.successCalls ?? 0}</span> successful invocations
          </div>
        </Card>

        {/* Avg Latency */}
        <Card className="p-5 border-[#E5EDF5] hover:border-[#D6D9FC] transition-colors shadow-sm bg-gradient-to-br from-white to-[#F8FAFD]">
          <div className="flex items-center justify-between text-[#50617A] mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Avg Latency</span>
            <div className="h-7 w-7 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#0A2540] tracking-tight">
            {metrics?.avgLatencyMs ?? 0} <span className="text-sm font-normal text-[#50617A]">ms</span>
          </div>
          <div className="text-[11px] text-[#50617A] mt-1 flex items-center gap-1">
            TinyFish browser automation & API speed
          </div>
        </Card>

        {/* Success Rate & Credits */}
        <Card className="p-5 border-[#E5EDF5] hover:border-[#D6D9FC] transition-colors shadow-sm bg-gradient-to-br from-white to-[#F8FAFD]">
          <div className="flex items-center justify-between text-[#50617A] mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Reliability & Quota</span>
            <div className="h-7 w-7 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#0A2540] tracking-tight">
            {metrics?.successRate ?? 100}%
          </div>
          <div className="text-[11px] text-[#50617A] mt-1 flex items-center justify-between">
            <span>Quota Remaining:</span>
            <span className="font-semibold text-[#533AFD]">{metrics?.creditsRemaining ?? user?.creditsRemaining ?? 0} credits</span>
          </div>
        </Card>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center justify-between border-b border-[#E5EDF5] pb-px">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('mcps')}
            className={`pb-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${
              activeTab === 'mcps'
                ? 'text-[#533AFD] border-b-2 border-[#533AFD]'
                : 'text-[#50617A] hover:text-[#0A2540]'
            }`}
          >
            <Server className="h-4 w-4" />
            My MCP Servers
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-[#EEF2F6] text-[#0A2540] font-semibold">
              {projectsList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('calls')}
            className={`pb-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${
              activeTab === 'calls'
                ? 'text-[#533AFD] border-b-2 border-[#533AFD]'
                : 'text-[#50617A] hover:text-[#0A2540]'
            }`}
          >
            <Activity className="h-4 w-4" />
            Call History & Evidence
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-[#EEF2F6] text-[#0A2540] font-semibold">
              {recentCalls.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('integrations')}
            className={`pb-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${
              activeTab === 'integrations'
                ? 'text-[#533AFD] border-b-2 border-[#533AFD]'
                : 'text-[#50617A] hover:text-[#0A2540]'
            }`}
          >
            <Code2 className="h-4 w-4" />
            Client Setup Guides
          </button>
        </div>
      </div>

      {/* TAB 1: MY MCP SERVERS */}
      {activeTab === 'mcps' && (
        <div className="space-y-5">
          {/* Search bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#7A8B9E]" />
              <Input
                placeholder="Search MCPs or tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs border-[#E5EDF5] bg-white"
              />
            </div>
            <div className="text-xs text-[#50617A]">
              Showing <span className="font-semibold text-[#0A2540]">{filteredProjects.length}</span> of {projectsList.length} servers
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <Card className="py-16 text-center border-dashed border-[#E5EDF5] bg-[#FAFBFD]">
              <div className="h-12 w-12 rounded-xl bg-[#533AFD]/10 text-[#533AFD] flex items-center justify-center mx-auto mb-3">
                <Server className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-[#0A2540]">No MCP servers found</h3>
              <p className="text-xs text-[#50617A] max-w-sm mx-auto mt-1 mb-4">
                {searchQuery
                  ? 'No MCP servers match your current search criteria.'
                  : 'You have not created any MCP servers yet. Turn any website into live tools in seconds.'}
              </p>
              <Link href="/projects/new">
                <Button size="sm" className="gap-1.5 text-xs bg-[#533AFD] hover:bg-[#5452FB] text-white">
                  <Sparkles className="h-3.5 w-3.5" />
                  Create First MCP
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => {
                const isExpanded = expandedProjectId === project.id;
                const claudeConfigSnippet = JSON.stringify(
                  {
                    mcpServers: {
                      [project.name.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'web2mcp-server']: {
                        command: 'npx',
                        args: [
                          '-y',
                          'web2mcp-client',
                          `http://localhost:3000/api/mcp/${project.id}/mcp`,
                          project.apiKey,
                        ],
                      },
                    },
                  },
                  null,
                  2
                );

                const cursorConfigSnippet = JSON.stringify(
                  {
                    name: project.name,
                    type: 'sse',
                    url: `http://localhost:3000/api/mcp/${project.id}/mcp`,
                    headers: {
                      Authorization: `Bearer ${project.apiKey}`,
                    },
                  },
                  null,
                  2
                );

                return (
                  <Card
                    key={project.id}
                    className="overflow-hidden border-[#E5EDF5] hover:border-[#D6D9FC] transition-all shadow-sm"
                  >
                    <div className="p-5">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Title & Metadata */}
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h3 className="text-base font-semibold text-[#0A2540] truncate">
                              {project.name}
                            </h3>
                            <Badge
                              variant="outline"
                              className="text-[10px] font-medium border-emerald-200 bg-emerald-50 text-emerald-700 capitalize flex items-center gap-1"
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              {project.status || 'Active'}
                            </Badge>
                            <span className="text-[11px] text-[#7A8B9E]">
                              ID: <code className="bg-[#F8FAFD] px-1 py-0.5 rounded text-[10px]">{project.id}</code>
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-[#50617A]">
                            <a
                              href={project.targetUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 hover:text-[#533AFD] transition-colors truncate max-w-xs"
                            >
                              <ExternalLink className="h-3 w-3 shrink-0" />
                              <span className="truncate">{project.targetUrl}</span>
                            </a>
                            <span>•</span>
                            <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Per-MCP Metric Badges */}
                        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                          <div className="bg-[#F8FAFD] border border-[#E5EDF5] px-3 py-1.5 rounded-lg text-center min-w-[75px]">
                            <div className="text-[10px] uppercase font-semibold text-[#7A8B9E]">Calls</div>
                            <div className="text-sm font-bold text-[#0A2540]">{project.totalCalls}</div>
                          </div>

                          <div className="bg-[#F8FAFD] border border-[#E5EDF5] px-3 py-1.5 rounded-lg text-center min-w-[75px]">
                            <div className="text-[10px] uppercase font-semibold text-[#7A8B9E]">Latency</div>
                            <div className="text-sm font-bold text-[#0A2540]">{project.avgLatencyMs}ms</div>
                          </div>

                          <div className="bg-[#F8FAFD] border border-[#E5EDF5] px-3 py-1.5 rounded-lg text-center min-w-[75px]">
                            <div className="text-[10px] uppercase font-semibold text-[#7A8B9E]">Tools</div>
                            <div className="text-sm font-bold text-[#533AFD]">{project.tools.length}</div>
                          </div>

                          <div className="bg-[#F8FAFD] border border-[#E5EDF5] px-3 py-1.5 rounded-lg text-center min-w-[75px]">
                            <div className="text-[10px] uppercase font-semibold text-[#7A8B9E]">Success</div>
                            <div className="text-sm font-bold text-emerald-600">{project.successRate}%</div>
                          </div>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="mt-4 pt-4 border-t border-[#F0F4F8] flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Claude Config Copy */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(claudeConfigSnippet, `claude-${project.id}`)}
                            className="h-8 gap-1.5 text-xs border-[#E5EDF5] hover:border-[#D6D9FC] hover:text-[#533AFD]"
                          >
                            {copiedId === `claude-${project.id}` ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-600" />
                                <span className="text-emerald-600">Claude Config Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3 text-[#7A8B9E]" />
                                Copy Claude Config
                              </>
                            )}
                          </Button>

                          {/* Cursor Config Copy */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(cursorConfigSnippet, `cursor-${project.id}`)}
                            className="h-8 gap-1.5 text-xs border-[#E5EDF5] hover:border-[#D6D9FC] hover:text-[#533AFD]"
                          >
                            {copiedId === `cursor-${project.id}` ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-600" />
                                <span className="text-emerald-600">Cursor Config Copied!</span>
                              </>
                            ) : (
                              <>
                                <Code2 className="h-3 w-3 text-[#7A8B9E]" />
                                Copy Cursor Config
                              </>
                            )}
                          </Button>

                          {/* Open Playground */}
                          <Link href={`/projects/${project.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 gap-1.5 text-xs border-[#E5EDF5] hover:border-[#D6D9FC] hover:text-[#533AFD]"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Interactive Playground
                            </Button>
                          </Link>

                          {/* Toggle Tools Dropdown */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedProjectId(isExpanded ? null : project.id)}
                            className="h-8 gap-1 text-xs text-[#50617A] hover:text-[#0A2540]"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronDown className="h-3.5 w-3.5" /> Hide Tools ({project.tools.length})
                              </>
                            ) : (
                              <>
                                <ChevronRight className="h-3.5 w-3.5" /> View Tools ({project.tools.length})
                              </>
                            )}
                          </Button>
                        </div>

                        {/* Dangerous / Key Actions */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRegenerateKey(project.id)}
                            disabled={regeneratingId === project.id}
                            title="Regenerate API Key"
                            className="h-8 px-2 text-xs text-[#50617A] hover:text-[#0A2540]"
                          >
                            <Key className={`h-3.5 w-3.5 ${regeneratingId === project.id ? 'animate-spin' : ''}`} />
                            <span className="hidden sm:inline ml-1">Regen Key</span>
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProject(project.id, project.name)}
                            disabled={deletingId === project.id}
                            title="Delete MCP Server"
                            className="h-8 px-2 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Collapsible Tools Breakdown */}
                    {isExpanded && (
                      <div className="border-t border-[#E5EDF5] bg-[#F8FAFD] p-5 space-y-3">
                        <div className="text-xs font-semibold uppercase tracking-wider text-[#50617A] flex items-center justify-between">
                          <span>Exposed MCP Tools & Invocation Breakdown</span>
                          <span className="text-[11px] font-normal normal-case">
                            Endpoint: <code className="bg-white px-1.5 py-0.5 rounded border border-[#E5EDF5]">/api/mcp/{project.id}/mcp</code>
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {project.tools.map((tool) => (
                            <div
                              key={tool.id}
                              className="p-3 rounded-lg bg-white border border-[#E5EDF5] space-y-1.5 shadow-sm"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-xs font-semibold text-[#533AFD]">
                                  {tool.name}
                                </span>
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] bg-[#EEF2F6] text-[#0A2540]"
                                >
                                  {tool.callCount} calls
                                </Badge>
                              </div>
                              <p className="text-[11px] text-[#50617A] line-clamp-2">
                                {tool.description}
                              </p>
                              <div className="flex items-center gap-2 pt-1 text-[10px] text-[#7A8B9E]">
                                <span>Category: {tool.category}</span>
                                {tool.requiresApproval && (
                                  <span className="text-amber-600 font-semibold flex items-center gap-0.5">
                                    <Shield className="h-2.5 w-2.5" /> Approval Gate
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CALL HISTORY & EVIDENCE */}
      {activeTab === 'calls' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-[#0A2540]">Live Request & Invocation Stream</h3>
              <p className="text-xs text-[#50617A]">
                Real-time audit log of tools executed by Claude Desktop, Cursor, or AI agents.
              </p>
            </div>
            <Badge variant="outline" className="text-xs text-[#533AFD] border-[#D6D9FC]">
              {recentCalls.length} Recorded Invocations
            </Badge>
          </div>

          {recentCalls.length === 0 ? (
            <Card className="py-16 text-center border-dashed border-[#E5EDF5] bg-[#FAFBFD]">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-[#0A2540]">No calls recorded yet</h3>
              <p className="text-xs text-[#50617A] max-w-sm mx-auto mt-1 mb-4">
                Connect your MCP server to Claude Desktop or execute probes in the playground to see live invocation logs here.
              </p>
            </Card>
          ) : (
            <Card className="overflow-hidden border-[#E5EDF5] shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFD] border-b border-[#E5EDF5] text-[#50617A] uppercase text-[10px] font-semibold tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Tool Name</th>
                      <th className="py-3 px-4">MCP Server</th>
                      <th className="py-3 px-4">Execution Latency</th>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4 text-right">Payload</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5EDF5]">
                    {recentCalls.map((call) => (
                      <tr key={call.id} className="hover:bg-[#FAFBFD] transition-colors">
                        <td className="py-3 px-4">
                          {call.status === 'failed' ? (
                            <Badge variant="destructive" className="text-[10px] gap-1 py-0.5">
                              <XCircle className="h-3 w-3" /> Failed
                            </Badge>
                          ) : (
                            <Badge className="text-[10px] gap-1 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Success
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-[#0A2540]">
                          {call.toolName}
                        </td>
                        <td className="py-3 px-4 text-[#50617A] max-w-[180px] truncate">
                          {call.projectName}
                        </td>
                        <td className="py-3 px-4 font-mono text-[#0A2540]">
                          {call.latencyMs} ms
                        </td>
                        <td className="py-3 px-4 text-[#7A8B9E] whitespace-nowrap">
                          {new Date(call.createdAt).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedCallPayload(call)}
                            className="h-7 text-[11px] border-[#E5EDF5] text-[#533AFD] hover:bg-[#F8FAFD]"
                          >
                            Inspect Payload
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* TAB 3: CLIENT SETUP GUIDES */}
      {activeTab === 'integrations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Claude Desktop */}
          <Card className="p-6 border-[#E5EDF5] space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#533AFD]/10 text-[#533AFD] flex items-center justify-center font-bold">
                C
              </div>
              <div>
                <h3 className="font-semibold text-base text-[#0A2540]">Claude Desktop Integration</h3>
                <p className="text-xs text-[#50617A]">Add your MCP server to Claude Desktop via config file.</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[#50617A]">
              <p>1. Open Claude Desktop settings or edit configuration directly at:</p>
              <code className="block bg-[#F8FAFD] p-2.5 rounded border border-[#E5EDF5] font-mono text-[11px] text-[#0A2540] overflow-x-auto">
                ~/.config/Claude/claude_desktop_config.json
              </code>
              <p>2. Copy the config snippet from any of your MCP servers in the <strong>My MCP Servers</strong> tab and paste inside the <code className="text-[#533AFD]">mcpServers</code> dictionary.</p>
              <p>3. Restart Claude Desktop. Your tools will appear with a hammer icon in every prompt.</p>
            </div>
          </Card>

          {/* Cursor AI */}
          <Card className="p-6 border-[#E5EDF5] space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#0A2540]/10 text-[#0A2540] flex items-center justify-center font-bold">
                ⚙️
              </div>
              <div>
                <h3 className="font-semibold text-base text-[#0A2540]">Cursor AI Editor</h3>
                <p className="text-xs text-[#50617A]">Connect Web2MCP tools directly to Cursor Composer.</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[#50617A]">
              <p>1. Open <strong>Cursor Settings → Features → MCP</strong>.</p>
              <p>2. Click <strong>+ Add New MCP Server</strong>.</p>
              <p>3. Choose <strong>SSE</strong> as type and provide the endpoint URL and Project API Key from your dashboard.</p>
              <p>4. Your agent can now browse and query the target website live during code generation.</p>
            </div>
          </Card>
        </div>
      )}

      {/* Payload Inspection Modal */}
      {selectedCallPayload && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full border border-[#E5EDF5] shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-[#E5EDF5] flex items-center justify-between bg-[#F8FAFD]">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-[#533AFD]" />
                <h3 className="text-sm font-semibold text-[#0A2540]">
                  Invocation Trace: {selectedCallPayload.toolName}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCallPayload(null)}
                className="h-7 w-7 p-0 text-[#7A8B9E] hover:text-[#0A2540]"
              >
                ✕
              </Button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div>
                <span className="text-[10px] font-semibold uppercase text-[#7A8B9E] block mb-1">
                  Parameters Sent by AI
                </span>
                <pre className="p-3 bg-[#061B31] text-[#E5EDF5] rounded-lg font-mono text-[11px] overflow-x-auto">
                  {JSON.stringify(selectedCallPayload.probeInput, null, 2)}
                </pre>
              </div>

              <div>
                <span className="text-[10px] font-semibold uppercase text-[#7A8B9E] block mb-1">
                  Execution Result / Evidence Output
                </span>
                <pre className="p-3 bg-[#061B31] text-[#E5EDF5] rounded-lg font-mono text-[11px] overflow-x-auto max-h-64">
                  {typeof selectedCallPayload.sampleOutput === 'string'
                    ? selectedCallPayload.sampleOutput
                    : JSON.stringify(selectedCallPayload.sampleOutput, null, 2)}
                </pre>
              </div>

              {selectedCallPayload.errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs">
                  <strong>Error:</strong> {selectedCallPayload.errorMessage}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#E5EDF5] flex justify-end bg-[#FAFBFD]">
              <Button
                size="sm"
                onClick={() => setSelectedCallPayload(null)}
                className="bg-[#533AFD] hover:bg-[#5452FB] text-white text-xs"
              >
                Close Inspector
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
