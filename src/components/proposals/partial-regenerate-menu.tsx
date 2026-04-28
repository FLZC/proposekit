"use client";

import type { DocumentSection } from "@/lib/proposals/document-sections";

const options: Array<{ section: DocumentSection; label: string }> = [
  { section: "deliverables", label: "Regenerate deliverables" },
  { section: "timeline", label: "Regenerate timeline" },
  { section: "pricing", label: "Regenerate pricing" },
  { section: "assumptions_exclusions", label: "Regenerate assumptions / exclusions" },
];

export function PartialRegenerateMenu({ onSelect }: { onSelect: (section: DocumentSection) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.section}
          type="button"
          className="min-h-11 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-700"
          onClick={() => onSelect(option.section)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
