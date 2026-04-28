export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center gap-8 px-6 py-16">
      <p className="text-sm uppercase tracking-[0.2em] text-amber-300">ProposalCraft</p>

      <div className="space-y-4">
        <h1 className="text-5xl font-semibold leading-tight">
          Turn messy client briefs into clear proposals, SOWs, and quotes.
        </h1>
        <p className="max-w-2xl text-lg text-slate-300">
          The AI copilot for small web, design, and development agencies. Paste a brief, get a complete proposal package in minutes — not hours.
        </p>
      </div>

      <a
        className="inline-flex w-fit rounded-xl bg-amber-400 px-6 py-3 text-base font-medium text-slate-950 transition hover:bg-amber-300"
        href="/proposals/new"
      >
        Create your first proposal — free
      </a>

      <section className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <p className="mb-2 text-2xl font-bold text-amber-300">1</p>
          <h2 className="mb-2 text-lg font-semibold text-slate-100">Paste a brief</h2>
          <p className="text-sm leading-relaxed text-slate-400">
            Drop in client notes, email threads, or a rough project description. No formatting required.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <p className="mb-2 text-2xl font-bold text-amber-300">2</p>
          <h2 className="mb-2 text-lg font-semibold text-slate-100">AI extracts the scope</h2>
          <p className="text-sm leading-relaxed text-slate-400">
            Deliverables, timeline, assumptions, exclusions, and pricing — automatically structured for you to review.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <p className="mb-2 text-2xl font-bold text-amber-300">3</p>
          <h2 className="mb-2 text-lg font-semibold text-slate-100">Export and send</h2>
          <p className="text-sm leading-relaxed text-slate-400">
            Get a polished proposal, SOW, and three-tier quote — ready to download as PDF and share with your client.
          </p>
        </div>
      </section>

      <section className="mt-4">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Built for your workflow</h2>
        <div className="flex flex-wrap gap-2">
          {["Web Design", "Website Development", "Landing Pages", "Branding Packages", "Monthly Retainers"].map(
            (t) => (
              <span
                key={t}
                className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300"
              >
                {t}
              </span>
            ),
          )}
        </div>
      </section>

      <p className="mt-12 max-w-2xl text-xs leading-relaxed text-slate-500">
        Disclaimer: ProposalCraft generates proposal, SOW, and quote drafts using AI. All output is a starting
        point only — not legal, financial, or professional advice. Pricing figures are illustrative. Review and
        adjust all content before sending to clients. ProposalCraft assumes no liability for the use of generated
        documents.
      </p>
    </main>
  );
}
