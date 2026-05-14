import Link from "next/link";
import { listProposalProjects } from "@/lib/data/proposal-projects";
import { getCurrentUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  const projects = await listProposalProjects(user.id);

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-medium text-slate-900">Your proposals</h1>
          <p className="mt-1 text-sm text-slate-500">
            Review active drafts, jump back into scope edits, or create a new proposal.
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="text-slate-500">Active <strong className="text-slate-800">{projects.length}</strong></div>
          <Link
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-slate-50 transition hover:bg-slate-700"
            href="/proposals/new"
          >
            + New proposal
          </Link>
        </div>
      </div>

      {/* Proposals table */}
      {projects.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-[0.06em] text-slate-500">Proposal</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-[0.06em] text-slate-500">Updated</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-slate-100 transition hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <Link href={`/proposals/${project.id}`} className="block">
                      <div className="font-medium text-slate-800">{project.client_name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{project.project_type}</div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {project.updated_at ? new Date(project.updated_at).toLocaleDateString() : "Recently"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 p-12 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-amber-100 text-lg">◎</div>
          <p className="font-display text-xl font-medium text-slate-800 mb-2">No proposals yet</p>
          <p className="max-w-md mx-auto text-sm text-slate-500 mb-6">
            Start with a client brief, then extract structured scope before generating proposal, SOW, and quote drafts.
          </p>
          <Link
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-slate-50 transition hover:bg-slate-700"
            href="/proposals/new"
          >
            New proposal
          </Link>
        </div>
      )}

    </main>
  );
}
