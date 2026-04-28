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
    fireEvent.change(screen.getByLabelText("Project type"), {
      target: { value: "Website redesign" },
    });
    fireEvent.change(screen.getByLabelText("Service category"), {
      target: { value: "Web design" },
    });
    fireEvent.change(screen.getByLabelText("Budget"), {
      target: { value: "$8k-$12k" },
    });
    fireEvent.change(screen.getByLabelText("Target timeline"), {
      target: { value: "4 weeks" },
    });
    fireEvent.change(screen.getByLabelText("Brief or meeting notes"), {
      target: { value: "Need a 5-page marketing site with CMS support." },
    });

    const submitButton = screen.getByRole("button", { name: "Extract scope" });
    fireEvent.submit(submitButton.closest("form") as HTMLFormElement);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        clientName: "Acme Studio",
        projectType: "Website redesign",
        serviceCategory: "Web design",
        rawBrief: "Need a 5-page marketing site with CMS support.",
        optionalBudget: "$8k-$12k",
        optionalTargetTimeline: "4 weeks",
      });
    });
  });
});
