import { redirect } from "next/navigation";
import { BriefIntakeForm } from "@/components/proposals/brief-intake-form";
import { extractStructuredScope } from "@/lib/ai/extract-structured-scope";
import { createProposalProject } from "@/lib/data/proposal-projects";
import { getCurrentUser } from "@/lib/supabase/server";

export default async function NewProposalPage() {
  const user = await getCurrentUser();
  const userId = user?.id ?? process.env.NEXT_PUBLIC_DEMO_USER_ID ?? "00000000-0000-0000-0000-000000000001";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-12">
      <section className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-amber-300">New proposal</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-50 md:text-4xl">Create New Proposal</h1>
        <p className="max-w-2xl text-base leading-7 text-slate-400">
          Turn a messy client brief into a structured proposal workspace.
        </p>
        <p className="max-w-3xl text-sm leading-6 text-slate-400">
          Paste project notes, email threads, or a rough project description. ProposeKit automatically extracts a clean structured scope, then generates polished Proposal, SOW, and Quote documents.
        </p>
      </section>

      <BriefIntakeForm
        onSubmit={async (payload) => {
          "use server";
          const scope = await extractStructuredScope({
            rawBrief: payload.rawBrief,
            optionalBudget: payload.optionalBudget,
            optionalTargetTimeline: payload.optionalTargetTimeline,
            templateId: payload.templateId,
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
      <p className="mt-4 text-xs leading-relaxed text-slate-500">
        Disclaimer: Proposals, SOWs, and quotes are AI-assisted draft documents. Always review and customize before sharing with clients. Content does not constitute legal or professional advice. Pricing and timelines are illustrative estimates only.
      </p>
    </main>
  );
}
