import Link from "next/link";
import { listProposalProjects } from "@/lib/data/proposal-projects";

export default async function DashboardPage() {
  const projects = await listProposalProjects(process.env.NEXT_PUBLIC_DEMO_USER_ID!);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-12">
      <section className="flex flex-col gap-5 rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-slate-950/20 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-amber-300">ProposalCraft</p>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-50 md:text-4xl">Proposal dashboard</h1>
            <p className="max-w-2xl text-base leading-7 text-slate-300">
              Review active proposal drafts, jump back into structured scope edits, and create a new proposal from a messy brief.
            </p>
          </div>
        </div>
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-amber-400 px-5 py-3 text-base font-medium text-slate-950 transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-900"
          href="/proposals/new"
        >
          New proposal
        </Link>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-slate-100">Recent proposals</h2>
          <p className="text-sm text-slate-400">Derived from a single structured scope source</p>
        </div>

        {projects && projects.length > 0 ? (
          <div className="grid gap-4">
            {projects.map((project) => (
              <Link
                key={project.id}
                className="block rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700 hover:bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-950"
                href={`/proposals/${project.id}`}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <p className="text-base font-medium text-slate-50">{project.client_name}</p>
                    <p className="text-sm text-slate-400">{project.project_type}</p>
                  </div>
                  <div className="flex flex-col gap-1 text-sm text-slate-400 md:items-end">
                    <span className="inline-flex w-fit rounded-full bg-slate-800 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-300">
                      {project.status}
                    </span>
                    <span>Updated {project.updated_at ? new Date(project.updated_at).toLocaleDateString() : "Recently"}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-8">
            <p className="text-base font-medium text-slate-100">No proposals yet</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Start with a client brief, then extract structured scope before generating proposal, SOW, and quote drafts.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
