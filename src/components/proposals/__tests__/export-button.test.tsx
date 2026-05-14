import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExportButton } from "@/components/proposals/export-button";

describe("ExportButton", () => {
  it("links to the export preview route", () => {
    render(<ExportButton proposalId="demo-proposal" />);

    const link = screen.getByRole("link", { name: "Export PDF ↗" });
    expect(link).toHaveAttribute("href", "/export/demo-proposal");
  });
});
