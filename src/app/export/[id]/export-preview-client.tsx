"use client";

import { useState } from "react";
import Link from "next/link";
import { markdownToHtml } from "@/lib/markdown/render";

type DocTab = "proposal" | "sow" | "quote";

type Doc = {
  title: string;
  body: string;
};

export function ExportPreviewClient({
  proposalId,
  clientName,
  proposal,
  sow,
  quote,
}: {
  proposalId: string;
  clientName: string;
  proposal: Doc;
  sow: Doc;
  quote: Doc;
}) {
  const [tab, setTab] = useState<DocTab>("proposal");

  const docs: Record<DocTab, Doc> = { proposal, sow, quote };
  const active = docs[tab];

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-12">
      <section className="space-y-3 rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-slate-950/20">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-amber-300">Proposal export preview</p>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-50">Ready to export your proposal package</h1>
          <p className="max-w-3xl text-base leading-7 text-slate-400">
            Review each document, then download the PDF when you are ready to share it with your client.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-slate-950/20">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-wide text-slate-400">Client</p>
              <p className="text-lg font-medium text-slate-50">{clientName}</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-slate-400">Proposal ID</p>
              <p className="text-lg font-medium text-slate-50">{proposalId}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {(["proposal", "sow", "quote"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`min-h-10 rounded-xl px-4 py-2 text-sm font-medium transition ${
                  tab === t
                    ? "bg-slate-100 text-slate-950"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
            <h2 className="mb-4 text-xl font-semibold text-slate-50">{active.title}</h2>
            <div className="prose prose-invert max-w-none">{markdownToHtml(active.body)}</div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-amber-400 px-5 py-3 text-base font-medium text-slate-950 transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-900"
              href={`/export/${proposalId}/download`}
            >
              Download PDF
            </Link>
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-base font-medium text-slate-50 transition hover:border-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-900"
              href={`/proposals/${proposalId}`}
            >
              Back to workspace
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
