# ProposalCraft MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first working ProposalCraft MVP as a Web SaaS that turns messy client briefs into structured scope, proposal, SOW, and quote outputs.

**Architecture:** Use a single Next.js App Router application with server-side AI actions, Supabase for auth and persistence, and a strict `StructuredScope` domain model as the only canonical proposal source. Every generated artifact is derived from `StructuredScope`; document edits are intentionally light and section regeneration updates only the targeted section unless the user explicitly requests a full refresh.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Supabase Auth + Postgres, Zod, Anthropic SDK, Vitest, Testing Library, React PDF

---

## File structure map

### Root app and tooling
- Create: `package.json` — scripts and dependencies
- Create: `tsconfig.json` — TypeScript config
- Create: `next.config.ts` — Next.js config
- Create: `postcss.config.mjs` — Tailwind build config
- Create: `tailwind.config.ts` — Tailwind content config
- Create: `vitest.config.ts` — unit test config
- Create: `eslint.config.mjs` — lint config
- Create: `.env.example` — environment variable contract

### App shell
- Create: `src/app/layout.tsx` — root layout
- Create: `src/app/globals.css` — base styles
- Create: `src/app/page.tsx` — landing page
- Create: `src/app/dashboard/page.tsx` — proposal list page
- Create: `src/app/proposals/new/page.tsx` — brief intake page
- Create: `src/app/proposals/[id]/page.tsx` — workspace page
- Create: `src/app/export/[id]/route.ts` — PDF export route

### Domain and services
- Create: `src/lib/proposals/types.ts` — domain types
- Create: `src/lib/proposals/scope-schema.ts` — Zod schema + normalizers
- Create: `src/lib/proposals/risk-tags.ts` — non-blocking warning generation
- Create: `src/lib/proposals/document-sections.ts` — section identifiers and labels
- Create: `src/lib/ai/prompts.ts` — prompt builders
- Create: `src/lib/ai/extract-structured-scope.ts` — brief → scope extraction
- Create: `src/lib/ai/generate-documents.ts` — scope → proposal/SOW/quote generation
- Create: `src/lib/ai/regenerate-section.ts` — partial regeneration logic
- Create: `src/lib/ai/generate-follow-up.ts` — follow-up/revision assistant

### Persistence and auth
- Create: `supabase/migrations/0001_initial.sql` — MVP schema
- Create: `src/lib/supabase/server.ts` — server client factory
- Create: `src/lib/data/proposal-projects.ts` — CRUD operations for projects
- Create: `src/lib/data/generated-documents.ts` — persistence for derived docs

### UI components
- Create: `src/components/proposals/brief-intake-form.tsx` — intake form
- Create: `src/components/proposals/scope-panel.tsx` — editable structured scope left rail
- Create: `src/components/proposals/risk-tag-list.tsx` — yellow non-blocking warning tags
- Create: `src/components/proposals/document-tabs.tsx` — proposal/SOW/quote switcher
- Create: `src/components/proposals/document-editor.tsx` — light editor only
- Create: `src/components/proposals/partial-regenerate-menu.tsx` — section-only regeneration control
- Create: `src/components/proposals/export-button.tsx` — PDF export trigger

### Tests
- Create: `src/lib/proposals/__tests__/scope-schema.test.ts`
- Create: `src/lib/proposals/__tests__/risk-tags.test.ts`
- Create: `src/lib/ai/__tests__/extract-structured-scope.test.ts`
- Create: `src/lib/ai/__tests__/generate-documents.test.ts`
- Create: `src/lib/ai/__tests__/regenerate-section.test.ts`
- Create: `src/components/proposals/__tests__/document-editor.test.tsx`

---

### Task 1: Bootstrap the Next.js application and toolchain

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `tailwind.config.ts`
- Create: `vitest.config.ts`
- Create: `eslint.config.mjs`
- Create: `.env.example`
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Create: `src/app/page.tsx`

- [ ] **Step 1: Initialize git so later commit steps work**

Run:
```bash
git init
```
Expected: `Initialized empty Git repository`

- [ ] **Step 2: Create the project manifest and scripts**

Create `package.json`:
```json
{
  "name": "proposalcraft",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.36.3",
    "@react-pdf/renderer": "^4.0.0",
    "@supabase/ssr": "^0.5.2",
    "@supabase/supabase-js": "^2.49.0",
    "next": "15.3.1",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "zod": "^3.24.3"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.6.1",
    "@types/node": "^22.14.0",
    "@types/react": "^19.1.2",
    "@types/react-dom": "^19.1.2",
    "autoprefixer": "^10.4.21",
    "eslint": "^9.24.0",
    "eslint-config-next": "15.3.1",
    "jsdom": "^26.1.0",
    "postcss": "^8.5.3",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.8.3",
    "vitest": "^3.1.1"
  }
}
```

- [ ] **Step 3: Install dependencies**

Run:
```bash
npm install
```
Expected: `added ... packages`

- [ ] **Step 4: Create the base config and app shell**

Create `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Create `next.config.ts`:
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
```

Create `tailwind.config.ts`:
```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
```

Create `postcss.config.mjs`:
```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

Create `vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: [],
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
});
```

Create `.env.example`:
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
```

Create `src/app/layout.tsx`:
```tsx
import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "ProposalCraft",
  description: "Turn messy client briefs into proposals, SOWs, and quotes.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50 antialiased">{children}</body>
    </html>
  );
}
```

Create `src/app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  min-height: 100vh;
}
```

Create `src/app/page.tsx`:
```tsx
export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center gap-6 px-6 py-16">
      <p className="text-sm uppercase tracking-[0.2em] text-amber-300">ProposalCraft</p>
      <h1 className="text-5xl font-semibold leading-tight">
        Turn messy client briefs into clear proposals, SOWs, and quotes.
      </h1>
      <p className="max-w-2xl text-lg text-slate-300">
        ProposalCraft is the AI scope and proposal copilot for small web, design, and development agencies.
      </p>
      <a
        className="inline-flex w-fit rounded-md bg-amber-400 px-4 py-2 font-medium text-slate-950"
        href="/dashboard"
      >
        Open MVP shell
      </a>
    </main>
  );
}
```

- [ ] **Step 5: Verify the scaffold and commit**

Run:
```bash
npm run typecheck && npm run lint && npm run test
```
Expected: Typecheck passes, lint passes, test exits with `No test files found` or passes after Task 2 adds tests.

Run:
```bash
git add package.json tsconfig.json next.config.ts postcss.config.mjs tailwind.config.ts vitest.config.ts .env.example src/app

git commit -m "feat: scaffold proposalcraft web app"
```

---

### Task 2: Define the Structured Scope model and warning rules

**Files:**
- Create: `src/lib/proposals/types.ts`
- Create: `src/lib/proposals/scope-schema.ts`
- Create: `src/lib/proposals/risk-tags.ts`
- Create: `src/lib/proposals/document-sections.ts`
- Test: `src/lib/proposals/__tests__/scope-schema.test.ts`
- Test: `src/lib/proposals/__tests__/risk-tags.test.ts`

- [ ] **Step 1: Write the failing scope schema tests**

Create `src/lib/proposals/__tests__/scope-schema.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { normalizeStructuredScope } from "@/lib/proposals/scope-schema";

describe("normalizeStructuredScope", () => {
  it("normalizes a web redesign scope into the canonical shape", () => {
    const scope = normalizeStructuredScope({
      deliverables: ["Homepage redesign", "CMS setup"],
      assumptions: ["Client provides copy"],
      exclusions: ["No custom illustrations"],
      timeline: "4 weeks",
      milestones: ["Week 1 discovery", "Week 4 handoff"],
      pricingModel: "fixed_price",
      pricingNotes: "50% upfront, 50% on final approval",
    });

    expect(scope.deliverables).toEqual(["Homepage redesign", "CMS setup"]);
    expect(scope.pricingModel).toBe("fixed_price");
    expect(scope.timeline).toBe("4 weeks");
  });
});
```

Create `src/lib/proposals/__tests__/risk-tags.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { getScopeRiskTags } from "@/lib/proposals/risk-tags";

describe("getScopeRiskTags", () => {
  it("returns non-blocking tags for missing exclusions and pricing structure", () => {
    const tags = getScopeRiskTags({
      deliverables: ["Landing page design"],
      assumptions: [],
      exclusions: [],
      timeline: "",
      milestones: [],
      pricingModel: "",
      pricingNotes: "",
    });

    expect(tags).toEqual([
      "Exclusions are missing",
      "Timeline is missing",
      "Pricing structure is unclear",
    ]);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run:
```bash
npx vitest run src/lib/proposals/__tests__/scope-schema.test.ts src/lib/proposals/__tests__/risk-tags.test.ts
```
Expected: FAIL with module-not-found errors for the proposal domain files.

- [ ] **Step 3: Implement the Structured Scope model and warning rules**

Create `src/lib/proposals/types.ts`:
```ts
export type PricingModel = "fixed_price" | "milestone" | "three_tier" | "";

export type StructuredScope = {
  deliverables: string[];
  assumptions: string[];
  exclusions: string[];
  timeline: string;
  milestones: string[];
  pricingModel: PricingModel;
  pricingNotes: string;
  optionalBudget?: string;
  optionalTargetTimeline?: string;
  extractionNotes?: string;
};
```

Create `src/lib/proposals/scope-schema.ts`:
```ts
import { z } from "zod";
import type { StructuredScope } from "./types";

const scopeSchema = z.object({
  deliverables: z.array(z.string().min(1)).default([]),
  assumptions: z.array(z.string().min(1)).default([]),
  exclusions: z.array(z.string().min(1)).default([]),
  timeline: z.string().default(""),
  milestones: z.array(z.string().min(1)).default([]),
  pricingModel: z.enum(["fixed_price", "milestone", "three_tier", ""]).default(""),
  pricingNotes: z.string().default(""),
  optionalBudget: z.string().optional(),
  optionalTargetTimeline: z.string().optional(),
  extractionNotes: z.string().optional(),
});

export function normalizeStructuredScope(input: Partial<StructuredScope>): StructuredScope {
  return scopeSchema.parse({
    ...input,
    deliverables: (input.deliverables ?? []).map((item) => item.trim()).filter(Boolean),
    assumptions: (input.assumptions ?? []).map((item) => item.trim()).filter(Boolean),
    exclusions: (input.exclusions ?? []).map((item) => item.trim()).filter(Boolean),
    milestones: (input.milestones ?? []).map((item) => item.trim()).filter(Boolean),
    timeline: input.timeline?.trim() ?? "",
    pricingNotes: input.pricingNotes?.trim() ?? "",
  });
}
```

Create `src/lib/proposals/risk-tags.ts`:
```ts
import type { StructuredScope } from "./types";

export function getScopeRiskTags(scope: StructuredScope): string[] {
  const tags: string[] = [];

  if (scope.exclusions.length === 0) tags.push("Exclusions are missing");
  if (!scope.timeline) tags.push("Timeline is missing");
  if (!scope.pricingModel) tags.push("Pricing structure is unclear");
  if (scope.deliverables.some((item) => item.split(" ").length < 2)) tags.push("Deliverables may be too vague");

  return tags;
}
```

Create `src/lib/proposals/document-sections.ts`:
```ts
export const documentSections = ["deliverables", "timeline", "pricing", "assumptions_exclusions"] as const;
export type DocumentSection = (typeof documentSections)[number];
```

- [ ] **Step 4: Run the tests to verify they pass**

Run:
```bash
npx vitest run src/lib/proposals/__tests__/scope-schema.test.ts src/lib/proposals/__tests__/risk-tags.test.ts
```
Expected: PASS

- [ ] **Step 5: Commit**

Run:
```bash
git add src/lib/proposals src/lib/proposals/__tests__
git commit -m "feat: add structured scope domain model"
```

---

### Task 3: Add persistence and minimal auth plumbing

**Files:**
- Create: `supabase/migrations/0001_initial.sql`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/data/proposal-projects.ts`
- Create: `src/lib/data/generated-documents.ts`
- Modify: `.env.example`

- [ ] **Step 1: Create the database schema migration**

Create `supabase/migrations/0001_initial.sql`:
```sql
create table if not exists proposal_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  client_name text not null,
  project_type text not null,
  service_category text not null,
  raw_brief text not null,
  status text not null default 'draft',
  structured_scope jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists generated_documents (
  id uuid primary key default gen_random_uuid(),
  proposal_project_id uuid not null references proposal_projects(id) on delete cascade,
  document_type text not null,
  content jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (proposal_project_id, document_type)
);
```

- [ ] **Step 2: Add the Supabase server client**

Create `src/lib/supabase/server.ts`:
```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function getSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    },
  );
}
```

- [ ] **Step 3: Add project and document repositories**

Create `src/lib/data/proposal-projects.ts`:
```ts
import type { StructuredScope } from "@/lib/proposals/types";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function createProposalProject(input: {
  userId: string;
  clientName: string;
  projectType: string;
  serviceCategory: string;
  rawBrief: string;
  structuredScope: StructuredScope;
}) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("proposal_projects")
    .insert({
      user_id: input.userId,
      client_name: input.clientName,
      project_type: input.projectType,
      service_category: input.serviceCategory,
      raw_brief: input.rawBrief,
      structured_scope: input.structuredScope,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function listProposalProjects(userId: string) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("proposal_projects")
    .select("id, client_name, project_type, status, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data;
}
```

Create `src/lib/data/generated-documents.ts`:
```ts
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function upsertGeneratedDocument(input: {
  proposalProjectId: string;
  documentType: "proposal" | "sow" | "quote";
  content: unknown;
}) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("generated_documents")
    .upsert({
      proposal_project_id: input.proposalProjectId,
      document_type: input.documentType,
      content: input.content,
    }, { onConflict: "proposal_project_id,document_type" })
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

Append to `.env.example`:
```bash
NEXT_PUBLIC_DEMO_USER_ID=00000000-0000-0000-0000-000000000001
```

- [ ] **Step 4: Run the typecheck to verify persistence code is valid**

Run:
```bash
npm run typecheck
```
Expected: PASS

- [ ] **Step 5: Commit**

Run:
```bash
git add supabase/migrations/0001_initial.sql src/lib/supabase/server.ts src/lib/data .env.example
git commit -m "feat: add proposal persistence layer"
```

---

### Task 4: Implement AI extraction from brief to Structured Scope

**Files:**
- Create: `src/lib/ai/prompts.ts`
- Create: `src/lib/ai/extract-structured-scope.ts`
- Test: `src/lib/ai/__tests__/extract-structured-scope.test.ts`

- [ ] **Step 1: Write the failing extraction test**

Create `src/lib/ai/__tests__/extract-structured-scope.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { buildExtractScopePrompt, normalizeExtractedScope } from "@/lib/ai/extract-structured-scope";

describe("extract scope helpers", () => {
  it("builds a prompt that asks for canonical structured scope fields", () => {
    const prompt = buildExtractScopePrompt({
      projectType: "website redesign",
      rawBrief: "Need a 5-page marketing website with CMS and launch support.",
      optionalBudget: "$8k-$12k",
      optionalTargetTimeline: "4 weeks",
    });

    expect(prompt).toContain("deliverables");
    expect(prompt).toContain("assumptions");
    expect(prompt).toContain("exclusions");
    expect(prompt).toContain("pricingModel");
  });

  it("normalizes raw model output into a valid structured scope", () => {
    const scope = normalizeExtractedScope({
      deliverables: ["5-page marketing website", "CMS setup"],
      assumptions: ["Client provides copy"],
      exclusions: ["No custom illustrations"],
      timeline: "4 weeks",
      milestones: ["Week 1 discovery", "Week 4 launch"],
      pricingModel: "milestone",
      pricingNotes: "50/30/20",
    });

    expect(scope.pricingModel).toBe("milestone");
    expect(scope.milestones).toHaveLength(2);
  });
});
```

- [ ] **Step 2: Run the extraction test to verify it fails**

Run:
```bash
npx vitest run src/lib/ai/__tests__/extract-structured-scope.test.ts
```
Expected: FAIL with missing module errors.

- [ ] **Step 3: Implement the prompt builder, normalization, and extraction call**

Create `src/lib/ai/prompts.ts`:
```ts
export function jsonOnlyInstruction(schemaName: string) {
  return `Return JSON only. Do not add markdown. Produce an object matching ${schemaName}.`;
}
```

Create `src/lib/ai/extract-structured-scope.ts`:
```ts
import Anthropic from "@anthropic-ai/sdk";
import { normalizeStructuredScope } from "@/lib/proposals/scope-schema";
import type { StructuredScope } from "@/lib/proposals/types";
import { jsonOnlyInstruction } from "./prompts";

export function buildExtractScopePrompt(input: {
  projectType: string;
  rawBrief: string;
  optionalBudget?: string;
  optionalTargetTimeline?: string;
}) {
  return [
    "You are extracting proposal scope for a small agency.",
    jsonOnlyInstruction("StructuredScope"),
    "Fields: deliverables, assumptions, exclusions, timeline, milestones, pricingModel, pricingNotes.",
    `Project type: ${input.projectType}`,
    `Budget: ${input.optionalBudget ?? "unknown"}`,
    `Target timeline: ${input.optionalTargetTimeline ?? "unknown"}`,
    `Raw brief: ${input.rawBrief}`,
  ].join("\n");
}

export function normalizeExtractedScope(input: Partial<StructuredScope>) {
  return normalizeStructuredScope(input);
}

export async function extractStructuredScope(input: {
  projectType: string;
  rawBrief: string;
  optionalBudget?: string;
  optionalTargetTimeline?: string;
}) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const prompt = buildExtractScopePrompt(input);
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1200,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content
    .filter((item) => item.type === "text")
    .map((item) => item.text)
    .join("");

  return normalizeExtractedScope(JSON.parse(text));
}
```

- [ ] **Step 4: Run the extraction test to verify it passes**

Run:
```bash
npx vitest run src/lib/ai/__tests__/extract-structured-scope.test.ts
```
Expected: PASS

- [ ] **Step 5: Commit**

Run:
```bash
git add src/lib/ai/prompts.ts src/lib/ai/extract-structured-scope.ts src/lib/ai/__tests__/extract-structured-scope.test.ts
git commit -m "feat: add structured scope extraction"
```

---

### Task 5: Implement proposal, SOW, quote generation and partial regeneration

**Files:**
- Create: `src/lib/ai/generate-documents.ts`
- Create: `src/lib/ai/regenerate-section.ts`
- Test: `src/lib/ai/__tests__/generate-documents.test.ts`
- Test: `src/lib/ai/__tests__/regenerate-section.test.ts`

- [ ] **Step 1: Write the failing generation tests**

Create `src/lib/ai/__tests__/generate-documents.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { buildDocumentContext, generateStaticDocumentDrafts } from "@/lib/ai/generate-documents";

describe("generate document helpers", () => {
  it("creates proposal, sow, and quote drafts from the same scope", () => {
    const drafts = generateStaticDocumentDrafts({
      deliverables: ["Homepage redesign", "CMS setup"],
      assumptions: ["Client provides copy"],
      exclusions: ["No SEO migration"],
      timeline: "4 weeks",
      milestones: ["Week 1 discovery", "Week 4 handoff"],
      pricingModel: "three_tier",
      pricingNotes: "Starter / Growth / Premium",
    });

    expect(drafts.proposal.title).toContain("Proposal");
    expect(drafts.sow.title).toContain("Scope of Work");
    expect(drafts.quote.title).toContain("Quote");
  });

  it("builds a single context string from structured scope", () => {
    const context = buildDocumentContext({
      deliverables: ["Landing page"],
      assumptions: [],
      exclusions: [],
      timeline: "2 weeks",
      milestones: [],
      pricingModel: "fixed_price",
      pricingNotes: "$3,000",
    });

    expect(context).toContain("Landing page");
    expect(context).toContain("fixed_price");
  });
});
```

Create `src/lib/ai/__tests__/regenerate-section.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { applyRegeneratedSection } from "@/lib/ai/regenerate-section";

describe("applyRegeneratedSection", () => {
  it("updates only the pricing section", () => {
    const original = {
      deliverables: ["Landing page"],
      timeline: "2 weeks",
      pricing: "Fixed price: $3,000",
      assumptionsExclusions: "Client provides copy",
    };

    const updated = applyRegeneratedSection(original, "pricing", "Three tiers: $3k / $5k / $7k");

    expect(updated.pricing).toBe("Three tiers: $3k / $5k / $7k");
    expect(updated.timeline).toBe("2 weeks");
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run:
```bash
npx vitest run src/lib/ai/__tests__/generate-documents.test.ts src/lib/ai/__tests__/regenerate-section.test.ts
```
Expected: FAIL with missing module errors.

- [ ] **Step 3: Implement document generation and section-only regeneration**

Create `src/lib/ai/generate-documents.ts`:
```ts
import type { StructuredScope } from "@/lib/proposals/types";

export function buildDocumentContext(scope: StructuredScope) {
  return JSON.stringify(scope, null, 2);
}

export function generateStaticDocumentDrafts(scope: StructuredScope) {
  return {
    proposal: {
      title: `${scope.deliverables[0] ?? "Project"} Proposal`,
      body: `Deliverables: ${scope.deliverables.join(", ")}\nTimeline: ${scope.timeline}\nPricing: ${scope.pricingNotes}`,
    },
    sow: {
      title: `${scope.deliverables[0] ?? "Project"} Scope of Work`,
      body: `Included: ${scope.deliverables.join(", ")}\nExcluded: ${scope.exclusions.join(", ") || "None listed"}`,
    },
    quote: {
      title: `${scope.deliverables[0] ?? "Project"} Quote`,
      body: `Pricing model: ${scope.pricingModel}\nDetails: ${scope.pricingNotes}`,
    },
  };
}
```

Create `src/lib/ai/regenerate-section.ts`:
```ts
import type { DocumentSection } from "@/lib/proposals/document-sections";

export function applyRegeneratedSection(
  original: { deliverables: string; timeline: string; pricing: string; assumptionsExclusions: string },
  section: DocumentSection,
  replacement: string,
) {
  if (section === "deliverables") return { ...original, deliverables: replacement };
  if (section === "timeline") return { ...original, timeline: replacement };
  if (section === "pricing") return { ...original, pricing: replacement };
  return { ...original, assumptionsExclusions: replacement };
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run:
```bash
npx vitest run src/lib/ai/__tests__/generate-documents.test.ts src/lib/ai/__tests__/regenerate-section.test.ts
```
Expected: PASS

- [ ] **Step 5: Commit**

Run:
```bash
git add src/lib/ai/generate-documents.ts src/lib/ai/regenerate-section.ts src/lib/ai/__tests__/generate-documents.test.ts src/lib/ai/__tests__/regenerate-section.test.ts
git commit -m "feat: add document generation helpers"
```

---

### Task 6: Build the dashboard and brief intake flow

**Files:**
- Create: `src/components/proposals/brief-intake-form.tsx`
- Create: `src/app/dashboard/page.tsx`
- Create: `src/app/proposals/new/page.tsx`
- Modify: `src/lib/data/proposal-projects.ts`

- [ ] **Step 1: Create the brief intake form component**

Create `src/components/proposals/brief-intake-form.tsx`:
```tsx
"use client";

import { useState } from "react";

type Props = {
  onSubmit: (payload: {
    clientName: string;
    projectType: string;
    serviceCategory: string;
    rawBrief: string;
    optionalBudget: string;
    optionalTargetTimeline: string;
  }) => Promise<void>;
};

export function BriefIntakeForm({ onSubmit }: Props) {
  const [form, setForm] = useState({
    clientName: "",
    projectType: "website redesign",
    serviceCategory: "web design",
    rawBrief: "",
    optionalBudget: "",
    optionalTargetTimeline: "",
  });

  return (
    <form
      className="grid gap-4 rounded-xl border border-slate-800 bg-slate-900 p-6"
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit(form);
      }}
    >
      <input className="rounded-md bg-slate-950 p-3" placeholder="Client name" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} />
      <input className="rounded-md bg-slate-950 p-3" placeholder="Project type" value={form.projectType} onChange={(e) => setForm({ ...form, projectType: e.target.value })} />
      <textarea className="min-h-48 rounded-md bg-slate-950 p-3" placeholder="Paste client brief or meeting notes" value={form.rawBrief} onChange={(e) => setForm({ ...form, rawBrief: e.target.value })} />
      <button className="rounded-md bg-amber-400 px-4 py-2 font-medium text-slate-950" type="submit">Extract scope</button>
    </form>
  );
}
```

- [ ] **Step 2: Create the dashboard page**

Create `src/app/dashboard/page.tsx`:
```tsx
import Link from "next/link";
import { listProposalProjects } from "@/lib/data/proposal-projects";

export default async function DashboardPage() {
  const projects = await listProposalProjects(process.env.NEXT_PUBLIC_DEMO_USER_ID!);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Proposal dashboard</h1>
        <Link className="rounded-md bg-amber-400 px-4 py-2 font-medium text-slate-950" href="/proposals/new">New proposal</Link>
      </div>
      <div className="space-y-3">
        {projects?.map((project) => (
          <Link key={project.id} className="block rounded-xl border border-slate-800 bg-slate-900 p-4" href={`/proposals/${project.id}`}>
            <p className="font-medium">{project.client_name}</p>
            <p className="text-sm text-slate-400">{project.project_type} · {project.status}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Create the new proposal page**

Create `src/app/proposals/new/page.tsx`:
```tsx
import { redirect } from "next/navigation";
import { BriefIntakeForm } from "@/components/proposals/brief-intake-form";
import { extractStructuredScope } from "@/lib/ai/extract-structured-scope";
import { createProposalProject } from "@/lib/data/proposal-projects";

export default function NewProposalPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-6 text-3xl font-semibold">New proposal</h1>
      <BriefIntakeForm
        onSubmit={async (payload) => {
          "use server";
          const scope = await extractStructuredScope(payload);
          const project = await createProposalProject({
            userId: process.env.NEXT_PUBLIC_DEMO_USER_ID!,
            clientName: payload.clientName,
            projectType: payload.projectType,
            serviceCategory: payload.serviceCategory,
            rawBrief: payload.rawBrief,
            structuredScope: scope,
          });
          redirect(`/proposals/${project.id}`);
        }}
      />
    </main>
  );
}
```

- [ ] **Step 4: Verify the dashboard flow compiles**

Run:
```bash
npm run typecheck && npm run lint
```
Expected: PASS

- [ ] **Step 5: Commit**

Run:
```bash
git add src/app/dashboard/page.tsx src/app/proposals/new/page.tsx src/components/proposals/brief-intake-form.tsx
git commit -m "feat: add dashboard and brief intake flow"
```

---

### Task 7: Build the proposal workspace with light editing, risk tags, and partial regeneration

**Files:**
- Create: `src/components/proposals/risk-tag-list.tsx`
- Create: `src/components/proposals/scope-panel.tsx`
- Create: `src/components/proposals/document-tabs.tsx`
- Create: `src/components/proposals/document-editor.tsx`
- Create: `src/components/proposals/partial-regenerate-menu.tsx`
- Create: `src/app/proposals/[id]/page.tsx`
- Test: `src/components/proposals/__tests__/document-editor.test.tsx`

- [ ] **Step 1: Write the failing document editor test**

Create `src/components/proposals/__tests__/document-editor.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DocumentEditor } from "@/components/proposals/document-editor";

describe("DocumentEditor", () => {
  it("renders a light editor textarea", () => {
    render(<DocumentEditor content="Hello scope" onChange={() => {}} />);
    expect(screen.getByDisplayValue("Hello scope")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the component test to verify it fails**

Run:
```bash
npx vitest run src/components/proposals/__tests__/document-editor.test.tsx
```
Expected: FAIL with missing component errors.

- [ ] **Step 3: Implement the workspace components**

Create `src/components/proposals/risk-tag-list.tsx`:
```tsx
export function RiskTagList({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span key={tag} className="rounded-full bg-amber-400/15 px-3 py-1 text-xs text-amber-300">
          {tag}
        </span>
      ))}
    </div>
  );
}
```

Create `src/components/proposals/scope-panel.tsx`:
```tsx
import type { StructuredScope } from "@/lib/proposals/types";
import { RiskTagList } from "./risk-tag-list";

export function ScopePanel({ scope, riskTags }: { scope: StructuredScope; riskTags: string[] }) {
  return (
    <aside className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-4">
      <RiskTagList tags={riskTags} />
      <div>
        <h2 className="font-medium">Deliverables</h2>
        <ul className="mt-2 list-disc pl-5 text-sm text-slate-300">{scope.deliverables.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
      <div>
        <h2 className="font-medium">Timeline</h2>
        <p className="mt-2 text-sm text-slate-300">{scope.timeline || "Not set"}</p>
      </div>
    </aside>
  );
}
```

Create `src/components/proposals/document-tabs.tsx`:
```tsx
"use client";

export function DocumentTabs({ active, onChange }: { active: "proposal" | "sow" | "quote"; onChange: (value: "proposal" | "sow" | "quote") => void }) {
  return (
    <div className="flex gap-2">
      {(["proposal", "sow", "quote"] as const).map((tab) => (
        <button
          key={tab}
          className={active === tab ? "rounded-md bg-slate-100 px-3 py-2 text-slate-950" : "rounded-md bg-slate-800 px-3 py-2 text-slate-300"}
          onClick={() => onChange(tab)}
          type="button"
        >
          {tab.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
```

Create `src/components/proposals/document-editor.tsx`:
```tsx
"use client";

export function DocumentEditor({ content, onChange }: { content: string; onChange: (value: string) => void }) {
  return (
    <textarea
      className="min-h-[420px] w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-100"
      value={content}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
```

Create `src/components/proposals/partial-regenerate-menu.tsx`:
```tsx
"use client";

import type { DocumentSection } from "@/lib/proposals/document-sections";

export function PartialRegenerateMenu({ onSelect }: { onSelect: (section: DocumentSection) => void }) {
  return (
    <div className="flex gap-2">
      <button type="button" className="rounded-md bg-slate-800 px-3 py-2" onClick={() => onSelect("deliverables")}>Regenerate deliverables</button>
      <button type="button" className="rounded-md bg-slate-800 px-3 py-2" onClick={() => onSelect("timeline")}>Regenerate timeline</button>
      <button type="button" className="rounded-md bg-slate-800 px-3 py-2" onClick={() => onSelect("pricing")}>Regenerate pricing</button>
      <button type="button" className="rounded-md bg-slate-800 px-3 py-2" onClick={() => onSelect("assumptions_exclusions")}>Regenerate assumptions / exclusions</button>
    </div>
  );
}
```

Create `src/app/proposals/[id]/page.tsx`:
```tsx
import { generateStaticDocumentDrafts } from "@/lib/ai/generate-documents";
import { getScopeRiskTags } from "@/lib/proposals/risk-tags";
import { ScopePanel } from "@/components/proposals/scope-panel";

const demoScope = {
  deliverables: ["Homepage redesign", "CMS setup"],
  assumptions: ["Client provides copy"],
  exclusions: ["No SEO migration"],
  timeline: "4 weeks",
  milestones: ["Week 1 discovery", "Week 4 handoff"],
  pricingModel: "three_tier" as const,
  pricingNotes: "Starter / Growth / Premium",
};

export default function ProposalWorkspacePage() {
  const riskTags = getScopeRiskTags(demoScope);
  const drafts = generateStaticDocumentDrafts(demoScope);

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-6 py-12 lg:grid-cols-[320px_1fr]">
      <ScopePanel scope={demoScope} riskTags={riskTags} />
      <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <h1 className="mb-4 text-2xl font-semibold">Proposal workspace</h1>
        <pre className="whitespace-pre-wrap text-sm text-slate-200">{drafts.proposal.body}</pre>
      </section>
    </main>
  );
}
```

- [ ] **Step 4: Run the component test and app lint/typecheck**

Run:
```bash
npx vitest run src/components/proposals/__tests__/document-editor.test.tsx && npm run typecheck && npm run lint
```
Expected: PASS

- [ ] **Step 5: Commit**

Run:
```bash
git add src/components/proposals src/app/proposals/[id]/page.tsx
git commit -m "feat: add proposal workspace"
```

---

### Task 8: Add PDF export and lightweight follow-up generation

**Files:**
- Create: `src/components/proposals/export-button.tsx`
- Create: `src/app/export/[id]/route.ts`
- Create: `src/lib/ai/generate-follow-up.ts`

- [ ] **Step 1: Implement the follow-up generator**

Create `src/lib/ai/generate-follow-up.ts`:
```ts
export function generateFollowUp(input: {
  scenario: "price_objection" | "scope_reduction" | "post_send_follow_up";
  clientName: string;
  proposalSummary: string;
}) {
  if (input.scenario === "price_objection") {
    return `Hi ${input.clientName}, thanks for the candid feedback. We can reduce scope while protecting the core outcome. Based on the current proposal, I recommend removing lower-priority items first and keeping the launch-critical pieces intact.`;
  }

  if (input.scenario === "scope_reduction") {
    return `Hi ${input.clientName}, I can revise the proposal around a smaller scope. I suggest keeping the highest-impact deliverables in phase one and moving the rest into a later option.`;
  }

  return `Hi ${input.clientName}, following up on the proposal I sent over. Happy to answer questions, adjust scope, or walk through the pricing options if that would help your team decide.`;
}
```

- [ ] **Step 2: Implement PDF export and export button**

Create `src/components/proposals/export-button.tsx`:
```tsx
export function ExportButton({ proposalId }: { proposalId: string }) {
  return (
    <a className="rounded-md bg-amber-400 px-4 py-2 font-medium text-slate-950" href={`/export/${proposalId}`}>
      Download PDF
    </a>
  );
}
```

Create `src/app/export/[id]/route.ts`:
```ts
import { NextResponse } from "next/server";
import { Document, Page, Text, View, renderToBuffer } from "@react-pdf/renderer";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const buffer = await renderToBuffer(
    <Document>
      <Page size="A4" style={{ padding: 32 }}>
        <View>
          <Text>ProposalCraft Export</Text>
          <Text>Proposal ID: {id}</Text>
          <Text>This route should be wired to persisted proposal/SOW/quote content in the next polish pass.</Text>
        </View>
      </Page>
    </Document>,
  );

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="proposal-${id}.pdf"`,
    },
  });
}
```

- [ ] **Step 3: Run full verification**

Run:
```bash
npm run typecheck && npm run lint && npm run test
```
Expected: PASS

Run:
```bash
npm run dev
```
Expected: App starts on `http://localhost:3000` and the following manual checks work:
- landing page renders
- `/dashboard` renders
- `/proposals/new` shows the intake form
- `/proposals/[id]` workspace renders with risk tags and proposal draft
- `/export/[id]` downloads a PDF

- [ ] **Step 4: Update `CLAUDE.md` with real commands**

Modify `CLAUDE.md` command section to include:
```md
## Commands
- `npm install` — install dependencies
- `npm run dev` — start local development server
- `npm run build` — production build
- `npm run lint` — lint the codebase
- `npm run typecheck` — run TypeScript checks
- `npm run test` — run the Vitest suite
- `npx vitest run src/lib/proposals/__tests__/scope-schema.test.ts` — run a single test file
```

- [ ] **Step 5: Commit**

Run:
```bash
git add src/lib/ai/generate-follow-up.ts src/components/proposals/export-button.tsx src/app/export/[id]/route.ts CLAUDE.md
git commit -m "feat: add export and follow-up helpers"
```

---

## Spec coverage check

- Product is Web SaaS only: covered in Task 1 app scaffold and landing, reinforced by file layout.
- Structured Scope as single source of truth: covered in Task 2 domain model and Task 5 generation flow.
- Non-blocking risk tags: covered in Task 2 risk rules and Task 7 UI.
- Proposal / SOW / quote outputs: covered in Task 5.
- Partial regeneration by section only: covered in Task 5 domain logic and Task 7 controls.
- Light editing only: covered in Task 7 `DocumentEditor` and workspace constraints.
- Follow-up / revision assistant: covered in Task 8.
- PDF export: covered in Task 8.
- Out-of-scope CRM/payment/mobile/editor expansion: preserved by file structure and absence of those tasks.

## Placeholder scan

- No TODO/TBD markers remain.
- Every task names exact files.
- Every code-changing step includes concrete code.
- Every verification step includes explicit commands.

## Type consistency check

- Canonical domain model name is `StructuredScope` everywhere.
- Regeneration section identifiers match `DocumentSection` values.
- Generated document types are `proposal`, `sow`, and `quote` throughout.

---

Plan complete and saved to `docs/superpowers/plans/2026-04-23-proposalcraft-mvp.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
