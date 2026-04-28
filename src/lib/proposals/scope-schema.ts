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
  return value === "fixed_price" || value === "milestone" || value === "three_tier" || value === "" ? value : "";
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
    pricingNotes: normalizeString(input.pricingNotes),
    optionalBudget: normalizeOptionalString(input.optionalBudget),
    optionalTargetTimeline: normalizeOptionalString(input.optionalTargetTimeline),
    extractionNotes: normalizeOptionalString(input.extractionNotes),
  });
}
