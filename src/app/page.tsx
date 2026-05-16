import Image from "next/image";
import { LoadingLink } from "@/components/loading-link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Copilot for Agency Proposals — From Brief to Proposal in Minutes",
  description:
    "Paste a client brief and let AI extract a structured scope, then generate polished proposals, SOWs, and quotes. Built for 2-10 person web and design agencies.",
  other: {
    "msvalidate.01": "BD2990505EBFF5706C934F8616129E5C",
  },
};

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <div className="inline-block rounded-full bg-amber-100 px-4 py-1.5 text-xs font-medium tracking-[0.08em] uppercase text-amber-500 mb-6 animate-fade-up">
          AI Copilot for Agency Proposals
        </div>
        <h1 className="font-display text-5xl md:text-6xl font-medium leading-[1.1] text-slate-900 mb-6 animate-fade-up animate-delay-100">
          Turn messy briefs into{" "}
          <em className="italic text-amber-400">client-ready</em>{" "}
          proposals, SOWs &amp; quotes
        </h1>
        <p className="mx-auto max-w-xl text-lg leading-relaxed text-slate-500 mb-8 animate-fade-up animate-delay-200">
          Paste a client brief. Get a structured scope, polished proposal, SOW, and pricing — all from a single source of truth. No more starting from scratch.
        </p>
        <div className="flex items-center justify-center gap-4 animate-fade-up animate-delay-300">
          <LoadingLink
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-slate-50 transition hover:bg-slate-700"
            href="/proposals/new"
          >
            Try the workspace →
          </LoadingLink>
        </div>
      </section>

      {/* Feature strip */}
      <section id="features" className="mx-auto max-w-4xl border-t border-slate-200 px-6 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center animate-fade-up">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-lg bg-amber-100 text-lg">
              📋
            </div>
            <h3 className="font-display text-lg font-semibold text-slate-900 mb-2">Paste any brief</h3>
            <p className="text-sm leading-relaxed text-slate-500">
              Email threads, meeting notes, napkin sketches — drop them in and let AI extract the structure.
            </p>
          </div>
          <div className="text-center animate-fade-up animate-delay-100">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-lg bg-sage-100 text-lg">
              ◎
            </div>
            <h3 className="font-display text-lg font-semibold text-slate-900 mb-2">One source of truth</h3>
            <p className="text-sm leading-relaxed text-slate-500">
              Structured Scope drives everything. Proposal, SOW, and quote always stay in sync.
            </p>
          </div>
          <div className="text-center animate-fade-up animate-delay-200">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-lg bg-amber-100 text-lg">
              ↗
            </div>
            <h3 className="font-display text-lg font-semibold text-slate-900 mb-2">Export &amp; send</h3>
            <p className="text-sm leading-relaxed text-slate-500">
              PDF, copy, or share. From brief to sendable proposal package in about 10 minutes.
            </p>
          </div>
        </div>
      </section>

      {/* Templates */}
      <section className="mx-auto max-w-4xl border-t border-slate-200 px-6 py-16">
        <h2 className="mb-6 text-center font-display text-2xl font-medium text-slate-900">
          Built for your workflow
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {["Web Design", "Website Development", "Landing Pages", "Branding Packages", "Monthly Retainers"].map(
            (t) => (
              <span
                key={t}
                className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm text-slate-600"
              >
                {t}
              </span>
            ),
          )}
        </div>
      </section>

    </main>
  );
}
