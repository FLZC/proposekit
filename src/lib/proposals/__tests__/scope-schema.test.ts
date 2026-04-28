import { describe, expect, it } from "vitest";
import { normalizeStructuredScope } from "@/lib/proposals/scope-schema";

describe("normalizeStructuredScope", () => {
  it("normalizes a web redesign scope into the canonical shape", () => {
    const scope = normalizeStructuredScope({
      deliverables: ["Homepage redesign", "CMS setup"],
      assumptions: ["Client provides copy"],
      exclusions: ["No custom illustrations"],
      timeline: "4 weeks",
      milestones: ["Week 1 discovery", "Week 4 handoff"],
      pricingModel: "fixed_price",
      pricingNotes: "50% upfront, 50% on final approval",
    });

    expect(scope.deliverables).toEqual(["Homepage redesign", "CMS setup"]);
    expect(scope.pricingModel).toBe("fixed_price");
    expect(scope.timeline).toBe("4 weeks");
  });

  it("ignores non-string extracted values instead of crashing", () => {
    const scope = normalizeStructuredScope({
      deliverables: ["Homepage redesign", { text: "CMS setup" } as never],
      assumptions: ["Client provides copy"],
      exclusions: ["No custom illustrations"],
      timeline: { label: "4 weeks" } as never,
      milestones: [{ label: "Week 1 discovery" } as never, "Week 4 handoff"],
      pricingModel: { label: "fixed_price" } as never,
      pricingNotes: 42 as never,
    });

    expect(scope.deliverables).toEqual(["Homepage redesign"]);
    expect(scope.milestones).toEqual(["Week 4 handoff"]);
    expect(scope.timeline).toBe("");
    expect(scope.pricingModel).toBe("");
    expect(scope.pricingNotes).toBe("");
  });
});
