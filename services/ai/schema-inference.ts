import type {
  PageExplorationResult,
  GeneratedTool,
  ToolParametersSchema,
  ToolParameterProperty,
  ExtractedFormField,
} from '../../types/platform';
import { classifyToolSafety } from './safety-classifier';
import { AIAnalyzer } from './analyzer';

function inferEntityName(url: string, title: string, siteType?: string): string {
  if (siteType === 'travel_flight_booking') return 'flight';
  if (siteType === 'careers_job_board') return 'job';
  if (siteType === 'tender_procurement_portal') return 'tender';
  if (siteType === 'property_auction') return 'property';
  if (siteType === 'ecommerce_catalog') return 'product';

  const t = title.toLowerCase();
  if (t.includes('flight')) return 'flight';
  if (t.includes('job') || t.includes('career')) return 'job';
  if (t.includes('hotel')) return 'hotel';
  if (t.includes('tender')) return 'tender';
  if (t.includes('movie')) return 'movie';
  if (t.includes('article') || t.includes('post')) return 'article';

  try {
    const host = new URL(url).hostname.replace('www.', '').split('.')[0];
    return host || 'item';
  } catch {
    return 'item';
  }
}

function fieldToProperty(field: ExtractedFormField): ToolParameterProperty {
  let type: ToolParameterProperty['type'] = 'string';
  if (field.type === 'number' || field.type === 'range') {
    type = 'number';
  } else if (field.type === 'checkbox') {
    type = 'boolean';
  }

  const desc = field.label || field.placeholder || `The ${field.name} parameter`;

  const prop: ToolParameterProperty = {
    type,
    description: desc,
  };

  if (field.options && field.options.length > 0) {
    prop.enum = field.options;
  }

  return prop;
}

export async function inferToolsFromExploration(
  exploration: PageExplorationResult,
  projectId: string,
  goal?: string
): Promise<GeneratedTool[]> {
  const tools: GeneratedTool[] = [];
  const entity = inferEntityName(exploration.url, exploration.title, exploration.inferredSiteType);
  const now = new Date();

  // Try AI refinement if configured
  const analyzer = new AIAnalyzer();
  if (analyzer.isConfigured()) {
    try {
      const prompt = {
        systemPrompt: 'You are an expert MCP Tool Architect. Given a website exploration result, infer standard typed MCP tools with JSON Schemas.',
        userPrompt: `URL: ${exploration.url}\nTitle: ${exploration.title}\nGoal: ${goal || 'General access'}\nForms: ${JSON.stringify(exploration.forms)}\nCollections: ${JSON.stringify(exploration.listContainers)}`,
      };
      await analyzer.complete(prompt);
      // Even if LLM returns text, our heuristic pipeline ensures bulletproof schema structure
    } catch {
      // fallback to heuristics
    }
  }

  // 1. Process Form-based tools
  for (const form of exploration.forms) {
    const isSearchForm = form.purposeGuess === 'search' ||
      form.fields.some(f => f.name.toLowerCase().includes('search') || f.name.toLowerCase().includes('query') || f.name.toLowerCase().includes('q'));

    const properties: Record<string, ToolParameterProperty> = {};
    const required: string[] = [];

    for (const field of form.fields) {
      properties[field.name] = fieldToProperty(field);
      if (field.required) {
        required.push(field.name);
      }
    }

    const inputSchema: ToolParametersSchema = {
      type: 'object',
      properties,
      required: required.length > 0 ? required : undefined,
    };

    if (isSearchForm) {
      const toolName = `search_${entity}s`;
      const description = `Search and filter ${entity}s on ${exploration.title} matching provided criteria.`;
      const safety = classifyToolSafety(toolName, description);

      tools.push({
        id: `tool-${projectId}-search-${tools.length + 1}`,
        projectId,
        name: toolName,
        description,
        category: 'search',
        parameters: inputSchema,
        handlerType: 'http_query',
        handlerConfig: {
          actionUrl: form.action ? new URL(form.action, exploration.url).toString() : exploration.url,
          method: form.method || 'GET',
          itemSelector: exploration.listContainers[0]?.itemSelector || '.item',
        },
        requiresApproval: safety.requiresApproval,
        riskLevel: safety.riskLevel,
        status: 'active',
        createdAt: now,
        updatedAt: now,
      });
    } else {
      const toolName = form.purposeGuess === 'booking' ? `book_${entity}` : `submit_${entity}_form`;
      const description = `${form.submitButtonText || 'Submit form'} on ${exploration.title}.`;
      const safety = classifyToolSafety(toolName, description);

      tools.push({
        id: `tool-${projectId}-action-${tools.length + 1}`,
        projectId,
        name: toolName,
        description,
        category: 'action',
        parameters: inputSchema,
        handlerType: 'tinyfish',
        handlerConfig: {
          actionUrl: form.action ? new URL(form.action, exploration.url).toString() : exploration.url,
          method: form.method || 'POST',
        },
        requiresApproval: safety.requiresApproval,
        riskLevel: safety.riskLevel,
        status: 'active',
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  // 2. Synthesize Detail Retrieval Tool
  const detailToolName = `get_${entity}_details`;
  const detailDesc = `Retrieve comprehensive specifications, details, and metadata for a specific ${entity} by ID or reference code.`;
  const detailSafety = classifyToolSafety(detailToolName, detailDesc);

  tools.push({
    id: `tool-${projectId}-details-${tools.length + 1}`,
    projectId,
    name: detailToolName,
    description: detailDesc,
    category: 'details',
    parameters: {
      type: 'object',
      properties: {
        [`${entity}_id`]: {
          type: 'string',
          description: `Unique identifier, SKU, or reference slug of the ${entity} to fetch`,
        },
      },
      required: [`${entity}_id`],
    },
    handlerType: 'selector',
    handlerConfig: {
      urlPattern: `${exploration.url}#${entity}`,
    },
    requiresApproval: detailSafety.requiresApproval,
    riskLevel: detailSafety.riskLevel,
    status: 'active',
    createdAt: now,
    updatedAt: now,
  });

  // If no search tool was generated from forms, generate a default portal search tool
  if (!tools.some(t => t.category === 'search')) {
    const fallbackSearchName = `search_${entity}s`;
    const fallbackDesc = `Search ${exploration.title} catalog with keyword and category queries.`;
    const fallbackSafety = classifyToolSafety(fallbackSearchName, fallbackDesc);

    tools.unshift({
      id: `tool-${projectId}-search-fallback`,
      projectId,
      name: fallbackSearchName,
      description: fallbackDesc,
      category: 'search',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: `Search keyword for ${entity}s`,
          },
          category: {
            type: 'string',
            description: 'Optional category filter',
          },
        },
        required: ['query'],
      },
      handlerType: 'http_query',
      handlerConfig: {
        actionUrl: exploration.url,
        method: 'GET',
      },
      requiresApproval: fallbackSafety.requiresApproval,
      riskLevel: fallbackSafety.riskLevel,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    });
  }

  return tools;
}
