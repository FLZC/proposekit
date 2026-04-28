import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DocumentEditor } from "@/components/proposals/document-editor";

describe("DocumentEditor", () => {
  it("renders a light editor textarea", () => {
    render(<DocumentEditor content="Hello scope" onChange={() => {}} />);
    expect(screen.getByDisplayValue("Hello scope")).toBeInTheDocument();
  });
});
