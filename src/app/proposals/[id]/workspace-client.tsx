"use client";

import { useMemo, useState } from "react";
import { DocumentEditor } from "@/components/proposals/document-editor";
import { DocumentTabs } from "@/components/proposals/document-tabs";
import { ExportButton } from "@/components/proposals/export-button";
import { ScopePanel } from "@/components/proposals/scope-panel";
import { getScopeRiskTags } from "@/lib/proposals/risk-tags";
import type { StructuredScope } from "@/lib/proposals/types";
import type { Template } from "@/lib/templates/types";

type Tab = "proposal" | "sow" | "quote";

type DraftSet = {
  proposal: { title: string; body: string };
  sow: { title: string; body: string };
  quote: { title: string; body: string };
};

type DocumentState = {
  proposal: string;
  sow: string;
  quote: string;
};

export function ProposalWorkspaceClient({ proposalId, scope, drafts, template }: { proposalId: string; scope: StructuredScope; drafts: DraftSet; template?: Template }) {
  const riskTags = useMemo(() => getScopeRiskTags(scope), [scope]);
  const [active, setActive] = useState<Tab>("proposal");
  const [documents, setDocuments] = useState<DocumentState>({
    proposal: drafts.proposal.body,
    sow: drafts.sow.body,
    quote: drafts.quote.body,
  });

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl gap-6 px-6 py-12 lg:grid-cols-[320px_1fr]">
      <ScopePanel scope={scope} riskTags={riskTags} category={template?.category} />

      <section className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl shadow-slate-950/20">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-amber-300">Proposal workspace</p>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-50">Light editing with section regeneration</h1>
            <p className="max-w-3xl text-sm leading-6 text-slate-400">
              Keep the structured scope canonical, make small wording edits in-place, and regenerate only the section you want to refresh.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
          <DocumentTabs active={active} onChange={setActive} />
          <ExportButton proposalId={proposalId} />
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
          <DocumentEditor content={documents[active]} onChange={(value) => setDocuments((current) => ({ ...current, [active]: value }))} />
        </div>
      </section>
    </main>
  );
}
