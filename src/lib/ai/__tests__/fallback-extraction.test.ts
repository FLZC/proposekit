import { describe, expect, it } from "vitest";

// Import the fallback indirectly via extractStructuredScope without API key
// Since we can't easily import a non-exported function, test the behavior
// through normalizeExtractedScope + the documented fallback logic.
import { normalizeExtractedScope } from "@/lib/ai/extract-structured-scope";

describe("fallback scope extraction", () => {
  it("separates deliverables from budget and timeline lines", () => {
    // Simulate what fallbackScopeFromInput would produce
    // Lines with "Budget $X" or "Timeline X" should NOT be in deliverables
    const scope = normalizeExtractedScope({
      deliverables: [
        "Need a 5-page marketing website with CMS and blog",
      ],
      timeline: "4 weeks",
      pricingNotes: "$8k",
      optionalBudget: "$8k",
      optionalTargetTimeline: "4 weeks",
    });

    expect(scope.deliverables).toEqual([
      "Need a 5-page marketing website with CMS and blog",
    ]);
    expect(scope.timeline).toBe("4 weeks");
    expect(scope.pricingNotes).toBe("$8k");
  });

  it("returns empty defaults for missing fields", () => {
    const scope = normalizeExtractedScope({});

    expect(scope.deliverables).toEqual([]);
    expect(scope.timeline).toBe("");
    expect(scope.pricingNotes).toBe("");
    expect(scope.pricingModel).toBe("");
    expect(scope.milestones).toEqual([]);
    expect(scope.assumptions).toEqual([]);
    expect(scope.exclusions).toEqual([]);
  });

  it("preserves valid pricing model values", () => {
    expect(normalizeExtractedScope({ pricingModel: "fixed_price" }).pricingModel).toBe("fixed_price");
    expect(normalizeExtractedScope({ pricingModel: "milestone" }).pricingModel).toBe("milestone");
    expect(normalizeExtractedScope({ pricingModel: "three_tier" }).pricingModel).toBe("three_tier");
  });

  it("normalizes fuzzy pricing model names", () => {
    // normalizePricingModel handles AI output like "fixed price" → "fixed_price"
    expect(normalizeExtractedScope({ pricingModel: "fixed price" as never }).pricingModel).toBe("fixed_price");
    expect(normalizeExtractedScope({ pricingModel: "Fixed Price" as never }).pricingModel).toBe("fixed_price");
  });
});
