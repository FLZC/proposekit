import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function upsertGeneratedDocument(input: {
  proposalProjectId: string;
  documentType: "proposal" | "sow" | "quote";
  content: unknown;
}) {
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
