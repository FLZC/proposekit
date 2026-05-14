"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DocumentEditor } from "@/components/proposals/document-editor";
import { DocumentTabs } from "@/components/proposals/document-tabs";
import { ScopePanel } from "@/components/proposals/scope-panel";
import { getScopeRiskTags } from "@/lib/proposals/risk-tags";
import { saveDocumentAction } from "./save-action";
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
  const router = useRouter();
  const riskTags = useMemo(() => getScopeRiskTags(scope), [scope]);
  const [active, setActive] = useState<Tab>("proposal");
  const [documents, setDocuments] = useState<DocumentState>({
    proposal: drafts.proposal.body,
    sow: drafts.sow.body,
    quote: drafts.quote.body,
  });
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const documentsRef = useRef(documents);
  documentsRef.current = documents;

  // Save all documents immediately
  const saveNow = useCallback(
    (docs: DocumentState) => {
      clearTimeout(saveTimer.current);
      for (const type of ["proposal", "sow", "quote"] as const) {
        saveDocumentAction(proposalId, type, drafts[type].title, docs[type]);
      }
    },
    [proposalId, drafts],
  );

  // Autosave when documents change (debounced 500ms)
  const saveDocuments = useCallback(
    (docs: DocumentState) => {
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => saveNow(docs), 500);
    },
    [saveNow],
  );

  const handleDocumentChange = useCallback(
    (value: string) => {
      setDocuments((current) => {
        const next = { ...current, [active]: value };
        saveDocuments(next);
        return next;
      });
    },
    [active, saveDocuments],
  );

  const handleExport = useCallback(async () => {
    setExporting(true);
    // Flush any pending autosave immediately, then navigate
    saveNow(documentsRef.current);
    router.push(`/export/${proposalId}`);
  }, [saveNow, router, proposalId]);

  // Flush save on unmount (tab close / navigation away)
  useEffect(() => {
    return () => {
      clearTimeout(saveTimer.current);
      saveNow(documentsRef.current);
    };
  }, [saveNow]);

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      {/* Two-column body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Structured Scope */}
        <aside className="w-[340px] shrink-0 border-r border-slate-200 bg-slate-50/80">
          <ScopePanel scope={scope} riskTags={riskTags} category={template?.category} />
        </aside>

        {/* Right: Document workspace */}
        <section className="flex flex-1 flex-col overflow-hidden bg-slate-50">
          {/* Toolbar */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-3">
            <DocumentTabs active={active} onChange={setActive} />
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex min-h-9 items-center rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
                onClick={async () => {
                  const text = `${drafts[active].title}\n\n${documents[active]}`;
                  await navigator.clipboard.writeText(text);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
              >
                {copied ? "✓ Copied" : "📋 Copy"}
              </button>
              <button
                type="button"
                disabled={exporting}
                onClick={handleExport}
                className="inline-flex min-h-9 items-center rounded-lg bg-amber-400 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-amber-500 disabled:opacity-60"
              >
                {exporting ? "Saving..." : "Export PDF ↗"}
              </button>
            </div>
          </div>

          {/* Document content */}
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-3xl px-10 py-10">
              {/* Letterhead */}
              <div className="mb-8 pb-6 border-b-2 border-slate-900">
                <div className="font-display text-xl font-semibold text-slate-900 mb-3">
                  Proposal<span className="text-amber-400">Craft</span>
                </div>
                <div className="text-sm text-slate-500 leading-relaxed">
                  {drafts[active].title && (
                    <p className="font-medium text-slate-700 mb-1">{drafts[active].title}</p>
                  )}
                  <p>Generated from structured scope · {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>

              {/* Editable document body */}
              <DocumentEditor content={documents[active]} onChange={handleDocumentChange} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
