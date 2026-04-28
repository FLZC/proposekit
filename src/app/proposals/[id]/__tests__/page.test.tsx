import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const getProposalProjectById = vi.fn();

vi.mock("@/lib/data/proposal-projects", () => ({
  getProposalProjectById,
}));

describe("ProposalWorkspacePage", () => {
  it("renders proposal content from the stored project scope", async () => {
    getProposalProjectById.mockResolvedValue({
      id: "project-123",
      client_name: "Northwind Studio",
      project_type: "website development",
      service_category: "web development",
      structured_scope: {
        deliverables: ["Analytics dashboard"],
        assumptions: ["Client provides API access"],
        exclusions: ["No native mobile app"],
        timeline: "6 weeks",
        milestones: ["Week 1 kickoff"],
        pricingModel: "fixed_price",
        pricingNotes: "$12,000 fixed fee",
      },
    });

    const { default: ProposalWorkspacePage } = await import("../page");
    render(await ProposalWorkspacePage({ params: Promise.resolve({ id: "project-123" }) }));

    const editor = screen.getByLabelText("Document content") as HTMLTextAreaElement;
    expect(editor.value).toContain("Analytics dashboard");
    expect(editor.value).toContain("6 weeks");
    expect(editor.value).toContain("$12,000 fixed fee");
    expect(screen.getByRole("link", { name: "Export & download" })).toHaveAttribute("href", "/export/project-123");
  });
});
