import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const listProposalProjects = vi.fn();

vi.mock("@/lib/data/proposal-projects", () => ({
  listProposalProjects,
}));

describe("DashboardPage", () => {
  it("renders returned proposal cards", async () => {
    listProposalProjects.mockResolvedValue([
      {
        id: "demo-proposal",
        client_name: "Acme Studio",
        project_type: "Website redesign",
        status: "draft",
        updated_at: "2026-04-24T00:00:00.000Z",
      },
    ]);

    process.env.NEXT_PUBLIC_DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

    const { default: DashboardPage } = await import("@/app/dashboard/page");
    render(await DashboardPage());

    expect(listProposalProjects).toHaveBeenCalledWith(process.env.NEXT_PUBLIC_DEMO_USER_ID);
    expect(screen.getByText("Proposal dashboard")).toBeInTheDocument();
    expect(screen.getByText("Acme Studio")).toBeInTheDocument();
  });
});
