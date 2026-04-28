import React from "react";
import { NextResponse } from "next/server";
import { Document, Page, Text, View, renderToBuffer } from "@react-pdf/renderer";
import { generateStaticDocumentDrafts } from "@/lib/ai/generate-documents";
import { getProposalProjectById } from "@/lib/data/proposal-projects";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProposalProjectById(id);

  if (!project) {
    return new NextResponse("Not found", { status: 404 });
  }

  const drafts = generateStaticDocumentDrafts(project.structured_scope);
  const buffer = await renderToBuffer(
    React.createElement(
      Document,
      null,
      React.createElement(
        Page,
        { size: "A4", style: { padding: 32 } },
        React.createElement(
          View,
          null,
          React.createElement(Text, null, "ProposalCraft Export"),
          React.createElement(Text, null, `Client: ${project.client_name}`),
          React.createElement(Text, null, `Proposal ID: ${project.id}`),
          React.createElement(Text, null, drafts.proposal.body),
          React.createElement(Text, null, drafts.sow.body),
          React.createElement(Text, null, drafts.quote.body),
        ),
      ),
    ),
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="proposal-${project.id}.pdf"`,
    },
  });
}
