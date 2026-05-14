import { redirect } from "next/navigation";
import { BriefIntakeForm } from "@/components/proposals/brief-intake-form";
import { extractStructuredScope } from "@/lib/ai/extract-structured-scope";
import { createProposalProject } from "@/lib/data/proposal-projects";
import { getCurrentUser } from "@/lib/supabase/server";

export default async function NewProposalPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login?next=/proposals/new");
  const userId = user.id;

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.12em] text-amber-500 mb-2">New proposal</p>
        <h1 className="font-display text-3xl font-medium text-slate-900 mb-3">Create New Proposal</h1>
        <p className="text-sm leading-relaxed text-slate-500">
          Paste project notes, email threads, or a rough project description. We&apos;ll extract a clean structured scope, then generate polished Proposal, SOW, and Quote documents.
        </p>
      </div>

      <BriefIntakeForm
        onSubmit={async (payload) => {
          "use server";
          const scope = await extractStructuredScope({
            rawBrief: payload.rawBrief,
            optionalBudget: payload.optionalBudget,
            optionalTargetTimeline: payload.optionalTargetTimeline,
            templateId: payload.templateId,
            userId,
          });
          const project = await createProposalProject({
            userId,
            clientName: payload.clientName,
            projectType: payload.templateId,
            serviceCategory: payload.templateId,
            rawBrief: payload.rawBrief,
            structuredScope: {
              ...scope,
              optionalBudget: payload.optionalBudget,
              optionalTargetTimeline: payload.optionalTargetTimeline,
            },
          });
          redirect(`/proposals/${project.id}`);
        }}
      />
    </main>
  );
}
