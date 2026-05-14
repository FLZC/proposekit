import { describe, expect, it, vi } from "vitest";

const getProposalProjectById = vi.fn();
const getCurrentUser = vi.fn().mockResolvedValue(null);
const getGeneratedDocuments = vi.fn().mockResolvedValue(null);
const generatePdf = vi.fn();

vi.mock("@/lib/data/proposal-projects", () => ({
  getProposalProjectById,
}));

vi.mock("@/lib/data/generated-documents", () => ({
  getGeneratedDocuments,
}));

vi.mock("@/lib/supabase/server", () => ({
  getCurrentUser,
}));

vi.mock("@/lib/templates/render", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/templates/render")>();
  return {
    ...actual,
    projectTypeLabel: (s: string) => s,
  };
});

vi.mock("./pdf", () => ({
  generatePdf,
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
    generatePdf.mockResolvedValue(new Uint8Array([1, 2, 3]));

    const { GET } = await import("./route");
    const response = await GET(new Request("http://localhost/export/project-123/download"), {
      params: Promise.resolve({ id: "project-123" }),
    });

    expect(getProposalProjectById).toHaveBeenCalledWith("project-123");
    expect(generatePdf).toHaveBeenCalled();
    expect(response.headers.get("Content-Type")).toBe("application/pdf");
    expect(response.headers.get("Content-Disposition")).toBe('attachment; filename="proposal-Northwind-Studio.pdf"');
  });
});
