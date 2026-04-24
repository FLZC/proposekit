# ProposalCraft Design Spec

- Date: 2026-04-23
- Status: Approved for planning
- Product: ProposalCraft
- Audience: 2-10 person web/design/dev agencies in the US market
- Form factor: Web SaaS

## 1. Product summary

ProposalCraft is an AI scope, proposal, and quote copilot for small web/design/dev agencies. It helps users turn messy client briefs, meeting notes, and email threads into sendable proposal documents, scope of work documents, and pricing quotes.

The product is not a generic AI writing tool, not a CRM, and not a document editor. Its value comes from structuring proposal inputs before generation so the final output is faster to produce, more consistent, and less likely to create scope confusion later.

## 2. Target user

The first release serves small agencies with the following traits:

- 2-10 team members
- selling web, design, and development services
- repeatedly producing proposals for new projects or retainers
- currently using Google Docs, Notion, Word, ChatGPT, and old templates to assemble proposals manually

The first release does not target broad freelancer workflows, enterprise sales teams, or verticals outside web/design/dev services.

## 3. Core problem

These agencies consistently face the same workflow problems:

- client briefs arrive in messy, incomplete, and inconsistent formats
- proposal creation starts from old templates or blank documents too often
- scope is easy to leave vague, which later creates delivery and billing disputes
- pricing structure is often unclear or weakly packaged
- follow-up and revision responses take more time than they should
- creating a polished proposal is slow enough to hurt deal velocity

## 4. Product positioning

ProposalCraft should be positioned as:

> AI Scope + Proposal + Quote Copilot for small web/design/dev agencies.

It should not be positioned as:

- a generic proposal generator
- a CRM or sales pipeline tool
- a contract signing product
- a project management system
- a freeform AI document editor

The product should compete by being more focused, faster, and more aware of agency proposal structure than broad tools like PandaDoc, Qwilr, Bonsai, or ChatGPT-plus-template workflows.

## 5. Web-first decision

The first release must be a Web SaaS product.

Reasons:

- proposal creation is a desk workflow involving long-form reading, structured editing, pricing review, and export
- users already work in browser-based agency environments alongside email, docs, Figma, and Slack
- Web is faster to ship and easier to maintain for a solo founder
- Web supports SEO, landing pages, conversion flows, and trial onboarding in a single surface
- a mobile app would add build and distribution cost without matching the primary usage pattern

Mobile can be considered later only as a companion surface for notifications, lightweight follow-up, or previewing.

## 6. Core product principles

### 6.1 Structured Scope is the single source of truth

Structured Scope is the single trusted data layer for each proposal project.

All of the following must derive from it:

- proposal output
- SOW output
- quote output
- three-tier pricing output
- partial regeneration results

This is a hard architecture rule intended to prevent contradictions across generated outputs. Proposal text, SOW text, and quote text should not evolve independently into conflicting versions of the same deal.

### 6.2 Edit structure first, not long-form text first

ProposalCraft should guide users toward changing structured inputs and then regenerating outputs, instead of manually rewriting long documents.

This keeps the product aligned with its positioning and reduces the need for a heavy editor.

### 6.3 Documents support light editing only

Generated documents allow only:

- sentence-level edits
- paragraph-level edits

Generated documents do not allow:

- structural editing
- section reordering
- freeform layout editing
- turning the product into a Notion/Word-style editor

The editing model should reinforce the product workflow: adjust scope, then regenerate the document.

### 6.4 AI extraction plus rule-based validation

The first release should not rely on freeform LLM output alone.

Instead:

- AI performs extraction and drafting
- rules normalize shape and enforce basic consistency
- validation powers non-blocking risk indicators

This creates a more stable first release with fewer broken generations and less confusing output.

## 7. Core data model

### 7.1 Proposal Project

Represents a single proposal engagement.

Fields:

- id
- user_id
- client_name
- project_type
- service_category
- raw_brief
- status
- created_at
- updated_at

### 7.2 Structured Scope

Represents the normalized scope model that drives every output.

Fields:

- proposal_project_id
- deliverables
- assumptions
- exclusions
- timeline
- milestones
- pricing_model
- pricing_notes
- optional_budget
- optional_target_timeline
- extraction_notes

Structured Scope is the most important object in the system.

### 7.3 Generated Documents

Represents output views generated from Structured Scope.

Document types:

- proposal
- sow
- quote
- optional follow-up draft

These should be treated as derived artifacts, not canonical business records.

## 8. Primary user flow

The golden path is:

1. User opens dashboard
2. User creates a new proposal project
3. User pastes client brief, meeting notes, or email thread
4. AI extracts Structured Scope
5. User reviews and edits Structured Scope
6. System generates proposal, SOW, and quote views from the same source
7. User makes light document edits or partial regenerations where needed
8. User exports a PDF or copies output for delivery

This path should be faster and more reliable than using ChatGPT and old templates by hand.

## 9. MVP feature scope

### 9.1 Must-have MVP features

#### Brief intake

Support these fields:

- client name
- project type
- service category
- raw brief / notes / email content
- optional budget
- optional timeline target

#### Structured Scope extraction

AI extracts and populates:

- deliverables
- assumptions
- exclusions
- timeline
- milestones
- pricing model

#### Proposal generation

Generate a client-facing proposal draft that includes:

- project understanding
- scope summary
- timeline summary
- pricing summary
- next steps

#### SOW generation

Generate a more formal scope document with:

- deliverables
- exclusions
- assumptions
- timeline boundaries
- dependencies

#### Quote generation

Generate:

- single quote
- three-tier pricing options
- milestone payment plan

#### Template system

Ship with a small set of opinionated templates:

- web design proposal
- website development proposal
- landing page project proposal
- branding package proposal
- monthly retainer proposal

Do not build a generalized open-ended template editor in v1.

#### Basic dashboard

Show:

- proposal title or inferred project title
- client name
- project type
- last updated time
- status: draft / ready / sent

#### Export

At minimum support:

- PDF export
- copyable text output

Share links are optional but not required for v1.

#### Follow-up / revision assistance

Support a small number of focused scenarios:

- client says price is too high
- client wants scope reduced
- user wants a follow-up after sending proposal

This should stay lightweight in v1.

### 9.2 Approved lightweight MVP enhancements

#### Non-blocking scope risk tags

The Structured Scope panel should show weak warning tags in yellow when important information is missing or vague.

Examples:

- exclusions missing
- timeline missing
- pricing structure unclear
- deliverables too vague

These warnings must:

- not block generation
- not require forced correction
- remind users of proposal quality risks without interrupting their flow

#### Partial regeneration

The workspace should support regenerating a specific section without rewriting everything.

Initial supported sections:

- deliverables
- timeline
- pricing / quote
- assumptions / exclusions

Partial regeneration should only affect the chosen section by default. If broader synchronization is needed, it should be a separate explicit action.

## 10. Information architecture

The first release should remain intentionally small.

### Marketing surface

- landing page
- pricing and CTA
- example templates and before/after examples

### Product surface

- dashboard / proposal list
- new proposal intake
- proposal workspace
- export/share surface
- minimal settings

### Workspace layout

Use a two-column workspace:

Left column:

- deliverables
- assumptions
- exclusions
- timeline
- pricing
- milestones
- weak warning tags

Right column:

- proposal view
- SOW view
- quote view
- light editing controls
- partial regeneration controls

The two-column layout is important because the product's value comes from structured scope driving output, not from a freeform editor.

## 11. AI workflow

### Step 1: Extract

Input:

- raw brief
- project type
- optional budget/timeline context

Output:

- initial Structured Scope draft

Goal:

- understand the request
- identify likely deliverables
- infer missing boundaries when possible
- surface ambiguity

### Step 2: Normalize

Rules and formatting normalize the extracted scope into a consistent internal shape.

Normalization responsibilities:

- keep field structure stable
- reduce formatting drift
- support downstream generation
- support risk tag logic

### Step 3: Generate outputs

From the same Structured Scope, generate:

- proposal
- SOW
- quote
- three-tier pricing variants as needed

Each output should have a different role:

- proposal = persuasive and explanatory
- SOW = formal and boundary-oriented
- quote = pricing and payment structure

### Step 4: Light revision support

From existing scope and outputs, generate:

- concise version
- more formal version
- updated pricing block
- follow-up email
- objection-handling reply

This layer should remain secondary to the core scope-driven generation workflow.

## 12. System boundaries

To keep the first release focused, the following are explicitly out of scope:

- native mobile app
- CRM / sales pipeline management
- team approvals and complex collaboration
- comments and real-time multiplayer editing
- e-signature workflows
- payment collection
- invoicing and accounts receivable
- fully flexible rich text / layout editing
- support for many unrelated service verticals

These are all valid future expansions, but they should not shape the first release.

## 13. Error handling and validation strategy

The first release should only handle realistic, proposal-quality-impacting failure modes.

### 13.1 Sparse input

If the user provides too little information, the system should request minimum clarifying structure rather than generating an empty-feeling proposal.

### 13.2 Incomplete extracted scope

If important scope sections are missing, the system should show weak warning tags instead of blocking the user.

### 13.3 Cross-document inconsistency

The architecture should reduce inconsistency by generating every major output from Structured Scope rather than letting each document drift independently.

### 13.4 Generic output

If output feels too generic, the product should encourage improvements at the structure layer rather than encouraging repeated full rewrites.

## 14. Testing strategy

### 14.1 Structured Scope reliability tests

Validate that different raw briefs produce a stable normalized scope shape and expose missing information correctly.

### 14.2 Golden-path generation review

Prepare representative examples such as:

- website redesign
- landing page build
- branding package
- monthly retainer
- small custom dev project

Verify that proposal, SOW, and quote outputs are distinct, useful, and aligned with the same scope.

### 14.3 Manual user validation

The key product test is whether a real target user can paste a brief, generate outputs, make small corrections, and feel comfortable sending the result to a client.

This matters more than complex benchmark systems in v1.

## 15. MVP success criteria

The first release should be considered successful if:

- a user can go from messy brief to sendable proposal package in about 10 minutes
- proposal, SOW, and quote outputs clearly serve different roles
- users feel it is materially better than ChatGPT plus old templates
- users are willing to pay for the workflow instead of treating it as a novelty generator
- scope contradictions are meaningfully reduced by the single-source-of-truth model

## 16. Recommended release framing

The first release should be framed as a focused proposal workspace for small agencies, not a broad business operating suite.

A good framing line is:

> Turn messy client briefs into clear proposals, SOWs, and quotes without starting from scratch.

That framing aligns with the core workflow, the Web-first product shape, and the target user's willingness to pay.
