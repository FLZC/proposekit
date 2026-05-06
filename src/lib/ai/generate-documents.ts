import type { StructuredScope } from "@/lib/proposals/types";
import { getTemplateByCategory, getTemplate } from "@/lib/templates/templates";
import { renderDocuments } from "@/lib/templates/render";
import type { Template } from "@/lib/templates/types";

const ZHIPU_BASE = "https://open.bigmodel.cn/api/paas/v4";
const ZHIPU_MODEL = "glm-4-flash";

export function buildDocumentContext(scope: StructuredScope) {
  return JSON.stringify(scope, null, 2);
}

function fuzzyMatch(input: string, candidates: string[]): string | undefined {
  const normalized = input.toLowerCase().trim();
  if (candidates.includes(normalized)) return normalized;
  for (const c of candidates) {
    if (normalized.includes(c) || c.includes(normalized)) return c;
  }
  return undefined;
}

const CATEGORIES = ["web design", "web development", "landing page", "branding", "monthly retainer"];

export function pickTemplate(projectType?: string, serviceCategory?: string): Template | undefined {
  const directMatch = getTemplate(serviceCategory ?? "") ?? getTemplate(projectType ?? "");
  if (directMatch) return directMatch;

  const match = fuzzyMatch(serviceCategory ?? "", CATEGORIES) ?? fuzzyMatch(projectType ?? "", CATEGORIES);
  if (match) return getTemplateByCategory(match);

  if ((projectType ?? "").toLowerCase().includes("design")) return getTemplate("web_design");
  if ((projectType ?? "").toLowerCase().includes("landing")) return getTemplate("landing_page");
  if ((projectType ?? "").toLowerCase().includes("brand")) return getTemplate("branding_package");
  if ((projectType ?? "").toLowerCase().includes("retainer") || (projectType ?? "").toLowerCase().includes("maintenance")) {
    return getTemplate("monthly_retainer");
  }
  return getTemplate("website_development");
}

function buildProposalPrompt(scope: StructuredScope, clientName: string, projectType: string, template: Template): string {
  const profile = template.id === "monthly_retainer" ? "monthly website support/maintenance" : "project-based";
  return [
    `You are a senior proposal writer for a boutique web/design agency. Your proposals consistently win projects because you write for humans — not corporate templates.`,
    ``,
    `Write a complete project proposal for a client. Use "you" and "your" heavily. Write like a trusted consultant, not a vendor.`,
    ``,
    `CLIENT: ${clientName}`,
    `PROJECT TYPE: ${projectType} (${profile})`,
    ``,
    `SCOPE (already agreed with client):`,
    `— Deliverables: ${scope.deliverables.join(", ")}`,
    `— Timeline: ${scope.timeline || "TBD"}`,
    `— Budget/Pricing: ${scope.pricingNotes || "Not specified"}`,
    `— Pricing model: ${scope.pricingModel || "fixed"}`,
    `— Assumptions: ${scope.assumptions.join(", ") || "Standard industry assumptions"}`,
    `— Exclusions: ${scope.exclusions.join(", ") || "None explicitly listed"}`,
    `— Milestones: ${scope.milestones.join(", ") || "To be defined"}`,
    ``,
    `REQUIRED SECTIONS — write each one:`,
    ``,
    `1. YOUR SITUATION (50–75 words)`,
    `   Restate the client's need in your own words. Show you listened. End with: "Here's how we'll get it done."`,
    ``,
    `2. HOW WE'LL DELIVER (125–175 words)`,
    `   Phase 1: Discovery & Planning`,
    `   Phase 2: Design / Build`,
    `   Phase 3: Testing & Launch`,
    `   Include a specific detail about their project (not generic).`,
    ``,
    `3. WHAT YOU GET (75–100 words)`,
    `   List concrete deliverables tied to the scope above. Be specific.`,
    ``,
    `4. THE OUTCOME (50–75 words)`,
    `   What changes for their business after this project. Use at least 2 specific, quantified benefits. No vague promises.`,
    ``,
    `5. TIMELINE (50 words)`,
    `   Map milestones to real calendar logic. State what client needs to provide and when.`,
    ``,
    `6. INVESTMENT (50–75 words)`,
    `   Frame the budget as an investment. Tie it to outcomes, not line items. Include payment terms. End with a positive note about value.`,
    ``,
    `7. WHY ME (50–75 words)`,
    `   Write as an individual (I/me), not a company. Honest, direct, personal. What makes you different. End with an invitation to talk.`,
    ``,
    `RULES:`,
    `— NO template language. NO "we specialize in", "thank you for the opportunity", "our process combines".`,
    `— NO fluff words: "might", "could", "possibly", "significant", "robust", "comprehensive".`,
    `— USE concrete numbers, active voice, short sentences.`,
    `— USE "you" and "your" at least 3x more than "I" or "we".`,
    `— TOTAL: 450–650 words.`,
    ``,
    `FORMAT: Use ## for section titles. Use — for bullet points. Use **bold** for key numbers and outcomes.`,
    `Do NOT include a cover/title. Start directly with section 1. Return plain markdown.`,
  ].join("\n");
}

function buildSOWPrompt(scope: StructuredScope, clientName: string, projectType: string): string {
  return [
    `You are writing a Statement of Work — a formal, boundary-setting document. It must be clear, precise, and legally safe.`,
    ``,
    `CLIENT: ${clientName}`,
    `PROJECT: ${projectType}`,
    ``,
    `IN SCOPE: ${scope.deliverables.join(", ")}`,
    `OUT OF SCOPE: ${scope.exclusions.join(", ") || "No exclusions specified"}`,
    `TIMELINE: ${scope.timeline || "TBD"}`,
    `MILESTONES: ${scope.milestones.join(", ") || "To be defined"}`,
    `ASSUMPTIONS: ${scope.assumptions.join(", ") || "Client provides necessary materials"}`,
    `PRICING: ${scope.pricingNotes || "Not specified"} (${scope.pricingModel || "fixed"})`,
    ``,
    `SECTIONS:`,
    `## Scope of Work — describe what's included, referencing the deliverables`,
    `## Out of Scope — list what's explicitly excluded, plus standard exclusions (hosting, content, third-party systems)`,
    `## Deliverables & Acceptance — table format: Deliverable | Format | Acceptance Criteria`,
    `## Timeline & Milestones — concrete dates/schedule, client review windows, dependencies`,
    `## Assumptions & Dependencies — what the plan depends on; what client must provide`,
    `## Change Management — how scope changes are handled`,
    `## Terms — payment schedule, IP ownership, cancellation, warranty`,
    ``,
    `RULES: Formal but not legalistic. Clear boundaries. No vague scope descriptions.`,
    `FORMAT: ## headings, — bullets, **bold** for key terms. Start directly with Scope of Work.`,
  ].join("\n");
}

function buildQuotePrompt(scope: StructuredScope, clientName: string): string {
  const budget = scope.pricingNotes || scope.optionalBudget || "Custom quote";
  return [
    `Write a pricing quote for a client. Present three clear package tiers.`,
    ``,
    `CLIENT: ${clientName}`,
    `BUDGET CONTEXT: ${budget}`,
    ``,
    `Create three tiers:`,
    `### Essentials — lower-end price, core scope only`,
    `### Growth — moderate price, adds value features (this is the recommended tier)`,
    `### Authority — premium price, full scope + extras (anchors the others as good value)`,
    ``,
    `Each tier: name, price range, one-line description, 4–6 bullet features.`,
    `Add a payment schedule line at the end.`,
    ``,
    `RULES: Prices must make sense for US market small agency. Use $ amounts. Mark the Growth tier as recommended with **(recommended)**.`,
    `FORMAT: ### tier name, $X price, one-line desc, — bullet features. Start directly.`,
  ].join("\n");
}

async function callAI(prompt: string): Promise<string> {
  const apiKey = process.env.ZHIPU_API_KEY;
  if (!apiKey) throw new Error("No API key");

  const response = await fetch(`${ZHIPU_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: ZHIPU_MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) throw new Error(`API error ${response.status}`);
  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}

export async function generateAIDocuments(
  scope: StructuredScope,
  template?: Template,
  clientName = "Client",
  projectType = "Website Project",
): Promise<{ proposal: { title: string; body: string }; sow: { title: string; body: string }; quote: { title: string; body: string } }> {
  const tpl = template ?? getTemplate("website_development")!;
  const hasAI = Boolean(process.env.ZHIPU_API_KEY);

  if (!hasAI) {
    // Fallback to static templates
    return renderDocuments(tpl, { clientName, projectType, scope });
  }

  try {
    const [proposal, sow, quote] = await Promise.all([
      callAI(buildProposalPrompt(scope, clientName, projectType, tpl)),
      callAI(buildSOWPrompt(scope, clientName, projectType)),
      callAI(buildQuotePrompt(scope, clientName)),
    ]);

    const disclaimer = `\n\n---\n\n**Disclaimer:** This document was generated with AI assistance and is a starting point only. It does not constitute legal, financial, or professional advice. Review all content carefully before sending to clients.`;

    return {
      proposal: { title: `${projectType} — ${clientName}`, body: proposal + disclaimer },
      sow: { title: `SOW — ${clientName}`, body: sow + disclaimer },
      quote: { title: `Quote — ${clientName}`, body: quote + disclaimer },
    };
  } catch (error) {
    console.error("AI generation failed, using template fallback:", error);
    return renderDocuments(tpl, { clientName, projectType, scope });
  }
}

export function generateStaticDocumentDrafts(
  scope: StructuredScope,
  template?: Template,
  clientName = "Client",
  projectType = "Website Project",
) {
  // Static fallback — called when AI is not needed or as default
  return renderDocuments(template ?? getTemplate("website_development")!, {
    clientName,
    projectType,
    scope,
  });
}
