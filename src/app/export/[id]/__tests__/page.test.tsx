import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const getProposalProjectById = vi.fn();
const getGeneratedDocuments = vi.fn().mockResolvedValue(null);

vi.mock("@/lib/data/proposal-projects", () => ({
  getProposalProjectById,
}));

vi.mock("@/lib/data/generated-documents", () => ({
  getGeneratedDocuments,
}));

describe("ExportPreviewPage", () => {
  it("renders preview content from the stored project", async () => {
    getProposalProjectById.mockResolvedValue({
      id: "project-123",
      client_name: "Northwind Studio",
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

    const { default: ExportPreviewPage } = await import("../page");
    render(await ExportPreviewPage({ params: Promise.resolve({ id: "project-123" }) }));

    expect(screen.getByText("Export preview")).toBeInTheDocument();
    expect(screen.getByText("Northwind Studio")).toBeInTheDocument();
    expect(screen.getAllByText(/Analytics dashboard/).length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "Download PDF" })).toBeInTheDocument();
  });
});
