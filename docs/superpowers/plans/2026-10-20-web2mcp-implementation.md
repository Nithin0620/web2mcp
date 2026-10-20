# Web2MCP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Web2MCP end-to-end: a Next.js web application, autonomous web exploration layer (TinyFish + fallback driver), AI schema inference engine, live probe validator with Evidence Vault, hosted and local Model Context Protocol (MCP) server, and standalone CLI tool.

**Architecture:** A modular TypeScript monolith with decoupled service layers (`/services/crawler`, `/services/ai`, `/services/validation`, `/services/mcp`), a standalone CLI package (`/cli`), a Next.js 15 web application (`/app`, `/components`), and SQLite/Drizzle persistence (`/lib/db`).

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, Lucide Icons, Radix UI, `@modelcontextprotocol/sdk`, Drizzle ORM, better-sqlite3, Cheerio, Vitest / Node test runner.

**Spec:** [docs/superpowers/specs/2026-10-20-web2mcp-design.md](file:///home/nithin/Projects/web2mcp/docs/superpowers/specs/2026-10-20-web2mcp-design.md)

## Global Constraints
- Node.js >= 20.0.0
- Strict TypeScript configuration (`strict: true`)
- Standard MCP protocol adherence (JSON-RPC 2.0 / Streamable HTTP & stdio)
- No broken imports or missing types; all modules testable in isolation

---

## Phase 1: Project Foundation & Database Layer

### Task 1: Package Scaffolding & TypeScript Configuration
**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.mjs`
- Create: `tailwind.config.ts`
- Create: `postcss.config.mjs`

- [ ] **Step 1: Create package.json with dependencies**
- [ ] **Step 2: Create tsconfig.json and build configs**
- [ ] **Step 3: Install dependencies**
- [ ] **Step 4: Verify build/typecheck tooling**

### Task 2: Core Domain Types & Database Schema
**Files:**
- Create: `types/platform.ts`
- Create: `lib/db/schema.ts`
- Create: `lib/db/client.ts`
- Create: `tests/db.test.ts`

- [ ] **Step 1: Define TypeScript interfaces for Projects, Tools, Evidence, and MCP Schemas**
- [ ] **Step 2: Implement Drizzle SQLite schema for projects, tools, and evidence**
- [ ] **Step 3: Implement database client with automatic migration/initialization**
- [ ] **Step 4: Write unit test to verify database operations (insert, query, cascade delete)**
- [ ] **Step 5: Run tests and ensure 100% pass**

---

## Phase 2: Web Exploration Service (TinyFish & Fallback Crawler)

### Task 3: HTML Sanitizer & DOM Form/List Extractor
**Files:**
- Create: `services/crawler/html-cleaner.ts`
- Create: `services/crawler/form-extractor.ts`
- Create: `tests/crawler-extractor.test.ts`

- [ ] **Step 1: Write unit test for form and list extraction from mock HTML**
- [ ] **Step 2: Implement HTML cleaner to strip scripts/styles while preserving semantic elements**
- [ ] **Step 3: Implement form & list extractor that detects inputs, selects, buttons, and result containers**
- [ ] **Step 4: Verify tests pass**

### Task 4: TinyFish Agent API Client & Resilient Fallback Driver
**Files:**
- Create: `services/crawler/tinyfish.ts`
- Create: `services/crawler/fallback-driver.ts`
- Create: `services/crawler/explorer.ts`
- Create: `tests/crawler-explorer.test.ts`

- [ ] **Step 1: Implement TinyFish Agent API client with session management**
- [ ] **Step 2: Implement fallback HTTP/Cheerio explorer for local testing**
- [ ] **Step 3: Implement unified `exploreWebsite(url, goal)` interface**
- [ ] **Step 4: Test exploration pipeline with mock targets**

---

## Phase 3: AI Schema Inference & Safety Classification

### Task 5: Schema Inference & Tool Candidate Generation
**Files:**
- Create: `services/ai/analyzer.ts`
- Create: `services/ai/schema-inference.ts`
- Create: `services/ai/safety-classifier.ts`
- Create: `tests/ai-inference.test.ts`

- [ ] **Step 1: Write unit tests for schema inference and safety classification**
- [ ] **Step 2: Implement LLM analyzer using OpenRouter / OpenAI compatible interface with deterministic mock fallback**
- [ ] **Step 3: Implement schema generator to transform extracted web structures into JSON Schema**
- [ ] **Step 4: Implement safety classifier detecting mutating vs read-only operations**
- [ ] **Step 5: Verify tests pass**

---

## Phase 4: Live Probe Validation & Evidence Vault

### Task 6: Probe Runner & Evidence Vault
**Files:**
- Create: `services/validation/probe-runner.ts`
- Create: `services/validation/evidence-vault.ts`
- Create: `tests/validation.test.ts`

- [ ] **Step 1: Write unit tests for probe execution and schema validation**
- [ ] **Step 2: Implement probe runner that executes tool calls against live/mock site**
- [ ] **Step 3: Implement Evidence Vault to record immutable audit snapshots and DOM hashes**
- [ ] **Step 4: Run tests and verify evidence logging**

---

## Phase 5: Multi-Tenant MCP Server Runtime & Stdio Server

### Task 7: MCP Runtime & Streamable HTTP Server Endpoint
**Files:**
- Create: `services/mcp/runtime.ts`
- Create: `services/mcp/safety-gate.ts`
- Create: `app/api/mcp/[id]/mcp/route.ts`
- Create: `mcp-server/run.ts`
- Create: `tests/mcp-runtime.test.ts`

- [ ] **Step 1: Write unit test for MCP protocol compliance (`tools/list`, `tools/call`, safety gating)**
- [ ] **Step 2: Implement MCP runtime dispatcher using `@modelcontextprotocol/sdk`**
- [ ] **Step 3: Implement safety gate requiring authorization for consequential tools**
- [ ] **Step 4: Implement Next.js route handler for streamable HTTP MCP transport**
- [ ] **Step 5: Implement standalone stdio runner for local agent execution**
- [ ] **Step 6: Verify protocol compliance with test suite**

---

## Phase 6: Standalone CLI Tool & IDE Installers

### Task 8: CLI Package (`web2mcp`) & Auto-Installers
**Files:**
- Create: `cli/package.json`
- Create: `cli/src/index.ts`
- Create: `cli/src/commands/add.ts`
- Create: `cli/src/commands/test.ts`
- Create: `cli/src/commands/install.ts`
- Create: `cli/src/commands/serve.ts`
- Create: `cli/src/installers/cursor.ts`
- Create: `cli/src/installers/claude.ts`
- Create: `cli/src/installers/vscode.ts`
- Create: `tests/cli-installers.test.ts`

- [ ] **Step 1: Write tests for IDE config writers (Cursor, Claude Desktop, VS Code)**
- [ ] **Step 2: Implement IDE config installer modules**
- [ ] **Step 3: Implement CLI commands (`add`, `test`, `install`, `serve`)**
- [ ] **Step 4: Test CLI binary build and execution**

---

## Phase 7: Web Dashboard & Interactive Playground

### Task 9: Generation Wizard & Live Crawler Terminal UI
**Files:**
- Create: `app/globals.css`
- Create: `components/ui/*`
- Create: `components/crawler/live-terminal.tsx`
- Create: `app/projects/new/page.tsx`
- Create: `app/api/generate/route.ts`

- [ ] **Step 1: Set up Tailwind theme, styling, and UI primitives**
- [ ] **Step 2: Implement live crawler streaming terminal component**
- [ ] **Step 3: Implement New Project generator wizard with progress feedback**

### Task 10: Project Detail, Evidence Vault & Testing Playground
**Files:**
- Create: `app/projects/[id]/page.tsx`
- Create: `components/dashboard/tool-list.tsx`
- Create: `components/dashboard/evidence-vault.tsx`
- Create: `components/dashboard/playground.tsx`
- Create: `components/dashboard/connect-modal.tsx`
- Create: `app/page.tsx` (Landing page)

- [ ] **Step 1: Implement Project Details dashboard with tabs (Tools, Evidence, Playground, Connect)**
- [ ] **Step 2: Implement interactive tool testing playground (parameter inputs + live JSON responses)**
- [ ] **Step 3: Implement Evidence Vault UI showing audit records, DOM hashes, and verification status**
- [ ] **Step 4: Implement landing page showcasing Web2MCP architecture, live demo, and value proposition**

---

## Phase 8: End-to-End Verification & Documentation

### Task 11: End-to-End Integration Test & Project Guide
**Files:**
- Create: `tests/e2e.test.ts`
- Create: `README.md`
- Create: `PROJECT_GUIDE.md`

- [ ] **Step 1: Execute full end-to-end integration test (URL -> Explore -> Infer -> Validate -> MCP Call)**
- [ ] **Step 2: Verify CLI config installation in sandbox**
- [ ] **Step 3: Write comprehensive `README.md` and `PROJECT_GUIDE.md`**
- [ ] **Step 4: Build check (`next build` & CLI bundle build)**
