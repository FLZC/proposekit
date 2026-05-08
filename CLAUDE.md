# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Current state
- ProposeKit MVP is scaffolded and functional.
- Key docs:
  - `APP_IDEAS.md`
  - `docs/superpowers/specs/2026-04-23-proposalcraft-design.md`
  - `docs/superpowers/plans/2026-04-23-proposalcraft-mvp.md`
- Product is a Web SaaS for proposal generation workflows.
- Landing, login, dashboard, workspace, export, terms, and privacy pages all exist.
- Feedback widget + Umami analytics are integrated.

## Commands
- `npm install` — install dependencies
- `npm run dev` — start local development server
- `npm run build` — production build
- `npm run lint` — lint the codebase
- `npm run typecheck` — run TypeScript checks
- `npm run test` — run the Vitest suite
- `npx vitest run src/lib/proposals/__tests__/scope-schema.test.ts` — run a single test file

## Product focus
- Planned product: **ProposeKit**
- Target users: 2-10 person web/design/dev agencies in the US market
- Form factor: **Web SaaS**
- Core job: turn messy client briefs into proposal, SOW, and quote outputs

## Product boundaries
ProposeKit is not planned as:
- CRM / pipeline tool
- contract signing product
- project management suite
- freeform document editor
- native mobile-first app

## Architecture rules
### Structured Scope is the single source of truth
All generated artifacts must derive from `Structured Scope`:
- proposal
- SOW
- quote
- three-tier pricing
- partial regeneration results

Do not let proposal/SOW/quote evolve as independent conflicting documents.

## Planned core model
- `Proposal Project`: one proposal engagement with client/project metadata and raw brief
- `Structured Scope`: normalized scope data including deliverables, assumptions, exclusions, timeline, milestones, pricing model
- `Generated Documents`: derived views only, not canonical records

## Golden path
1. Create proposal project
2. Paste brief / notes / email thread
3. Extract `Structured Scope`
4. Review/edit `Structured Scope`
5. Generate proposal / SOW / quote from the same source
6. Apply light edits or partial regeneration
7. Export/share output

## Editing constraints
- Allow only sentence/paragraph-level edits
- No structural editing, section reordering, or freeform layout editing
- Prefer: edit structure first, then regenerate

## Generation constraints
- Use AI for extraction/drafting
- Use rule-based normalization/validation for stability
- Scope risk indicators should be non-blocking warnings
- Partial regeneration should target specific sections only
