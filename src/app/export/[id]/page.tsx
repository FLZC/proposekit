import Link from "next/link";
import { generateStaticDocumentDrafts } from "@/lib/ai/generate-documents";
import { getProposalProjectById } from "@/lib/data/proposal-projects";

export default async function ExportPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProposalProjectById(id);

  if (!project) {
    throw new Error(`Proposal project not found: ${id}`);
  }

  const drafts = generateStaticDocumentDrafts(project.structured_scope);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-12">
      <section className="space-y-3 rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-slate-950/20">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-amber-300">Proposal export preview</p>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-50">Ready to export your proposal package</h1>
          <p className="max-w-3xl text-base leading-7 text-slate-300">
            Review the generated proposal summary, then download the PDF version when you are ready to share it.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-slate-950/20">
        <div className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-400">Client</p>
            <p className="mt-1 text-lg font-medium text-slate-50">{project.client_name}</p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-400">Proposal ID</p>
            <p className="mt-1 text-lg font-medium text-slate-50">{project.id}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5 text-sm leading-7 text-slate-300">
            <p>{drafts.proposal.body}</p>
            <p className="mt-3">{drafts.sow.body}</p>
            <p className="mt-3">{drafts.quote.body}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-amber-400 px-5 py-3 text-base font-medium text-slate-950 transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-900"
              href={`/export/${project.id}/download`}
            >
              Download PDF
            </Link>
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-base font-medium text-slate-100 transition hover:border-slate-600 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-900"
              href={`/proposals/${project.id}`}
            >
              Back to workspace
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
