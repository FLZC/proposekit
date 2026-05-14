import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getProposalProjectById } from "./proposal-projects";

export async function getGeneratedDocuments(proposalProjectId: string) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("generated_documents")
    .select("document_type, content")
    .eq("proposal_project_id", proposalProjectId);

  if (error || !data) return null;

  const docs: Record<string, { title: string; body: string }> = {};
  for (const row of data) {
    const c = row.content as { title?: string; body?: string } | null;
    if (c?.body) {
      docs[row.document_type] = { title: c.title ?? "", body: c.body };
    }
  }
  return Object.keys(docs).length > 0 ? docs : null;
}

export async function upsertGeneratedDocument(input: {
  proposalProjectId: string;
  documentType: "proposal" | "sow" | "quote";
  content: unknown;
}) {
  // Verify the project exists and (via RLS) belongs to the current user
  const project = await getProposalProjectById(input.proposalProjectId);
  if (!project) throw new Error("Proposal project not found");

  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("generated_documents")
    .upsert(
      {
        proposal_project_id: input.proposalProjectId,
        document_type: input.documentType,
        content: input.content,
      },
      { onConflict: "proposal_project_id,document_type" },
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}
