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

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-5 py-4">
        <h3 className="font-display text-lg font-semibold text-slate-900">Structured Scope</h3>
        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.04em] text-amber-600">
          AI extracted
        </span>
      </div>

      {/* Risk tags */}
      {riskTags.length > 0 && (
        <div className="shrink-0 px-5 pb-3">
          <RiskTagList tags={riskTags} />
        </div>
      )}

      {/* Sections */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
        <Section title="Deliverables">
          {dels && dels.length > 0 ? (
            <ul className="space-y-1.5">
              {dels.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
                  <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-amber-400" />
                  <span className="break-words">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm italic text-slate-400">Not specified</p>
          )}
        </Section>

        <Section title="Assumptions">
          {scope.assumptions.length > 0 ? (
            <ul className="space-y-1.5">
              {scope.assumptions.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
                  <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-slate-400" />
                  <span className="break-words">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm italic text-slate-400">Standard assumptions apply</p>
          )}
        </Section>

        {scope.exclusions.length > 0 && (
          <Section title="Exclusions" warning={scope.exclusions.length === 1 && scope.exclusions[0].length < 30 ? "Vague" : undefined}>
            <ul className="space-y-1.5">
              {scope.exclusions.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
                  <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-slate-400" />
                  <span className="break-words">{item}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        <Section title="Timeline" warning={!scope.timeline ? "Missing" : undefined}>
          <p className="text-sm text-slate-600">{scope.timeline || <span className="italic text-slate-400">Not set</span>}</p>
        </Section>

        <Section title="Pricing" warning={!scope.pricingModel ? "Unclear" : undefined}>
          <p className="text-sm capitalize text-slate-600">{scope.pricingModel ? scope.pricingModel.replace(/_/g, " ") : <span className="italic text-slate-400">Not specified</span>}</p>
          {scope.pricingNotes && <p className="mt-1 text-sm text-slate-500">{scope.pricingNotes}</p>}
        </Section>

        {scope.milestones.length > 0 && (
          <Section title="Milestones">
            <ul className="space-y-1.5 pl-4">
              {scope.milestones.map((m) => (
                <li key={m} className="text-sm text-slate-600 list-disc">{m}</li>
              ))}
            </ul>
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, warning, children }: { title: string; warning?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3.5">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">{title}</h4>
        {warning && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-600">
            {warning}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
