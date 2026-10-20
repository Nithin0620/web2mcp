# Web2MCP: Turn Any Website into Live, Verified MCP Tools for AI Agents

> **TinyFish Hackathon Project — Team 6th Floor**  
> **Authors:** KS Nithin, Anuraj Upadhyay, Lalit Chandra

[![Tests](https://img.shields.io/badge/tests-26%20passed-emerald)](https://github.com)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![MCP](https://img.shields.io/badge/MCP-2024--11--05-blue)](https://modelcontextprotocol.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)](https://www.typescriptlang.org)

Web2MCP converts human-oriented websites, booking portals, tender registries, and search directories into live, verified **Model Context Protocol (MCP)** tools for AI agents (Cursor, Claude Desktop, VS Code, Windsurf, LangChain, CrewAI).

---

## ⚡ Problem Statement
- **Websites are built for humans, not agents:** Most booking portals, public registries, and internal enterprise tools only expose human browser UIs.
- **Scrapers are brittle:** A cosmetic redesign, renamed class, or SPA framework upgrade breaks traditional hand-written scrapers.
- **Rebuilding wheels:** Filter parameter mapping, pagination controls, and form submissions are repeatedly hand-coded for every new target website.

---

## 🚀 Proposed Solution
1. **Target Identification:** Point Web2MCP at a website URL or operational goal (e.g. flight searches, job listings, government tenders).
2. **Autonomous Web Exploration:** TinyFish Agent API explores the live DOM, submits search filters, detects forms, renders dynamic SPAs, and maps result collections.
3. **AI Schema Inference:** Machine learning models infer strongly typed JSON Schemas with parameter validation, types, descriptions, and enumerated values.
4. **Live Probe Validation & Evidence Vault:** Synthetic probe queries test real pages before deployment. Every run captures an immutable DOM hash and payload trace to detect redesign drift.
5. **Safety Gate:** Consequential operations (bookings, purchases, submissions) require explicit human authorization before execution.
6. **Multi-Channel Delivery:** Delivered via Next.js Web App, Streamable HTTP MCP endpoints (`/api/mcp/[id]/mcp`), stdio runner, and standalone npm CLI (`web2mcp`).

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. TARGET INGESTION                                                         │
│    URL + Goal (e.g. "search flights and compare fares")                     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. AUTONOMOUS WEB EXPLORATION (TinyFish Agent API / Local Fallback Driver)  │
│    - Explores forms, inputs, select menus, search parameters, action routes │
│    - Extracts DOM structure, clean HTML, network requests, tables & cards   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. AI SCHEMA INFERENCE & TOOL SYNTHESIS                                     │
│    - Synthesizes typed JSON Schemas (parameters, types, enums, required)    │
│    - Safety Classification: read-only vs. consequential (requires approval) │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 4. LIVE PROBE VALIDATION & EVIDENCE VAULT                                   │
│    - Runs live probes against target website                                │
│    - Asserts response payload conforms to inferred schema                   │
│    - Records audit record (DOM hash, response sample, latency) in Vault     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 5. MULTI-CHANNEL RUNTIME DELIVERY                                           │
│    - Hosted Streamable HTTP MCP Endpoint: /api/mcp/[id]/mcp                 │
│    - Human-in-the-Loop Safety Gate: intercepts mutating/risky operations    │
│    - Next.js Web App: Dashboard, Live Crawler, Schema Editor, Playground    │
│    - Standalone CLI: `web2mcp add`, `web2mcp test`, `web2mcp install`       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Quickstart

### 1. Installation & Local Development
```bash
# Clone the repository
cd web2mcp

# Install dependencies
pnpm install

# Run database migrations / init
pnpm test

# Start Next.js Development Server
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 2. Using the Web2MCP CLI

Web2MCP includes a standalone CLI package (`/cli`) for local exploration and zero-friction IDE setup:

```bash
# Explore a website and generate MCP tools
pnpm cli add https://news.ycombinator.com --goal "Search top stories"

# List generated projects and tools
pnpm cli list

# Execute a live probe test against a generated tool
pnpm cli test search_items --params '{"query":"AI"}'

# Auto-configure your IDE
pnpm cli install cursor --project <project_id>
pnpm cli install claude --project <project_id>
pnpm cli install vscode --project <project_id>

# Run a local stdio MCP server directly for agents
pnpm cli serve --project <project_id>
```

---

## 🔌 Connecting to AI Clients

### Cursor (`~/.cursor/mcp.json` or `.cursor/mcp.json`)
```json
{
  "mcpServers": {
    "web2mcp-airline": {
      "url": "http://localhost:3000/api/mcp/<project_id>/mcp",
      "headers": {
        "Authorization": "Bearer <project_api_key>"
      }
    }
  }
}
```

### Claude Desktop (`claude_desktop_config.json`)
```json
{
  "mcpServers": {
    "web2mcp-airline": {
      "url": "http://localhost:3000/api/mcp/<project_id>/mcp",
      "headers": {
        "Authorization": "Bearer <project_api_key>"
      }
    }
  }
}
```

---

## 🛡️ Safety Gate

Consequential actions (such as `book_flight`, `submit_bid`, `purchase_item`) are automatically classified as `riskLevel: consequential` with `requiresApproval: true`. 

When an AI agent calls a consequential tool, Web2MCP intercepts the execution and returns:
```json
{
  "isError": true,
  "requiresApproval": true,
  "approvalToken": "CONFIRM_A4F29B",
  "content": [
    {
      "type": "text",
      "text": "⚠️ Safety Gate Alert: The tool 'book_flight' executes a consequential external action. Confirm by re-running with: 'approvalToken': 'CONFIRM_A4F29B'"
    }
  ]
}
```
Only once explicit confirmation is provided will the state-mutating action be executed.

---

## 🧪 Testing & Verification
Web2MCP includes a comprehensive Vitest test suite covering all layers:
```bash
# Run unit & end-to-end integration tests
pnpm test

# Run build verification
pnpm build
```

---

## 📄 License
MIT © 2026 Team 6th Floor (KS Nithin, Anuraj Upadhyay, Lalit Chandra).
