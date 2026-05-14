import { describe, expect, it } from "vitest";
import { buildExtractScopePrompt, normalizeExtractedScope } from "@/lib/ai/extract-structured-scope";

describe("extract scope helpers", () => {
  it("builds a prompt that asks for canonical structured scope fields", () => {
    const prompt = buildExtractScopePrompt({
      projectType: "website redesign",
      rawBrief: "Need a 5-page marketing website with CMS and launch support.",
      optionalBudget: "$8k-$12k",
      optionalTargetTimeline: "4 weeks",
    });

    expect(prompt).toContain("deliverables");
    expect(prompt).toContain("assumptions");
    expect(prompt).toContain("exclusions");
    expect(prompt).toContain("pricingModel");
  });

  it("normalizes raw model output into a valid structured scope", () => {
    const scope = normalizeExtractedScope({
      deliverables: ["5-page marketing website", "CMS setup"],
      assumptions: ["Client provides copy"],
      exclusions: ["No custom illustrations"],
      timeline: "4 weeks",
      milestones: ["Week 1 discovery", "Week 4 launch"],
      pricingModel: "milestone",
      pricingNotes: "50/30/20",
    });

    expect(scope.pricingModel).toBe("milestone");
    expect(scope.milestones).toHaveLength(2);
  });
});
