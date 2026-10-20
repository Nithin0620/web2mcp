/**
 * Web2MCP Platform Types & Definitions
 */

export type ProjectStatus = 'idle' | 'exploring' | 'generating' | 'ready' | 'error';

export interface Project {
  id: string;
  name: string;
  targetUrl: string;
  goal?: string | null;
  status: ProjectStatus;
  apiKey: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ToolCategory = 'search' | 'details' | 'action' | 'navigation';
export type ToolRiskLevel = 'read_only' | 'mutating' | 'consequential';

export interface ToolParameterProperty {
  type: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object';
  description: string;
  enum?: (string | number)[];
  default?: string | number | boolean;
}

export interface ToolParametersSchema {
  type: 'object';
  properties: Record<string, ToolParameterProperty>;
  required?: string[];
  additionalProperties?: boolean;
}

export interface GeneratedTool {
  id: string;
  projectId: string;
  name: string;
  description: string;
  category: ToolCategory;
  parameters: ToolParametersSchema;
  handlerType: 'tinyfish' | 'selector' | 'http_query' | 'mock';
  handlerConfig: Record<string, unknown>;
  requiresApproval: boolean;
  riskLevel: ToolRiskLevel;
  status: 'active' | 'degraded' | 'broken';
  createdAt: Date;
  updatedAt: Date;
}

export interface ExtractedFormField {
  name: string;
  type: string; // 'text', 'select', 'number', 'date', 'checkbox', etc.
  label?: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // for select/radio
  defaultValue?: string;
  selector?: string;
}

export interface ExtractedForm {
  id?: string;
  action?: string;
  method: string;
  fields: ExtractedFormField[];
  submitButtonText?: string;
  purposeGuess?: string;
}

export interface ExtractedListContainer {
  containerSelector: string;
  itemSelector: string;
  sampleItemsCount: number;
  extractedFields: string[]; // e.g. ['title', 'price', 'link', 'date']
  pagination?: {
    type: 'numbered' | 'next_button' | 'cursor';
    nextSelector?: string;
  };
}

export interface PageExplorationResult {
  url: string;
  title: string;
  cleanMarkdown: string;
  forms: ExtractedForm[];
  listContainers: ExtractedListContainer[];
  navigationLinks: { text: string; href: string }[];
  inferredSiteType?: string;
}

export type ValidationStatus = 'verified' | 'failed' | 'warning' | 'drift_detected';

export interface EvidenceRecord {
  id: string;
  projectId: string;
  toolId: string;
  toolName: string;
  probeInput: Record<string, unknown>;
  sampleOutput: unknown;
  domHash?: string;
  status: ValidationStatus;
  latencyMs: number;
  errorMessage?: string | null;
  createdAt: Date;
}

export interface MCPToolDefinition {
  name: string;
  description: string;
  inputSchema: ToolParametersSchema;
}

export interface MCPCallResult {
  content: Array<{
    type: 'text' | 'image' | 'resource';
    text?: string;
    data?: string;
    mimeType?: string;
  }>;
  isError?: boolean;
  requiresApproval?: boolean;
  approvalToken?: string;
  evidenceId?: string;
}

export interface IDEConfigInstallResult {
  ide: 'cursor' | 'claude' | 'vscode' | 'windsurf';
  configPath: string;
  updated: boolean;
  serverName: string;
}
