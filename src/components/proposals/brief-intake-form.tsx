"use client";

import { useState, useTransition } from "react";
import { useLoading } from "@/components/loading-bar";

const TEMPLATES = [
  { value: "web_design", label: "Web Design" },
  { value: "website_development", label: "Website Development" },
  { value: "landing_page", label: "Landing Pages" },
  { value: "branding_package", label: "Branding Packages" },
  { value: "monthly_retainer", label: "Monthly Retainers" },
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
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const loading = useLoading();

  return (
    <form
      className="grid gap-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
      onSubmit={(event) => {
        event.preventDefault();
        loading.start();
        startTransition(async () => {
          try {
            setError("");
            await onSubmit({ ...form });
          } catch (err) {
            const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
            setError(msg);
            loading.done();
          }
        });
      }}
    >
      <div className="grid gap-2">
        <label className="text-sm font-medium uppercase tracking-[0.04em] text-slate-500" htmlFor="clientName">
          Client name
        </label>
        <input
          id="clientName"
          className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100 font-body"
          placeholder="e.g. Acme Studio"
          required
          maxLength={200}
          value={form.clientName}
          onChange={(event) => setForm({ ...form, clientName: event.target.value })}
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium uppercase tracking-[0.04em] text-slate-500" htmlFor="templateId">Project type</label>
        <select
          id="templateId"
          className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100 font-body"
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
          <label className="text-sm font-medium uppercase tracking-[0.04em] text-slate-500" htmlFor="optionalBudget">
            Budget (USD)
          </label>
          <select
            id="optionalBudget"
            className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100 font-body"
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
          <label className="text-sm font-medium uppercase tracking-[0.04em] text-slate-500" htmlFor="optionalTargetTimeline">
            Timeline
          </label>
          <select
            id="optionalTargetTimeline"
            className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100 font-body"
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
        <label className="text-sm font-medium uppercase tracking-[0.04em] text-slate-500" htmlFor="rawBrief">
          Brief or meeting notes
        </label>
        <textarea
          id="rawBrief"
          className="min-h-40 rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100 font-body leading-relaxed"
          placeholder="Paste client brief, meeting notes, or email correspondence."
          required
          maxLength={50000}
          value={form.rawBrief}
          onChange={(event) => setForm({ ...form, rawBrief: event.target.value })}
        />
        <p className="text-sm text-slate-500">
          We&apos;ll extract a structured scope, flag missing details, and generate ready-to-send proposal drafts.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <button
        className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-slate-50 transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 md:w-fit"
        type="submit"
        disabled={isPending || !form.clientName.trim() || !form.rawBrief.trim()}
      >
        {isPending ? "Extracting Scope..." : "Extract Structured Scope →"}
      </button>
    </form>
  );
}
