import { notFound } from "next/navigation";
import { getProposalProjectById } from "@/lib/data/proposal-projects";
import { pickTemplate } from "@/lib/ai/generate-documents";
import { ProposalWorkspaceClient } from "./workspace-client";

export default async function ProposalWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProposalProjectById(id);

  if (!project) {
    notFound();
  }

  const template = pickTemplate(project.project_type, project.service_category);

  return <ProposalWorkspaceClient proposalId={project.id} scope={project.structured_scope} template={template} />;
}
