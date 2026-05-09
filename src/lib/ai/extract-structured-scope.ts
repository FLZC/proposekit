import { normalizeStructuredScope } from "@/lib/proposals/scope-schema";
import type { StructuredScope } from "@/lib/proposals/types";
import { jsonOnlyInstruction } from "./prompts";

const AI_MODEL = "gemini-2.5-flash";
const AI_BASE = "https://generativelanguage.googleapis.com/v1beta/openai";

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
      ? "NOTE: This is a web DESIGN project. Deliverables should be design files (e.g. Figma mockups, wireframes, prototypes, style guides), not code. Do not mention development or coding."
      : input.templateId === "branding_package"
      ? "NOTE: This is a BRANDING project. Deliverables should be brand assets (e.g. logo, color palette, typography, brand guidelines), not a website. Do not mention web pages or code."
      : input.templateId === "landing_page"
      ? "NOTE: This is a LANDING PAGE project — single page, conversion-focused. Not a full multi-page website. Deliverables might include copy, CRO, design comps."
      : input.templateId === "monthly_retainer"
      ? "NOTE: This is a MONTHLY RETAINER. The client is paying a recurring fee for ongoing services. Deliverables are recurring (e.g. monthly maintenance, support hours, content updates). pricingModel should be 'fixed_price'. pricingNotes should describe the monthly fee (use actual numbers from the brief, e.g. '$500/mo for 5 hours' or '$1,200/mo unlimited support'). Do NOT output placeholder text like $X or Y hours."
      : "",
    context ? `Additional context: ${context}` : "",
    `Raw brief: ${input.rawBrief}`,
    "",
    "CRITICAL RULES:",
    "— timeline: always include units, e.g. '6 weeks' not '6'. If not mentioned, leave empty.",
    "— pricingNotes: include full original text with $ and numbers, e.g. '$10,000; 50% upfront, 50% on launch'. If budget is not mentioned, leave empty.",
    "— NEVER output placeholder text like '$X/mo', 'Y hours', 'TBD', or 'unknown'. If a field is not mentioned in the brief, use empty string or empty array.",
    "— Only extract what is explicitly stated in the brief. Do not invent deliverables, assumptions, or exclusions.",
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

export async function extractStructuredScope(input: {
  projectType?: string;
  rawBrief: string;
  optionalBudget?: string;
  optionalTargetTimeline?: string;
  templateId?: string;
}): Promise<StructuredScope> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return fallbackScopeFromInput(input);
  }

  try {
    const prompt = buildExtractScopePrompt(input);
    const response = await fetch(`${AI_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 4000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`AI API error ${response.status}: ${errorText}`);
      return fallbackScopeFromInput(input);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content ?? "";
    if (!text) {
      console.error("AI returned empty response");
      return fallbackScopeFromInput(input);
    }

    const json = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

    try {
      const parsed = JSON.parse(json);
      const scope = normalizeExtractedScope(parsed);
      scope.extractionNotes = "AI extracted";
      return scope;
    } catch (parseError) {
      console.error("AI JSON parse failed:", parseError, "Raw text:", text);
      return fallbackScopeFromInput(input);
    }
  } catch (error) {
    console.error("AI extraction failed:", error);
    return fallbackScopeFromInput(input);
  }
}
