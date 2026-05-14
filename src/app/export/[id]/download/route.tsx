import { NextResponse } from "next/server";
import { generateStaticDocumentDrafts, pickTemplate } from "@/lib/ai/generate-documents";
import { getProposalProjectById } from "@/lib/data/proposal-projects";
import { getGeneratedDocuments } from "@/lib/data/generated-documents";
import { getCurrentUser } from "@/lib/supabase/server";
import { projectTypeLabel } from "@/lib/templates/render";
import { generatePdf } from "./pdf";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProposalProjectById(id);
  if (!project) return new NextResponse("Not found", { status: 404 });

  // Verify ownership — only the project owner can download
  const user = await getCurrentUser();
  if (project.user_id && (!user || project.user_id !== user.id)) {
    return new NextResponse("Not found", { status: 404 });
  }

  // Use saved documents if available, otherwise generate
  const saved = await getGeneratedDocuments(project.id);
  const drafts = saved
    ? {
        proposal: saved.proposal ?? { title: "", body: "" },
        sow: saved.sow ?? { title: "", body: "" },
        quote: saved.quote ?? { title: "", body: "" },
      }
    : generateStaticDocumentDrafts(
        project.structured_scope,
        pickTemplate(project.project_type, project.service_category),
        project.client_name,
        project.project_type,
      );

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const filename = (project.client_name ?? "project").replace(/[^a-zA-Z0-9]/g, "-");
  const client = project.client_name ?? "Client";
  const title = projectTypeLabel(project.project_type ?? "") || "Proposal";

  let buffer: Uint8Array;
  try {
    buffer = await generatePdf({
      client,
      title,
      today,
      proposalBody: drafts.proposal.body,
      sowBody: drafts.sow.body,
      quoteBody: drafts.quote.body,
    });
  } catch (err) {
    console.error("PDF generation failed:", err);
    return new NextResponse("PDF generation failed", { status: 500 });
  }

  return new NextResponse(Buffer.from(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="proposal-${filename}.pdf"`,
    },
  });
}
