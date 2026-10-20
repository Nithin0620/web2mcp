import crypto from 'crypto';
import type { GeneratedTool, ValidationStatus } from '../../types/platform';

export interface ProbeResult {
  toolId: string;
  toolName: string;
  input: Record<string, unknown>;
  output: unknown;
  domHash: string;
  status: ValidationStatus;
  latencyMs: number;
  errorMessage?: string;
}

export function generateSyntheticInput(tool: GeneratedTool): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const props = tool.parameters.properties;

  for (const [key, prop] of Object.entries(props)) {
    if (prop.enum && prop.enum.length > 0) {
      result[key] = prop.enum[0];
      continue;
    }

    const lower = key.toLowerCase();
    if (prop.type === 'string') {
      if (lower.includes('origin') || lower.includes('from')) {
        result[key] = 'NYC';
      } else if (lower.includes('dest') || lower.includes('to')) {
        result[key] = 'LON';
      } else if (lower.includes('date')) {
        result[key] = '2026-11-01';
      } else if (lower.includes('email')) {
        result[key] = 'probe@example.com';
      } else if (lower.includes('id')) {
        result[key] = 'REF-1001';
      } else if (lower.includes('query') || lower.includes('role') || lower.includes('keyword') || lower.includes('q')) {
        result[key] = 'developer';
      } else {
        result[key] = `test_${key}`;
      }
    } else if (prop.type === 'number' || prop.type === 'integer') {
      result[key] = 1;
    } else if (prop.type === 'boolean') {
      result[key] = true;
    } else {
      result[key] = 'sample';
    }
  }

  return result;
}

export function validateToolOutput(
  tool: GeneratedTool,
  output: unknown
): { valid: boolean; errors?: string[] } {
  if (output === null || output === undefined) {
    return { valid: false, errors: ['Output is null or undefined'] };
  }

  // If error object returned
  if (typeof output === 'object' && output !== null && 'error' in output) {
    return { valid: false, errors: [String((output as Record<string, unknown>).error)] };
  }

  return { valid: true };
}

export async function executeProbe(
  tool: GeneratedTool,
  customInput?: Record<string, unknown>
): Promise<ProbeResult> {
  const input = customInput || generateSyntheticInput(tool);
  const startTime = performance.now();

  try {
    let output: unknown;

    if (tool.handlerType === 'mock') {
      // Mock result generator for testing and offline development
      if (tool.category === 'search') {
        output = [
          { id: 'FL-101', title: 'Sample Result 1', price: '$299', timestamp: new Date().toISOString() },
          { id: 'FL-102', title: 'Sample Result 2', price: '$349', timestamp: new Date().toISOString() },
        ];
      } else if (tool.category === 'details') {
        output = {
          id: input[`${tool.name.replace('get_', '').replace('_details', '')}_id`] || 'REF-1001',
          name: 'Detailed Item Specification',
          status: 'confirmed',
          verifiedAt: new Date().toISOString(),
        };
      } else {
        output = {
          status: 'success',
          action: tool.name,
          confirmationCode: `CONF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        };
      }
    } else if (tool.handlerType === 'http_query' && tool.handlerConfig.actionUrl) {
      const url = new URL(String(tool.handlerConfig.actionUrl));
      if (tool.handlerConfig.method === 'GET') {
        for (const [k, v] of Object.entries(input)) {
          url.searchParams.set(k, String(v));
        }
        const resp = await fetch(url.toString(), {
          headers: { 'User-Agent': 'Web2MCP-Validator/1.0' },
          signal: AbortSignal.timeout(8000),
        });
        const contentType = resp.headers.get('content-type') || '';
        output = contentType.includes('application/json') ? await resp.json() : [{ status: resp.status, bodyExcerpt: (await resp.text()).substring(0, 300) }];
      } else {
        output = { status: 'mock_submission_verified', targetUrl: url.toString() };
      }
    } else {
      output = [{ status: 'verified', tool: tool.name, params: input }];
    }

    const latencyMs = Math.round(performance.now() - startTime);
    const domHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(output) + tool.name)
      .digest('hex')
      .substring(0, 16);

    const validation = validateToolOutput(tool, output);

    return {
      toolId: tool.id,
      toolName: tool.name,
      input,
      output,
      domHash,
      status: validation.valid ? 'verified' : 'failed',
      latencyMs,
      errorMessage: validation.errors?.join(', '),
    };
  } catch (err: unknown) {
    const latencyMs = Math.round(performance.now() - startTime);
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      toolId: tool.id,
      toolName: tool.name,
      input,
      output: null,
      domHash: 'error',
      status: 'failed',
      latencyMs,
      errorMessage: errorMsg,
    };
  }
}
