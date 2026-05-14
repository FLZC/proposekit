import { describe, expect, it } from "vitest";
import { applyRegeneratedSection } from "@/lib/ai/regenerate-section";

describe("applyRegeneratedSection", () => {
  it("updates only the pricing section", () => {
    const original = {
      deliverables: "Landing page",
      timeline: "2 weeks",
      pricing: "Fixed price: $3,000",
      assumptionsExclusions: "Client provides copy",
    };

    const updated = applyRegeneratedSection(original, "pricing", "Three tiers: $3k / $5k / $7k");

    expect(updated.pricing).toBe("Three tiers: $3k / $5k / $7k");
    expect(updated.timeline).toBe("2 weeks");
  });
});
