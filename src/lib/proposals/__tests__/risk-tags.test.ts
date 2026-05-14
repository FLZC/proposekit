import { describe, expect, it } from "vitest";
import { getScopeRiskTags } from "@/lib/proposals/risk-tags";

describe("getScopeRiskTags", () => {
  it("returns non-blocking tags for missing exclusions and pricing structure", () => {
    const tags = getScopeRiskTags({
      deliverables: ["Landing page design"],
      assumptions: [],
      exclusions: [],
      timeline: "",
      milestones: [],
      pricingModel: "",
      pricingNotes: "",
    });

    expect(tags).toEqual([
      "Exclusions are missing",
      "Timeline is missing",
      "Pricing structure is unclear",
    ]);
  });
});
