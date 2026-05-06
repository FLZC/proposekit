"use client";

import { useState, useTransition } from "react";

const TEMPLATES = [
  { value: "web_design", label: "Web Design" },
  { value: "website_development", label: "Website Development" },
  { value: "landing_page", label: "Landing Page" },
  { value: "branding_package", label: "Branding Package" },
  { value: "monthly_retainer", label: "Monthly Retainer" },
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
        <label className="text-sm font-medium text-slate-100" htmlFor="clientName">
          Client name
        </label>
        <input
          id="clientName"
          className="min-h-11 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-slate-50 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300/30"
          placeholder="Acme Studio"
          required
          value={form.clientName}
          onChange={(event) => setForm({ ...form, clientName: event.target.value })}
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-100" htmlFor="templateId">Project type</label>
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
          <label className="text-sm font-medium text-slate-100" htmlFor="optionalBudget">
            Budget
          </label>
          <input
            id="optionalBudget"
            className="min-h-11 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-slate-50 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300/30"
            placeholder="$8k-$12k"
            value={form.optionalBudget}
            onChange={(event) => setForm({ ...form, optionalBudget: event.target.value })}
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-100" htmlFor="optionalTargetTimeline">
            Target timeline
          </label>
          <input
            id="optionalTargetTimeline"
            className="min-h-11 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-slate-50 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300/30"
            placeholder="4 weeks"
            value={form.optionalTargetTimeline}
            onChange={(event) => setForm({ ...form, optionalTargetTimeline: event.target.value })}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-100" htmlFor="rawBrief">
          Brief or meeting notes
        </label>
        <textarea
          id="rawBrief"
          className="min-h-48 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-slate-50 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300/30"
          placeholder="Paste client brief, notes, or email thread"
          required
          value={form.rawBrief}
          onChange={(event) => setForm({ ...form, rawBrief: event.target.value })}
        />
        <p className="text-sm text-slate-400">
          We will extract a structured scope, highlight gaps, and generate proposal-ready drafts.
        </p>
      </div>

      <button
        className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-amber-400 px-4 py-3 text-base font-medium text-slate-950 transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60 md:w-fit"
        type="submit"
        disabled={isPending || !form.clientName.trim() || !form.rawBrief.trim()}
      >
        {isPending ? "Extracting scope..." : "Extract scope"}
      </button>
    </form>
  );
}
