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
  clientProvidesDesign: z.boolean().optional(),
});

function normalizeStringList(items: unknown) {
  if (!Array.isArray(items)) return [];
  return items.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean);
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeOptionalString(value: unknown) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

function normalizePricingModel(value: unknown): StructuredScope["pricingModel"] {
  if (typeof value !== "string") return "";
  const normalized = value.trim().toLowerCase().replace(/[\s-]+/g, "_");
  if (normalized === "fixed_price" || normalized === "milestone" || normalized === "three_tier") return normalized;
  if (normalized.includes("fixed") || normalized.includes("flat")) return "fixed_price";
  if (normalized.includes("milestone") || normalized.includes("phase")) return "milestone";
  if (normalized.includes("tier") || normalized.includes("three")) return "three_tier";
  return "";
}

function normalizeBudget(value: unknown): string {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  // Already has $ or currency context — keep as-is
  if (/\$/.test(trimmed)) return trimmed;
  // Bare number like "12000" or "12" → add $ and comma
  if (/^\d+$/.test(trimmed)) {
    const num = parseInt(trimmed, 10);
    return `$${num.toLocaleString("en-US")}`;
  }
  // Number with k/m suffix like "12k" or "5m"
  const km = trimmed.match(/^(\d+)\s*[kK]$/);
  if (km) return `$${km[1]},000`;
  return trimmed;
}

export function normalizeStructuredScope(input: Partial<StructuredScope>): StructuredScope {
  return scopeSchema.parse({
    ...input,
    deliverables: normalizeStringList(input.deliverables),
    assumptions: normalizeStringList(input.assumptions),
    exclusions: normalizeStringList(input.exclusions),
    milestones: normalizeStringList(input.milestones),
    timeline: normalizeString(input.timeline),
    pricingModel: normalizePricingModel(input.pricingModel),
    pricingNotes: normalizeBudget(input.pricingNotes),
    optionalBudget: normalizeBudget(input.optionalBudget) ? normalizeBudget(input.optionalBudget) : undefined,
    optionalTargetTimeline: normalizeOptionalString(input.optionalTargetTimeline),
    extractionNotes: normalizeOptionalString(input.extractionNotes),
    clientProvidesDesign: typeof input.clientProvidesDesign === "boolean" ? input.clientProvidesDesign : undefined,
  });
}
