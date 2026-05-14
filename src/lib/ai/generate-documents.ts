import type { StructuredScope } from "@/lib/proposals/types";
import { getTemplateByCategory, getTemplate } from "@/lib/templates/templates";
import { renderDocuments } from "@/lib/templates/render";
import type { Template } from "@/lib/templates/types";
import { callAI } from "./config";

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

export function generateStaticDocumentDrafts(
  scope: StructuredScope,
  template?: Template,
  clientName = "Client",
  projectType = "Website Project",
) {
  return renderDocuments(template ?? getTemplate("website_development")!, {
    clientName,
    projectType,
    scope,
  });
}

const POLISH_PROMPT = `You are a professional business proposal editor.

Rules:
1. Keep ALL sections, headings, structure EXACTLY as-is.
2. Keep ALL scope, assumptions, exclusions, deliverables, pricing — do not remove any item.
3. Keep {{variables}} unchanged.
4. Only improve: wording, flow, clarity, professionalism.
5. Use US business English.
6. DO NOT add fake metrics or ROI numbers.
7. DO NOT remove legal/scope terms.
8. DO NOT omit, truncate, or summarize any section — output the COMPLETE document.
9. The input length must equal the output length (±10%).

Return the polished text only. Do not add explanations.`;

export async function polishDocument(body: string): Promise<string> {
  const apiKey = process.env.LINKAPI_API_KEY;
  if (!apiKey) return body;

  try {
    const polished = await callAI(`Polish the text below:\n\n${body}`, {
      systemPrompt: POLISH_PROMPT,
      maxTokens: 16384,
      temperature: 0.3,
    });

    if (!polished) return body;

    // Guard against AI truncation
    if (polished.length < body.length * 0.8) return body;

    return polished;
  } catch {
    return body;
  }
}

export async function generatePolishedDocuments(
  scope: StructuredScope,
  template?: Template,
  clientName = "Client",
  projectType = "Website Project",
) {
  const drafts = generateStaticDocumentDrafts(scope, template, clientName, projectType);
  if (!process.env.LINKAPI_API_KEY) return drafts;

  // Only polish proposal — SOW needs precision, quote needs exact numbers
  const proposal = await polishDocument(drafts.proposal.body);

  return {
    proposal: { title: drafts.proposal.title, body: proposal },
    sow: drafts.sow,
    quote: drafts.quote,
  };
}
