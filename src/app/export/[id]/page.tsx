import Link from "next/link";
import { generateStaticDocumentDrafts } from "@/lib/ai/generate-documents";
import { getProposalProjectById } from "@/lib/data/proposal-projects";
import { ExportPreviewClient } from "./export-preview-client";

export default async function ExportPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProposalProjectById(id);

  if (!project) {
    throw new Error(`Proposal project not found: ${id}`);
  }

  const drafts = generateStaticDocumentDrafts(
    project.structured_scope,
    undefined,
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
