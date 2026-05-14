"use client";

import { useState } from "react";
import Link from "next/link";
import { markdownToHtml } from "@/lib/markdown/render";
import { useLoading } from "@/components/loading-bar";

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
  const [downloading, setDownloading] = useState(false);
  const loading = useLoading();

  const docs: Record<DocTab, Doc> = { proposal, sow, quote };
  const active = docs[tab];

  const handleDownload = async () => {
    loading.start();
    setDownloading(true);
    try {
      const res = await fetch(`/export/${proposalId}/download`);
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `proposal-${proposalId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download failed:", err);
    } finally {
      loading.done();
      setDownloading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12">
      {/* Header */}
      <section className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.12em] text-amber-500 mb-2">Export preview</p>
        <h1 className="font-display text-3xl font-medium text-slate-900 mb-3">Ready to share</h1>
        <p className="text-sm text-slate-500">
          Review each document, then download the PDF when you&apos;re ready to share it with your client.
        </p>
      </section>

      {/* Client info */}
      <div className="mb-8 flex items-center gap-12 rounded-xl border border-slate-200 bg-white px-8 py-5">
        <div>
          <p className="text-xs uppercase tracking-[0.06em] text-slate-500 mb-1">Client</p>
          <p className="font-medium text-slate-800">{clientName}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.06em] text-slate-500 mb-1">Proposal ID</p>
          <p className="font-mono text-sm text-slate-600">{proposalId}</p>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="mb-6">
        <div className="inline-flex rounded-lg bg-slate-200 p-0.5">
          {(["proposal", "sow", "quote"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
                tab === t
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Document preview */}
      <div className="rounded-xl border border-slate-200 bg-white p-10 mb-8">
        <h2 className="font-display text-2xl font-medium text-slate-900 mb-6">{active.title}</h2>
        <div className="prose prose-slate max-w-none text-sm leading-relaxed">{markdownToHtml(active.body)}</div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-amber-400 px-6 py-3 text-sm font-medium text-white transition hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={downloading}
          onClick={handleDownload}
        >
          {downloading ? "Generating PDF..." : "Download PDF"}
        </button>
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-800"
          href={`/proposals/${proposalId}`}
        >
          Back to workspace
        </Link>
      </div>
    </main>
  );
}
