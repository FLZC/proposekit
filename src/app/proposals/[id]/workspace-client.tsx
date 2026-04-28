"use client";

import { useMemo, useState } from "react";
import { DocumentEditor } from "@/components/proposals/document-editor";
import { DocumentTabs } from "@/components/proposals/document-tabs";
import { ExportButton } from "@/components/proposals/export-button";
import { PartialRegenerateMenu } from "@/components/proposals/partial-regenerate-menu";
import { ScopePanel } from "@/components/proposals/scope-panel";
import { generateStaticDocumentDrafts } from "@/lib/ai/generate-documents";
import { getScopeRiskTags } from "@/lib/proposals/risk-tags";
import type { StructuredScope } from "@/lib/proposals/types";
import type { Template } from "@/lib/templates/types";

type Tab = "proposal" | "sow" | "quote";

type DocumentState = {
  proposal: string;
  sow: string;
  quote: string;
};

const SECTION_PATTERNS: Record<Tab, Record<string, RegExp>> = {
  proposal: {
    deliverables: /\*\*In Scope:\*\*\n([\s\S]*?)(?=\n\*\*)/g,
    timeline: /Estimated duration:[^\n]*/g,
    pricing: /(\*\*Budget:\*\*[^\n]*|\*\*Payment Notes:\*\*[^\n]*)/g,
    assumptions_exclusions: /(\*\*Assumptions:\*\*\n([\s\S]*?)(?=\n\n\*\*Exclusions)|\*\*Exclusions:\*\*\n([\s\S]*?)(?=\n\n##))/g,
  },
  sow: {
    deliverables: /\*\*In Scope:\*\*\n([\s\S]*?)(?=\n\*\*Phase)/g,
    timeline: /\*\*Overall Timeline:\*\*[^\n]*/g,
    pricing: /(\*\*Payment:\*\*[^\n]*|\*\*Explicitly Excluded:\*\*\n([\s\S]*?)(?=\nAdditionally))/g,
    assumptions_exclusions: /(\*\*Out of Scope\*\*\n([\s\S]*?)(?=\n\n## Deliverables)|\*\*Assumptions:\*\*\n([\s\S]*?)(?=\n\n\*\*Client Dependencies))/g,
  },
  quote: {
    deliverables: /\*\*Best for[^\n]*/g,
    timeline: /\*\*Payment Schedule:\*\*[^\n]*/g,
    pricing: /(\$\d[\d,]*[^\n]*|\*\*[^*]+\*\*\s*\$[\d,]+[^\n]*)/g,
    assumptions_exclusions: /features:\n([\s\S]*?)(?=\n\n\*\*Payment)/g,
  },
};

const SECTION_LABELS: Record<string, string> = {
  deliverables: "Deliverables",
  timeline: "Timeline",
  pricing: "Pricing",
  assumptions_exclusions: "Assumptions / Exclusions",
};

function regenerateDocument(current: string, tab: Tab, section: string) {
  const pattern = SECTION_PATTERNS[tab]?.[section];
  if (pattern) {
    const label = SECTION_LABELS[section] ?? section;
    const replacement =
      tab === "sow" && section === "pricing"
        ? "Excluded: [Updated — regenerate to refine]"
        : tab === "quote" && section === "pricing"
          ? "Pricing model: [Updated — regenerate to refine]\nDetails: [Updated — regenerate to refine]"
          : `${label}: [Updated — regenerate to refine]`;

    return current.replace(pattern, replacement);
  }

  return `${current}\n\n[Regenerated ${section}]`;
}

export function ProposalWorkspaceClient({ proposalId, scope, template }: { proposalId: string; scope: StructuredScope; template?: Template }) {
  const drafts = useMemo(() => generateStaticDocumentDrafts(scope, template), [scope, template]);
  const riskTags = useMemo(() => getScopeRiskTags(scope), [scope]);
  const hasAi = !scope.extractionNotes?.includes("without AI");
  const [active, setActive] = useState<Tab>("proposal");
  const [documents, setDocuments] = useState<DocumentState>({
    proposal: drafts.proposal.body,
    sow: drafts.sow.body,
    quote: drafts.quote.body,
  });

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl gap-6 px-6 py-12 lg:grid-cols-[320px_1fr]">
      <ScopePanel scope={scope} riskTags={riskTags} />

      <section className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl shadow-slate-950/20">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-amber-300">Proposal workspace</p>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-50">Light editing with section regeneration</h1>
            <p className="max-w-3xl text-sm leading-6 text-slate-300">
              Keep the structured scope canonical, make small wording edits in-place, and regenerate only the section you want to refresh.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
          <DocumentTabs active={active} onChange={setActive} />
          <ExportButton proposalId={proposalId} />
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
          {hasAi && (
            <PartialRegenerateMenu
              onSelect={(section) => {
                setDocuments((current) => ({
                  ...current,
                  [active]: regenerateDocument(current[active], active, section),
                }));
              }}
            />
          )}
          <DocumentEditor content={documents[active]} onChange={(value) => setDocuments((current) => ({ ...current, [active]: value }))} />
        </div>
      </section>
    </main>
  );
}
