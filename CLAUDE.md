# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Current state
- This repo is in planning/spec stage, not implementation stage.
- Current docs:
  - `APP_IDEAS.md`
  - `docs/superpowers/specs/2026-04-23-proposalcraft-design.md`
- There is no app source tree or confirmed build/lint/test/dev command yet.
- Do not invent commands; add them only after the real toolchain exists.

## Product focus
- Planned product: **ProposalCraft**
- Target users: 2-10 person web/design/dev agencies in the US market
- Form factor: **Web SaaS**
- Core job: turn messy client briefs into proposal, SOW, and quote outputs

## Product boundaries
ProposalCraft is not planned as:
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

## Update this file when implementation starts
Add real commands and architecture details once the repo has:
- app scaffold
- chosen framework/toolchain
- runnable dev/build/test/lint commands
- stable source tree
