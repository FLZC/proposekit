import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BriefIntakeForm } from "@/components/proposals/brief-intake-form";

describe("BriefIntakeForm", () => {
  it("submits the captured intake payload", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<BriefIntakeForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText("Client name"), {
      target: { value: "Acme Studio" },
    });
    fireEvent.change(screen.getByLabelText("Budget (USD)"), {
      target: { value: "$5,000 – $10,000" },
    });
    fireEvent.change(screen.getByLabelText("Timeline"), {
      target: { value: "4 weeks" },
    });
    fireEvent.change(screen.getByLabelText("Brief or meeting notes"), {
      target: { value: "Need a 5-page marketing site with CMS support." },
    });

    const submitButton = screen.getByRole("button", { name: "Extract Structured Scope →" });
    fireEvent.submit(submitButton.closest("form") as HTMLFormElement);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        clientName: "Acme Studio",
        templateId: "web_design",
        rawBrief: "Need a 5-page marketing site with CMS support.",
        optionalBudget: "$5,000 – $10,000",
        optionalTargetTimeline: "4 weeks",
      });
    });
  });
});
