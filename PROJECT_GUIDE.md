# Web2MCP: Comprehensive Project & Developer Guide

## Table of Contents
1. [Architecture & Philosophy](#1-architecture--philosophy)
2. [Directory & Module Breakdown](#2-directory--module-breakdown)
3. [Crawler & TinyFish Integration](#3-crawler--tinyfish-integration)
4. [AI Schema Inference & Safety Gate](#4-ai-schema-inference--safety-gate)
5. [Evidence Vault & Drift Detection](#5-evidence-vault--drift-detection)
6. [Model Context Protocol (MCP) Runtime](#6-model-context-protocol-mcp-runtime)
7. [CLI Architecture & Tooling](#7-cli-architecture--tooling)
8. [Database & Persistence](#8-database--persistence)
9. [Deployment Guide](#9-deployment-guide)

---

## 1. Architecture & Philosophy

Web2MCP is designed around three architectural pillars:
- **Strict Decoupling:** Business logic (web exploration, schema inference, probe validation, and MCP protocol dispatch) is isolated in pure TypeScript services under `/services` and completely independent from UI components and framework runtime.
- **Resilient Fallback Design:** While TinyFish Agent API delivers autonomous browser navigation for SPAs and complex form interactions, a built-in headless driver ensures complete functionality in offline or local test environments without requiring external API keys.
- **Evidence-Backed Reliability:** Rather than hoping generated tools work, every tool undergoes live probe execution against target pages. The payload and DOM hashes are permanently recorded in the Evidence Vault.

---

## 2. Directory & Module Breakdown

```
web2mcp/
├── app/                        # Next.js 15 App Router
│   ├── api/
│   │   ├── generate/route.ts   # Ingestion, exploration & tool generation trigger
│   │   └── mcp/[id]/mcp/route.ts# Streamable HTTP MCP JSON-RPC 2.0 endpoint
│   ├── projects/
│   │   ├── [id]/page.tsx       # Project Details, Tools, Health & Playground
│   │   └── new/page.tsx        # New Website Extraction Wizard
│   ├── layout.tsx              # Theme, global header and footer
│   └── page.tsx                # Landing page & live registry
├── cli/                        # Standalone CLI package
│   ├── src/
│   │   ├── commands/           # `add`, `test`, `install`, `list`, `serve`
│   │   ├── installers/         # Config generators for Cursor, Claude, VS Code
│   │   └── index.ts            # CLI command dispatcher
│   └── package.json
├── components/                 # React UI Component Library
│   ├── crawler/                # Live crawler streaming terminal
│   ├── dashboard/              # ToolList, EvidenceVault, Playground, ConnectModal
│   └── ui/                     # Button, Badge, Card, Input primitives
├── lib/                        # Infrastructure
│   ├── db/
│   │   ├── client.ts           # LibSQL / SQLite client & auto-migrations
│   │   └── schema.ts           # Drizzle ORM schema definitions
│   └── utils.ts
├── services/                   # Decoupled Core Business Logic
│   ├── ai/                     # Schema inference, prompt templates & safety classifier
│   ├── crawler/                # TinyFish client, fallback driver, HTML sanitization
│   ├── mcp/                    # MCP JSON-RPC runtime dispatcher & safety gate
│   └── validation/             # Synthetic probe generator & Evidence Vault
└── tests/                      # Vitest test suite (unit + e2e integration)
```

---

## 3. Crawler & TinyFish Integration

The exploration pipeline is initiated via `exploreWebsite(url, goal, options)`:
1. **TinyFish Client (`services/crawler/tinyfish.ts`):**
   - Connects to `https://agent.tinyfish.io/v1/explore` with `TINYFISH_API_KEY`.
   - Submits instructions to render client SPAs, interact with multi-step forms, and collect network payloads.
2. **Fallback Driver (`services/crawler/fallback-driver.ts`):**
   - Headless HTTP fetcher with user agent spoofing and timeout handling.
   - Parses DOM with Cheerio to extract `<form>`, `<input>`, `<select>`, `<button>`, and card containers.
3. **HTML Cleaner (`services/crawler/html-cleaner.ts`):**
   - Strips non-semantic elements (`<script>`, `<style>`, `<svg>`, comments) while preserving semantic structural markers and converting text into clean Markdown for LLMs.

---

## 4. AI Schema Inference & Safety Gate

Tools are inferred via `inferToolsFromExploration(exploration, projectId, goal)`:
- **Form Categorization:**
  - Search forms (`method: GET` or query parameters) generate query tools (`search_<entity>s`).
  - Action forms (`method: POST`, bookings, bids) generate action tools (`book_<entity>`, `submit_<entity>_form`).
- **JSON Schema Synthesis:**
  - Form inputs are converted into typed properties (`string`, `number`, `boolean`).
  - Dropdown `<select>` menus are mapped into `enum` constraints.
  - Required fields are automatically cataloged in `required: [...]`.
- **Safety Classifier (`services/ai/safety-classifier.ts`):**
  - Identifies state-mutating verbs (`book`, `purchase`, `submit`, `bid`, `pay`, `cancel`, `delete`).
  - Sets `requiresApproval: true` and `riskLevel: 'consequential'`.
  - At runtime, the MCP dispatcher intercepts requests without an approval token and prompts the human/agent with a confirmation challenge.

---

## 5. Evidence Vault & Drift Detection

Every generated tool undergoes automated verification:
1. **Probe Synthesis (`services/validation/probe-runner.ts`):** Realistic synthetic inputs are generated matching the tool's JSON Schema.
2. **Live Execution:** The tool queries the target website and validates returned status and structure.
3. **Evidence Recording (`services/validation/evidence-vault.ts`):**
   - A SHA-256 hash of the extracted DOM / response is generated.
   - The probe input, output payload, latency, and status are stored in the SQLite `evidence` table.
4. **Health Scoring & Drift:**
   - The dashboard calculates a Health Score (`% verified`).
   - If a website undergoes a redesign or changes parameter names, live probes detect schema drift and alert the developer to regenerate the tool.

---

## 6. Model Context Protocol (MCP) Runtime

Web2MCP provides two standard MCP transports:
- **Streamable HTTP Endpoint (`/api/mcp/[id]/mcp`):**
  - Compatible with modern web-native agents and MCP remote hosts.
  - Handles JSON-RPC 2.0 messages: `initialize`, `tools/list`, and `tools/call`.
  - Supports Bearer token authorization using the project's unique `apiKey`.
- **Local Stdio MCP Server (`mcp-server/run.ts`):**
  - Line-delimited JSON-RPC stdin/stdout transport.
  - Usable locally via `npx tsx mcp-server/run.ts --project <id>`.

---

## 7. CLI Architecture & Tooling

The CLI provides full control from the terminal:
- `web2mcp add <url> [--goal <text>]`: Explores target, infers tools, verifies probes, and creates project.
- `web2mcp list [--project <id>]`: Displays registered projects and tool signatures.
- `web2mcp test <tool_name> [--params <json>]`: Executes interactive test calls with formatted payload output.
- `web2mcp install <cursor|claude|vscode> --project <id>`: Directly writes configuration blocks to local IDE config files.
- `web2mcp serve --project <id>`: Launches the stdio MCP server for agent integration.

---

## 8. Database & Persistence

Web2MCP uses **Drizzle ORM** with **LibSQL / SQLite**:
- Database file: `file:./web2mcp.db` (zero external setup required).
- Configurable via `DATABASE_URL` environment variable.
- Uses Write-Ahead Logging (`PRAGMA journal_mode = WAL`) and busy timeouts for high concurrent throughput.
- Tables: `projects`, `tools`, `evidence` (with cascading foreign key relationships).

---

## 9. Deployment Guide

### Vercel / Cloud Run / VPS
```bash
# Set production environment variables
export DATABASE_URL="file:./web2mcp.db" # or Turso/LibSQL remote url: libsql://...
export TINYFISH_API_KEY="your-tinyfish-key" # optional
export OPENROUTER_API_KEY="your-llm-key"     # optional

# Build and start
pnpm build
pnpm start
```

Web2MCP is fully production ready.
