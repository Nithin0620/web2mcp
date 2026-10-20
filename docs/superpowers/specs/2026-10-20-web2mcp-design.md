# Web2MCP: Turn Any Website into Live, Verified MCP Tools for AI Agents
**Design Specification Document**
**Date:** 2026-10-20
**Status:** Approved by User

---

## 1. Executive Summary

Websites are built for human eyes, forms, and browser interactions. AI coding assistants and autonomous agents (Claude Desktop, Cursor, VS Code, Windsurf, LangChain, CrewAI) struggle with websites because scrapers are brittle, APIs are nonexistent, and form interactions break on minor redesigns.

**Web2MCP** bridges this gap. A user supplies a target website URL or an operational goal (e.g., flight searches, government tender lookups, job boards, e-commerce cataloging). Web2MCP:
1. Explores the website using autonomous web exploration (TinyFish Agent API with a resilient local fallback driver).
2. Uses AI to infer strongly typed JSON schemas (parameters, types, enums, endpoints).
3. Executes live synthetic probes to validate tools against real website responses and records an immutable evidence audit trail in an Evidence Vault.
4. Generates a Model Context Protocol (MCP) server available both as a hosted Streamable HTTP endpoint (`/api/mcp/[id]/mcp`) and a standalone local stdio server.
5. Employs a human-in-the-loop Safety Gate that intercepts consequential actions (bookings, purchases, mutations) and requires explicit confirmation.
6. Delivers a developer-friendly Next.js web application and a standalone npm CLI (`web2mcp`) that automatically installs MCP tool configs into Cursor, Claude Desktop, and VS Code.

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. INGESTION & TARGET PARSING                                               │
│    URL + Operational Goal -> Canonicalization & Robots check                │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. AUTONOMOUS WEB EXPLORATION (TinyFish Agent API / Local Fallback Driver)  │
│    - Crawls forms, inputs, select menus, search parameters, action endpoints│
│    - Extracts DOM structure, clean HTML, network requests, tables & cards   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. AI SCHEMA INFERENCE & TOOL SYNTHESIS                                     │
│    - Infers Tool Candidates (Read/Search, Detail, Action/Mutation)          │
│    - Synthesizes JSON Schemas: input parameters, types, descriptions        │
│    - Evaluates Risk Level: read-only vs. consequential (requires approval)  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 4. LIVE PROBE VALIDATION & EVIDENCE VAULT                                   │
│    - Synthesizes realistic probe inputs and tests against real site         │
│    - Verifies response payload structure against inferred schema            │
│    - Persists Evidence Vault entry (URL, params, response hash, DOM trace)  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 5. MULTI-CHANNEL RUNTIME DELIVERY                                           │
│    - Hosted Streamable HTTP MCP Endpoint: /api/mcp/[id]/mcp                 │
│    - Safety Gate: intercepts mutating/risky calls for human approval        │
│    - Next.js Web App: Dashboard, Live Crawler, Schema Editor, Playground    │
│    - Standalone CLI: `web2mcp add`, `web2mcp test`, `web2mcp install`       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Core Component Breakdown

### 3.1 Web Ingestion & Exploration Service (`/services/crawler`)
- **TinyFish Agent Integration**: Connects to TinyFish Agent API to automate headless browser navigation across SPAs, handling JavaScript rendering, cookies, form fields, and dynamic pagination.
- **Resilient Fallback Driver**: Built-in HTTP and DOM parsing engine (using Cheerio / Node fetch) for offline development, local mock sites, or when TinyFish API keys are omitted.
- **HTML Sanitization & Extraction**: Removes script tags, tracking scripts, and stylesheets; isolates structured forms (`<form>`, `<input>`, `<select>`, `<button>`), table headers, pagination links, and card containers.

### 3.2 AI Schema Inference Service (`/services/ai`)
- **Tool Discovery**: Classifies discovered web interactions into standard tool types:
  - `search_*`: Query forms with search filters (keywords, categories, date ranges, origin/destination).
  - `get_*_details`: Detail views requiring an entity identifier or slug.
  - `submit_*` / `book_*`: Form submissions that produce state changes.
- **Schema Synthesis**: Produces strict JSON Schema (Draft 7 / OpenAPI compatible) objects for tool input parameters:
  - Variable names, types (`string`, `number`, `boolean`, `array`).
  - Descriptions guiding the AI agent on how to supply arguments.
  - Enumerated values (`enum`) detected from dropdowns or radio buttons.
  - Required vs. optional fields.
- **Safety Classifier**: Evaluates whether a tool performs mutations or financial/consequential transactions (e.g. `book_flight`, `submit_bid`, `buy_item`). Adds `requires_approval: true` to the tool definition.

### 3.3 Validation & Evidence Vault (`/services/validation`)
- **Probe Generator**: Creates minimal, realistic input parameters for candidate tools.
- **Live Probe Execution**: Executes tool handlers against the target website.
- **Schema Verification**: Asserts that received data matches the inferred JSON Schema types.
- **Evidence Vault**: Records every probe execution:
  - Timestamp, status (`passed`, `failed`, `warning`).
  - Request payload & HTTP status.
  - Parsed response data sample.
  - Extracted DOM snapshot / response hash for drift detection.

### 3.4 MCP Server Runtime & Safety Gate (`/services/mcp`)
- **JSON-RPC 2.0 / Streamable HTTP**: Implements Model Context Protocol specification:
  - `initialize`: Returns server capabilities and tool lists.
  - `tools/list`: Exposes generated tools with JSON schemas.
  - `tools/call`: Executes the tool handler.
- **Safety Gate Interceptor**:
  - If `tool.requires_approval` is `true`, execution responds with a confirmation prompt requiring explicit agent/user authorization token before proceeding.
- **Local Stdio MCP Runner (`/mcp-server/run.ts`)**: Standalone binary using `@modelcontextprotocol/sdk` to run via stdin/stdout for local tools.

### 3.5 Standalone CLI (`/cli`)
- Published / runnable CLI package:
  - `web2mcp add <url>`: Triggers exploration, inference, and generation.
  - `web2mcp list`: Lists generated tools for a project.
  - `web2mcp test <tool_name>`: Runs an interactive CLI probe.
  - `web2mcp install <claude|cursor|vscode|windsurf>`: Automatically detects and writes configuration files (`claude_desktop_config.json`, `.cursor/mcp.json`, etc.).
  - `web2mcp serve`: Runs a local stdio MCP server for immediate consumption.

### 3.6 Next.js Web Application (`/app`, `/components`)
- **Modern UI**: Built with Next.js 15, Tailwind CSS, Radix UI primitives, Lucide icons.
- **Landing Page**: Explains problem, solution, architecture, live interactive demo widget.
- **Generation Wizard**: Enter URL or goal -> Live exploration terminal stream -> Inferred tools preview -> 1-click deploy.
- **Project Dashboard**:
  - Tools Tab: List of generated tools, parameters, schemas, safety badges.
  - Evidence Vault: Live execution traces, raw DOM hashes, validation logs.
  - Playground: Test any tool directly in the browser with parameter inputs and live JSON response viewer.
  - Connect / Install Guide: 1-click copy snippets for Claude Desktop, Cursor, VS Code.

---

## 4. Data Models (Drizzle ORM)

```typescript
// projects
export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  targetUrl: text('target_url').notNull(),
  goal: text('goal'),
  status: text('status').notNull().default('idle'), // idle, exploring, generating, ready, error
  apiKey: text('api_key').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// tools
export const tools = sqliteTable('tools', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description').notNull(),
  parameters: text('parameters').notNull(), // JSON Schema
  handlerCode: text('handler_code'),       // generated extraction code/rules
  requiresApproval: integer('requires_approval', { mode: 'boolean' }).default(false),
  status: text('status').notNull().default('active'), // active, degraded, broken
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// evidence
export const evidence = sqliteTable('evidence', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  toolId: text('tool_id').references(() => tools.id, { onDelete: 'cascade' }),
  probeInput: text('probe_input').notNull(),   // JSON
  sampleOutput: text('sample_output').notNull(),// JSON
  domHash: text('dom_hash'),
  status: text('status').notNull(), // verified, failed, drift_detected
  errorMessage: text('error_message'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
```

---

## 5. Security & Safety Principles
1. **Safety Gate for Consequential Operations**: Any tool categorized as mutating state (submitting forms, purchasing, registering) requires explicit approval.
2. **Rate Limiting & Politeness**: The crawler respects robots.txt, concurrency caps, and domain timeouts.
3. **Evidence Immutability**: All probe validations are stored with timestamped inputs and outputs for auditing and drift detection.
4. **Isolated Sandboxed Execution**: Dynamic extraction scripts execute in isolated scopes with input sanitization.
