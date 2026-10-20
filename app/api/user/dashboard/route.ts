import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db/client';
import { projects, tools, evidence } from '@/lib/db/schema';
import { eq, inArray, desc } from 'drizzle-orm';
import { getSessionFromTokens } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  await initDb();

  try {
    const userSessionToken = req.cookies.get('web2mcp_session')?.value;
    const anonSessionToken = req.cookies.get('web2mcp_anon')?.value;
    const session = await getSessionFromTokens(userSessionToken, anonSessionToken);

    if (session.type !== 'user' || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized: Please log in to view your dashboard.', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Fetch all user's projects
    const userProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(desc(projects.createdAt));

    const projectIds = userProjects.map((p) => p.id);

    // If user has no projects, return empty statistics
    if (projectIds.length === 0) {
      return NextResponse.json({
        user: session.user,
        metrics: {
          totalProjects: 0,
          activeProjects: 0,
          totalTools: 0,
          totalCalls: 0,
          successCalls: 0,
          failedCalls: 0,
          successRate: 100,
          avgLatencyMs: 0,
          creditsRemaining: session.creditsRemaining,
          creditsUsed: session.user.creditsUsed,
          tier: session.user.tier,
        },
        projects: [],
        recentCalls: [],
      });
    }

    // Fetch all tools for user's projects
    const allTools = await db
      .select()
      .from(tools)
      .where(inArray(tools.projectId, projectIds));

    // Fetch all evidence / call logs for user's projects
    const allEvidence = await db
      .select()
      .from(evidence)
      .where(inArray(evidence.projectId, projectIds))
      .orderBy(desc(evidence.createdAt));

    // Aggregate overall metrics
    const totalCalls = allEvidence.length;
    const successCalls = allEvidence.filter((e) => e.status !== 'failed').length;
    const failedCalls = allEvidence.filter((e) => e.status === 'failed').length;
    const successRate = totalCalls > 0 ? Math.round((successCalls / totalCalls) * 1000) / 10 : 100;
    const totalLatency = allEvidence.reduce((acc, curr) => acc + (curr.latencyMs || 0), 0);
    const avgLatencyMs = totalCalls > 0 ? Math.round(totalLatency / totalCalls) : 0;

    // Map projects with per-MCP statistics
    const projectMap = new Map<string, string>();
    userProjects.forEach((p) => projectMap.set(p.id, p.name));

    const enrichedProjects = userProjects.map((proj) => {
      const projEvidence = allEvidence.filter((e) => e.projectId === proj.id);
      const projTools = allTools.filter((t) => t.projectId === proj.id);

      const projCalls = projEvidence.length;
      const projSuccess = projEvidence.filter((e) => e.status !== 'failed').length;
      const projSuccessRate = projCalls > 0 ? Math.round((projSuccess / projCalls) * 1000) / 10 : 100;
      const projLatencyTotal = projEvidence.reduce((acc, curr) => acc + (curr.latencyMs || 0), 0);
      const projAvgLatency = projCalls > 0 ? Math.round(projLatencyTotal / projCalls) : 0;
      const lastCallTime = projEvidence.length > 0 ? projEvidence[0].createdAt : null;

      // Tool breakdown for this project
      const toolsWithMetrics = projTools.map((t) => {
        const toolCalls = projEvidence.filter((e) => e.toolName === t.name || e.toolId === t.id);
        const lastToolCall = toolCalls.length > 0 ? toolCalls[0].createdAt : null;

        let parsedParams = {};
        try {
          parsedParams = JSON.parse(t.parameters);
        } catch {}

        return {
          id: t.id,
          name: t.name,
          description: t.description,
          category: t.category,
          parameters: parsedParams,
          requiresApproval: Boolean(t.requiresApproval),
          riskLevel: t.riskLevel,
          callCount: toolCalls.length,
          lastCalledAt: lastToolCall,
        };
      });

      return {
        id: proj.id,
        name: proj.name,
        targetUrl: proj.targetUrl,
        goal: proj.goal,
        status: proj.status,
        apiKey: proj.apiKey,
        createdAt: proj.createdAt,
        updatedAt: proj.updatedAt,
        totalCalls: projCalls,
        successRate: projSuccessRate,
        avgLatencyMs: projAvgLatency,
        lastCallTime,
        tools: toolsWithMetrics,
      };
    });

    // Recent 30 calls across all user MCPs
    const recentCalls = allEvidence.slice(0, 30).map((e) => {
      let parsedInput = {};
      let parsedOutput: any = null;
      try {
        parsedInput = JSON.parse(e.probeInput);
      } catch {
        parsedInput = e.probeInput;
      }
      try {
        parsedOutput = JSON.parse(e.sampleOutput);
      } catch {
        parsedOutput = e.sampleOutput;
      }

      return {
        id: e.id,
        projectId: e.projectId,
        projectName: projectMap.get(e.projectId) || e.projectId,
        toolName: e.toolName,
        status: e.status,
        latencyMs: e.latencyMs,
        probeInput: parsedInput,
        sampleOutput: parsedOutput,
        errorMessage: e.errorMessage,
        createdAt: e.createdAt,
      };
    });

    return NextResponse.json({
      user: session.user,
      metrics: {
        totalProjects: userProjects.length,
        activeProjects: userProjects.filter((p) => p.status !== 'archived').length,
        totalTools: allTools.length,
        totalCalls,
        successCalls,
        failedCalls,
        successRate,
        avgLatencyMs,
        creditsRemaining: session.creditsRemaining,
        creditsUsed: session.user.creditsUsed,
        tier: session.user.tier,
      },
      projects: enrichedProjects,
      recentCalls,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Error fetching dashboard data:', err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
