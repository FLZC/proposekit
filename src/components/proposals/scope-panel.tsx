import type { StructuredScope } from "@/lib/proposals/types";
import { RiskTagList } from "./risk-tag-list";

export function ScopePanel({ scope, riskTags }: { scope: StructuredScope; riskTags: string[] }) {
  const isFallback = scope.extractionNotes?.includes("without AI");

  return (
    <aside className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl shadow-slate-950/20">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-amber-300">Structured scope</p>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${isFallback ? "bg-amber-400/15 text-amber-300" : "bg-emerald-400/15 text-emerald-300"}`}>
            {isFallback ? "No AI available" : "AI extracted"}
          </span>
        </div>
        {isFallback && (
          <p className="text-xs leading-relaxed text-amber-300/70">
            AI API key not configured. Scope extracted from your brief using basic rules. For best results, add an API key.
          </p>
        )}
        <RiskTagList tags={riskTags} />
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-medium text-slate-100">Deliverables</h2>
        <ul className="space-y-2 pl-5 text-sm leading-6 text-slate-300">
          {scope.deliverables.length > 0 ? (
            scope.deliverables.map((item) => (
              <li key={item} className="list-disc">
                {item}
              </li>
            ))
          ) : (
            <li className="list-none text-slate-500 italic">No deliverables extracted</li>
          )}
        </ul>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-medium text-slate-100">Timeline</h2>
        <p className="text-sm text-slate-300">{scope.timeline || <span className="italic text-slate-500">Not set</span>}</p>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-medium text-slate-100">Assumptions</h2>
        <p className="text-sm text-slate-300">
          {scope.assumptions.length > 0 ? scope.assumptions.join(", ") : <span className="italic text-slate-500">No assumptions listed</span>}
        </p>
      </div>

      {scope.exclusions.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-slate-100">Exclusions</h2>
          <p className="text-sm text-slate-300">{scope.exclusions.join(", ")}</p>
        </div>
      )}

      {scope.pricingNotes && (
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-slate-100">Pricing</h2>
          <p className="text-sm capitalize text-slate-300">{scope.pricingModel.replace(/_/g, " ")}</p>
          <p className="text-sm text-slate-400">{scope.pricingNotes}</p>
        </div>
      )}

      {scope.milestones.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-slate-100">Milestones</h2>
          <ul className="space-y-1 pl-5 text-sm leading-6 text-slate-300">
            {scope.milestones.map((m) => (
              <li key={m} className="list-disc">
                {m}
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
