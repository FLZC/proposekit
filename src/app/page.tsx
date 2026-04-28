export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center gap-6 px-6 py-16">
      <p className="text-sm uppercase tracking-[0.2em] text-amber-300">ProposalCraft</p>
      <h1 className="text-5xl font-semibold leading-tight">
        Turn messy client briefs into clear proposals, SOWs, and quotes.
      </h1>
      <p className="max-w-2xl text-lg text-slate-300">
        ProposalCraft is the AI scope and proposal copilot for small web, design, and development agencies.
      </p>
      <a
        className="inline-flex w-fit rounded-md bg-amber-400 px-4 py-2 font-medium text-slate-950"
        href="/dashboard"
      >
        Open MVP shell
      </a>
      <p className="mt-12 max-w-2xl text-xs leading-relaxed text-slate-500">
        Disclaimer: ProposalCraft generates proposal, SOW, and quote drafts using AI. All output is a starting point only — not legal, financial, or professional advice. Pricing figures are illustrative. Review and adjust all content before sending to clients. ProposalCraft assumes no liability for the use of generated documents.
      </p>
    </main>
  );
}
