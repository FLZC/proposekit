import { describe, expect, it } from "vitest";
import { generateFollowUp } from "@/lib/ai/generate-follow-up";

describe("generateFollowUp", () => {
  it("returns a scope reduction response", () => {
    const message = generateFollowUp({
      scenario: "scope_reduction",
      clientName: "Acme Studio",
      proposalSummary: "Website redesign proposal",
    });

    expect(message).toContain("Acme Studio");
    expect(message).toContain("smaller scope");
  });

  it("returns a post-send follow-up response", () => {
    const message = generateFollowUp({
      scenario: "post_send_follow_up",
      clientName: "Acme Studio",
      proposalSummary: "Website redesign proposal",
    });

    expect(message).toContain("Acme Studio");
    expect(message).toContain("following up");
  });
});
