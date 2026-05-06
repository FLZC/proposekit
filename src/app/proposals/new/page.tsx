import { redirect } from "next/navigation";
import { BriefIntakeForm } from "@/components/proposals/brief-intake-form";
import { extractStructuredScope } from "@/lib/ai/extract-structured-scope";
import { createProposalProject } from "@/lib/data/proposal-projects";
import { getCurrentUser } from "@/lib/supabase/server";

export default async function NewProposalPage() {
  const user = await getCurrentUser();
  const userId = user?.id ?? process.env.NEXT_PUBLIC_DEMO_USER_ID ?? "demo-user";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-12">
      <section className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-amber-300">New proposal</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-50 md:text-4xl">Turn a messy brief into a structured proposal workspace</h1>
        <p className="max-w-3xl text-base leading-7 text-slate-300">
          Paste notes, email threads, or a rough brief. ProposalCraft will extract a structured scope first, then generate aligned proposal, SOW, and quote outputs.
        </p>
      </section>

      <BriefIntakeForm
        onSubmit={async (payload) => {
          "use server";
          const scope = await extractStructuredScope(payload);
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
        Disclaimer: Generated proposals, SOWs, and quotes are AI-assisted drafts. Review carefully before sending to clients. Not legal advice. Pricing is illustrative.
      </p>
    </main>
  );
}
