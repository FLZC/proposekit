import type { StructuredScope } from "@/lib/proposals/types";
import { RiskTagList } from "./risk-tag-list";

const FALLBACK: Record<string, string[]> = {
  "web design": ["Website redesign", "UI/UX design", "Responsive layouts", "Design system"],
  "web development": ["Custom website", "CMS integration", "Responsive frontend", "Backend API"],
  "landing page": ["Landing page design", "Mobile responsive", "Form + analytics"],
  branding: ["Logo suite", "Color palette", "Typography", "Brand guidelines"],
  "monthly retainer": ["Maintenance & updates", "Security monitoring", "Performance optimization", "Content updates"],
};

export function ScopePanel({ scope, riskTags, category }: { scope: StructuredScope; riskTags: string[]; category?: string }) {
  const defs = category ? FALLBACK[category] : undefined;
  const dels = scope.deliverables.length > 0 ? scope.deliverables : defs;
  const isFallback = scope.extractionNotes?.includes("without AI");
  const showBadge = scope.extractionNotes != null;
  const badgeLabel = isFallback ? "No AI available" : "AI extracted";
  const badgeStyle = isFallback
    ? "bg-amber-400/15 text-amber-300"
    : "bg-emerald-400/15 text-emerald-300";

  return (
    <aside className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl shadow-slate-950/20">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-amber-300">Structured scope</p>
          {showBadge && (
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${badgeStyle}`}>
              {badgeLabel}
            </span>
          )}
        </div>
        {isFallback && (
          <p className="text-xs leading-relaxed text-amber-300/70">
            AI API key not configured. Scope extracted from your brief using basic rules. For best results, add an API key.
          </p>
        )}
        <RiskTagList tags={riskTags} />
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-medium text-slate-50">Deliverables</h2>
        <ul className="space-y-2 pl-5 text-sm leading-6 text-slate-400">
          {dels ? (
            dels.map((item) => (
              <li key={item} className="list-disc">
                {item}
              </li>
            ))
          ) : (
            <li className="list-none italic text-slate-500">Not specified</li>
          )}
        </ul>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-medium text-slate-50">Timeline</h2>
        <p className="text-sm text-slate-400">{scope.timeline || <span className="italic text-slate-500">Not set</span>}</p>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-medium text-slate-50">Assumptions</h2>
        <p className="text-sm text-slate-400">
          {scope.assumptions.length > 0 ? scope.assumptions.join(", ") : <span className="italic text-slate-500">Standard assumptions apply</span>}
        </p>
      </div>

      {scope.exclusions.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-slate-50">Exclusions</h2>
          <p className="text-sm text-slate-400">{scope.exclusions.join(", ")}</p>
        </div>
      )}

      {scope.pricingNotes && (
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-slate-50">Pricing</h2>
          <p className="text-sm capitalize text-slate-400">{scope.pricingModel.replace(/_/g, " ")}</p>
          <p className="text-sm text-slate-400">{scope.pricingNotes}</p>
        </div>
      )}

      {scope.milestones.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-slate-50">Milestones</h2>
          <ul className="space-y-1 pl-5 text-sm leading-6 text-slate-400">
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
