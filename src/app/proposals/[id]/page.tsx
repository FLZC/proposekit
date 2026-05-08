import { notFound, redirect } from "next/navigation";
import { getProposalProjectById } from "@/lib/data/proposal-projects";
import { pickTemplate, generatePolishedDocuments } from "@/lib/ai/generate-documents";
import { getCurrentUser } from "@/lib/supabase/server";
import { ProposalWorkspaceClient } from "./workspace-client";

function hasSupabaseConfig() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export default async function ProposalWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (hasSupabaseConfig()) {
    const user = await getCurrentUser();
    if (!user) redirect("/auth/login");
  }

  const project = await getProposalProjectById(id);

  if (!project) {
    notFound();
  }

  const template = pickTemplate(project.project_type, project.service_category);
  const drafts = await generatePolishedDocuments(
    project.structured_scope,
    template,
    project.client_name,
    project.project_type,
  );

  return <ProposalWorkspaceClient proposalId={project.id} scope={project.structured_scope} drafts={drafts} template={template} />;
}
