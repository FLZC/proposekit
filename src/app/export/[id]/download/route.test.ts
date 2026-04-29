import { describe, expect, it, vi } from "vitest";

const getProposalProjectById = vi.fn();
const renderToBuffer = vi.fn();

vi.mock("@/lib/data/proposal-projects", () => ({
  getProposalProjectById,
}));

vi.mock("@react-pdf/renderer", () => ({
  Document: "Document",
  Page: "Page",
  Text: "Text",
  View: "View",
  renderToBuffer,
  StyleSheet: { create: (s: Record<string, unknown>) => s },
}));

describe("export download route", () => {
  it("builds the PDF from the stored project scope", async () => {
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
    renderToBuffer.mockResolvedValue(new Uint8Array([1, 2, 3]));

    const { GET } = await import("./route");
    const response = await GET(new Request("http://localhost/export/project-123/download"), {
      params: Promise.resolve({ id: "project-123" }),
    });

    expect(getProposalProjectById).toHaveBeenCalledWith("project-123");
    expect(renderToBuffer).toHaveBeenCalled();
    expect(response.headers.get("Content-Type")).toBe("application/pdf");
    expect(response.headers.get("Content-Disposition")).toBe('attachment; filename="proposal-Northwind-Studio.pdf"');
  });
});
