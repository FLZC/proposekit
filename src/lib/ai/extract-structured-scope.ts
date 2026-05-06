import { normalizeStructuredScope } from "@/lib/proposals/scope-schema";
import type { StructuredScope } from "@/lib/proposals/types";
import { jsonOnlyInstruction } from "./prompts";

const ZHIPU_MODEL = "glm-4-flash";
const ZHIPU_BASE = "https://open.bigmodel.cn/api/paas/v4";

export function buildExtractScopePrompt(input: {
  projectType?: string;
  rawBrief: string;
  optionalBudget?: string;
  optionalTargetTimeline?: string;
  templateId?: string;
}) {
  const context = [
    input.optionalBudget && `Budget from form: ${input.optionalBudget}`,
    input.optionalTargetTimeline && `Timeline from form: ${input.optionalTargetTimeline}`,
  ].filter(Boolean).join(". ");

  return [
    "You are extracting proposal scope for a small web/design agency from a client brief.",
    jsonOnlyInstruction("StructuredScope"),
    "",
    "Return this JSON shape:",
    '{',
    '  "deliverables": ["string array — each item is one concrete deliverable"],',
    '  "assumptions": ["string array — what the project assumes client will provide or do"],',
    '  "exclusions": ["string array — what is explicitly NOT included"],',
    '  "timeline": "string — overall project duration, e.g. \'8 weeks\' or \'3 months\'",',
    '  "milestones": ["string array — key project phases or checkpoints"],',
    '  "pricingModel": "one of: fixed_price, milestone, three_tier, or empty string if unclear",',
    '  "pricingNotes": "string — budget amount, payment terms, or pricing details from brief"',
    '}',
    "",
    `Project type: ${input.projectType ?? "web/design project"}`,
    `Template: ${input.templateId ?? "not specified"}`,
    "",
    input.templateId === "web_design"
      ? "NOTE: This is a web DESIGN project — deliverables are design files (Figma, mockups, prototypes), not code."
      : input.templateId === "branding_package"
      ? "NOTE: This is a BRANDING project — deliverables are logo, color palette, typography, brand guidelines, not a website."
      : input.templateId === "landing_page"
      ? "NOTE: This is a LANDING PAGE project — single-page, conversion-focused. Not a full website."
      : input.templateId === "monthly_retainer"
      ? "NOTE: This is a MONTHLY RETAINER. Extract recurring monthly services, hours per month, SLA terms. pricingModel='fixed_price', pricingNotes='$X/mo for Y hours'."
      : "",
    context ? `Additional context: ${context}` : "",
    `Raw brief: ${input.rawBrief}`,
    "",
    "CRITICAL RULES:",
    "— timeline: always include units, e.g. '6 weeks' not '6'",
    "— pricingNotes: always include full original text with $ and numbers, e.g. '$10,000; 50% upfront, 50% on launch' not '10'",
    "— optionalBudget: same as pricingNotes — keep the $ sign and full amount",
    "— Do not skip fields — use empty string only for truly missing info.",
  ].join("\n");
}

export function normalizeExtractedScope(input: Partial<StructuredScope>) {
  return normalizeStructuredScope(input);
}

function isBudgetLine(s: string) {
  return /\b(budget|cost|price|fee|rate|charge)\b/i.test(s) || /\$\d/.test(s);
}

function isTimelineLine(s: string) {
  return /\b(timeline|deadline|weeks?|months?|days?|TAT)\b/i.test(s);
}

function fallbackScopeFromInput(input: {
  projectType?: string;
  rawBrief: string;
  optionalBudget?: string;
  optionalTargetTimeline?: string;
  templateId?: string;
}): StructuredScope {
  const sentences = input.rawBrief
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const deliverables = sentences.filter((s) => !isBudgetLine(s) && !isTimelineLine(s));
  const budgetLine = input.optionalBudget || sentences.find(isBudgetLine)?.replace(/^budget:?\s*/i, "") || "";
  const timelineLine = input.optionalTargetTimeline || sentences.find(isTimelineLine)?.replace(/^timeline:?\s*/i, "") || "";

  return normalizeStructuredScope({
    deliverables:
      deliverables.length > 0
        ? deliverables.slice(0, 5).map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        : [input.projectType ?? "Project"],
    assumptions: ["Client provides necessary materials and feedback"],
    exclusions: [],
    timeline: timelineLine,
    milestones: [],
    pricingModel: "",
    pricingNotes: budgetLine,
    optionalBudget: budgetLine,
    optionalTargetTimeline: timelineLine,
    extractionNotes: "Generated without AI (no API key configured)",
  });
}

function hasApiKey() {
  return Boolean(process.env.ZHIPU_API_KEY);
}

export async function extractStructuredScope(input: {
  projectType?: string;
  rawBrief: string;
  optionalBudget?: string;
  optionalTargetTimeline?: string;
  templateId?: string;
}): Promise<StructuredScope> {
  const apiKey = process.env.ZHIPU_API_KEY;
  if (!apiKey) {
    return fallbackScopeFromInput(input);
  }

  try {
    const prompt = buildExtractScopePrompt(input);
    const response = await fetch(`${ZHIPU_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: ZHIPU_MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1200,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Zhipu API error ${response.status}: ${errorText}`);
      return fallbackScopeFromInput(input);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content ?? "";

    // Zhipu may wrap JSON in markdown fences
    const json = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

    const scope = normalizeExtractedScope(JSON.parse(json));
    scope.extractionNotes = "AI extracted";
    return scope;
  } catch (error) {
    console.error("Zhipu extraction failed:", error);
    return fallbackScopeFromInput(input);
  }
}
