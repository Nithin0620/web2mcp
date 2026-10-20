import { initDb, db } from '../../../lib/db/client';
import { tools } from '../../../lib/db/schema';
import { executeProbe } from '../../../services/validation/probe-runner';
import type { GeneratedTool } from '../../../types/platform';

export async function testCommand(toolIdentifier: string, options: { project?: string; params?: string }) {
  await initDb();
  const allTools = await db.select().from(tools);
  const matched = allTools.find(t => t.name === toolIdentifier || t.id === toolIdentifier);

  if (!matched) {
    console.error(`❌ Tool '${toolIdentifier}' not found.`);
    process.exit(1);
  }

  let customInput: Record<string, unknown> | undefined;
  if (options.params) {
    try {
      customInput = JSON.parse(options.params);
    } catch {
      console.error('❌ Failed to parse --params JSON string.');
      process.exit(1);
    }
  }

  const generatedTool: GeneratedTool = {
    id: matched.id,
    projectId: matched.projectId,
    name: matched.name,
    description: matched.description,
    category: matched.category as any,
    parameters: JSON.parse(matched.parameters),
    handlerType: matched.handlerType as any,
    handlerConfig: JSON.parse(matched.handlerConfig),
    requiresApproval: Boolean(matched.requiresApproval),
    riskLevel: matched.riskLevel as any,
    status: matched.status as any,
    createdAt: matched.createdAt,
    updatedAt: matched.updatedAt,
  };

  console.log(`\n🧪 Testing MCP Tool: ${generatedTool.name}`);
  console.log(`Category:    ${generatedTool.category}`);
  console.log(`Risk Level:  ${generatedTool.riskLevel} (Approval Required: ${generatedTool.requiresApproval})`);

  const probeResult = await executeProbe(generatedTool, customInput);

  console.log(`\nProbe Inputs:`);
  console.log(JSON.stringify(probeResult.input, null, 2));

  console.log(`\nResponse Payload (${probeResult.latencyMs}ms - Status: ${probeResult.status}):`);
  console.log(JSON.stringify(probeResult.output, null, 2));

  if (probeResult.errorMessage) {
    console.log(`\n⚠️ Warnings / Errors: ${probeResult.errorMessage}`);
  }
}
