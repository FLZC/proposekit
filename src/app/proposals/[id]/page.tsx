import { notFound, redirect } from "next/navigation";
import { getProposalProjectById } from "@/lib/data/proposal-projects";
import { getGeneratedDocuments, upsertGeneratedDocument } from "@/lib/data/generated-documents";
import { pickTemplate, generatePolishedDocuments } from "@/lib/ai/generate-documents";
import { getCurrentUser } from "@/lib/supabase/server";
import { ProposalWorkspaceClient } from "./workspace-client";

function hasSupabaseConfig() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export default async function ProposalWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let currentUserId: string | undefined;

  if (hasSupabaseConfig()) {
    const user = await getCurrentUser();
    if (!user) redirect("/auth/login");
    currentUserId = user.id;
  }

  const project = await getProposalProjectById(id);

  if (!project) {
    notFound();
  }

  // Verify ownership — only the project owner can access
  if (project.user_id && currentUserId && project.user_id !== currentUserId) {
    notFound();
  }

  const template = pickTemplate(project.project_type, project.service_category);

  // Use saved documents if available, otherwise generate and save
  const saved = await getGeneratedDocuments(project.id);
  let drafts: { proposal: { title: string; body: string }; sow: { title: string; body: string }; quote: { title: string; body: string } };
  if (saved) {
    drafts = {
      proposal: saved.proposal ?? { title: "", body: "" },
      sow: saved.sow ?? { title: "", body: "" },
      quote: saved.quote ?? { title: "", body: "" },
    };
  } else {
    drafts = await generatePolishedDocuments(
      project.structured_scope,
      template,
      project.client_name,
      project.project_type,
    );
    // Save initial drafts to DB
    for (const docType of ["proposal", "sow", "quote"] as const) {
      try {
        await upsertGeneratedDocument({
          proposalProjectId: project.id,
          documentType: docType,
          content: drafts[docType],
        });
      } catch (err) {
        console.error(`Failed to save ${docType}:`, err);
      }
    }
  }

  return <ProposalWorkspaceClient proposalId={project.id} scope={project.structured_scope} drafts={drafts} template={template} />;
}
