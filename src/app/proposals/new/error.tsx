"use client";

export default function NewProposalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-12">
      <section className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-amber-300">New proposal</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-50 md:text-4xl">Create New Proposal</h1>
      </section>

      <div className="rounded-2xl border border-red-800/40 bg-red-950/30 p-8 text-center space-y-4">
        <div className="flex size-12 mx-auto items-center justify-center rounded-full bg-red-400/15">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-6 text-red-400">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-lg font-medium text-slate-50">Something went wrong</h2>
        <p className="max-w-md mx-auto text-sm text-slate-400">
          {error.message || "The AI extraction service may be temporarily unavailable. Please try again in a moment."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-10 items-center justify-center rounded-xl bg-amber-400 px-5 py-2 text-sm font-medium text-slate-950 transition hover:bg-amber-300"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
