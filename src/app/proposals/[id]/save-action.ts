"use server";

import { upsertGeneratedDocument } from "@/lib/data/generated-documents";

export async function saveDocumentAction(
  proposalId: string,
  docType: "proposal" | "sow" | "quote",
  title: string,
  body: string,
) {
  try {
    await upsertGeneratedDocument({
      proposalProjectId: proposalId,
      documentType: docType,
      content: { title, body },
    });
  } catch (err) {
    console.error(`Autosave failed for ${docType}:`, err);
  }
}
