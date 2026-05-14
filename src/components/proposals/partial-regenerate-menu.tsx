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
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-800"
          onClick={() => onSelect(option.section)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
