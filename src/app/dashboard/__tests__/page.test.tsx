import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const listProposalProjects = vi.fn();
const getCurrentUser = vi.fn();

vi.mock("@/lib/data/proposal-projects", () => ({
  listProposalProjects,
}));

vi.mock("@/lib/supabase/server", () => ({
  getCurrentUser,
  getSupabaseServerClient: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("DashboardPage", () => {
  it("renders returned proposal cards", async () => {
    getCurrentUser.mockResolvedValue({ id: "test-user-id" });
    listProposalProjects.mockResolvedValue([
      {
        id: "demo-proposal",
        client_name: "Acme Studio",
        project_type: "Website redesign",
        status: "draft",
        updated_at: "2026-04-24T00:00:00.000Z",
      },
    ]);

    const { default: DashboardPage } = await import("@/app/dashboard/page");
    render(await DashboardPage());

    expect(screen.getByText("Proposal dashboard")).toBeInTheDocument();
    expect(screen.getByText("Acme Studio")).toBeInTheDocument();
  });
});
