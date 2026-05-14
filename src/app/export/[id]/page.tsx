import { notFound } from "next/navigation";
import { generateStaticDocumentDrafts, pickTemplate } from "@/lib/ai/generate-documents";
import { getProposalProjectById } from "@/lib/data/proposal-projects";
import { getGeneratedDocuments } from "@/lib/data/generated-documents";
import { ExportPreviewClient } from "./export-preview-client";

export default async function ExportPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProposalProjectById(id);

  if (!project) {
    notFound();
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

  return (
    <ExportPreviewClient
      proposalId={project.id}
      clientName={project.client_name}
      proposal={drafts.proposal}
      sow={drafts.sow}
      quote={drafts.quote}
    />
  );
}
