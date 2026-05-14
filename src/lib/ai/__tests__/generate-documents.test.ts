import { describe, expect, it } from "vitest";
import { buildDocumentContext, generateStaticDocumentDrafts } from "@/lib/ai/generate-documents";

describe("generate document helpers", () => {
  it("creates proposal, sow, and quote drafts from the same scope", () => {
    const drafts = generateStaticDocumentDrafts({
      deliverables: ["Homepage redesign", "CMS setup"],
      assumptions: ["Client provides copy"],
      exclusions: ["No SEO migration"],
      timeline: "4 weeks",
      milestones: ["Week 1 discovery", "Week 4 handoff"],
      pricingModel: "three_tier",
      pricingNotes: "Starter / Growth / Premium",
    });

    expect(drafts.proposal.title).toContain("Proposal");
    expect(drafts.sow.title).toContain("Scope of Work");
    expect(drafts.quote.title).toContain("Quote");
  });

  it("builds a single context string from structured scope", () => {
    const context = buildDocumentContext({
      deliverables: ["Landing page"],
      assumptions: [],
      exclusions: [],
      timeline: "2 weeks",
      milestones: [],
      pricingModel: "fixed_price",
      pricingNotes: "$3,000",
    });

    expect(context).toContain("Landing page");
    expect(context).toContain("fixed_price");
  });
});
