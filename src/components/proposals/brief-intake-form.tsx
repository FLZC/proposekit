"use client";

import { useState, useTransition } from "react";

const TEMPLATES = [
  { value: "web_design", label: "Web Design" },
  { value: "landing_page", label: "Landing Page" },
  { value: "branding_package", label: "Branding" },
  { value: "monthly_retainer", label: "Website Retainer" },
  { value: "website_development", label: "Development" },
];

type Props = {
  onSubmit: (payload: {
    clientName: string;
    templateId: string;
    rawBrief: string;
    optionalBudget: string;
    optionalTargetTimeline: string;
  }) => Promise<void>;
};

export function BriefIntakeForm({ onSubmit }: Props) {
  const [form, setForm] = useState({
    clientName: "",
    templateId: "web_design",
    rawBrief: "",
    optionalBudget: "",
    optionalTargetTimeline: "",
  });
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="grid gap-5 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-slate-950/20"
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(async () => {
          await onSubmit({
            ...form,
          });
        });
      }}
    >
      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-50" htmlFor="clientName">
          Client name
        </label>
        <input
          id="clientName"
          className="min-h-11 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-slate-50 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300/30"
          placeholder="e.g. Acme Studio"
          required
          value={form.clientName}
          onChange={(event) => setForm({ ...form, clientName: event.target.value })}
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-50" htmlFor="templateId">Project type</label>
        <select
          id="templateId"
          className="min-h-11 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-slate-50 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300/30"
          value={form.templateId}
          onChange={(event) => setForm({ ...form, templateId: event.target.value })}
        >
          {TEMPLATES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-50" htmlFor="optionalBudget">
            Budget (USD)
          </label>
          <select
            id="optionalBudget"
            className="min-h-11 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-slate-50 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300/30"
            value={form.optionalBudget}
            onChange={(event) => setForm({ ...form, optionalBudget: event.target.value })}
          >
            <option value="">Not specified yet</option>
            <option value="$1,000 – $3,000">$1,000 – $3,000</option>
            <option value="$3,000 – $5,000">$3,000 – $5,000</option>
            <option value="$5,000 – $10,000">$5,000 – $10,000</option>
            <option value="$10,000 – $20,000">$10,000 – $20,000</option>
            <option value="$20,000 – $50,000">$20,000 – $50,000</option>
            <option value="$50,000+">$50,000+</option>
          </select>
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-50" htmlFor="optionalTargetTimeline">
            Timeline
          </label>
          <select
            id="optionalTargetTimeline"
            className="min-h-11 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-slate-50 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300/30"
            value={form.optionalTargetTimeline}
            onChange={(event) => setForm({ ...form, optionalTargetTimeline: event.target.value })}
          >
            <option value="">Not specified yet</option>
            <option value="2 weeks">2 weeks</option>
            <option value="4 weeks">4 weeks</option>
            <option value="6 weeks">6 weeks</option>
            <option value="8 weeks">8 weeks</option>
            <option value="3 months">3 months</option>
            <option value="6 months">6 months</option>
            <option value="ongoing">Ongoing / monthly</option>
          </select>
        </div>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-50" htmlFor="rawBrief">
          Brief or meeting notes
        </label>
        <textarea
          id="rawBrief"
          className="min-h-48 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-slate-50 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300/30"
          placeholder="Paste client brief, meeting notes, or email correspondence."
          required
          value={form.rawBrief}
          onChange={(event) => setForm({ ...form, rawBrief: event.target.value })}
        />
        <p className="text-sm text-slate-400">
          We&apos;ll extract a structured scope, flag missing details, and generate ready-to-send proposal drafts.
        </p>
      </div>

      <button
        className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-amber-400 px-4 py-3 text-base font-medium text-slate-950 transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60 md:w-fit"
        type="submit"
        disabled={isPending || !form.clientName.trim() || !form.rawBrief.trim()}
      >
        {isPending ? "Extracting Scope..." : "Extract Scope"}
      </button>
    </form>
  );
}
