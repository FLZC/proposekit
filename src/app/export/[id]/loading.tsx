export default function ExportLoading() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12 animate-pulse">
      {/* Header */}
      <section className="mb-8">
        <div className="h-3 w-24 rounded bg-slate-200 mb-2" />
        <div className="h-8 w-48 rounded-md bg-slate-200 mb-2" />
        <div className="h-4 w-72 rounded bg-slate-100" />
      </section>

      {/* Client info card */}
      <div className="mb-8 flex items-center gap-12 rounded-xl border border-slate-200 bg-white px-8 py-5">
        <div>
          <div className="h-3 w-12 rounded bg-slate-200 mb-1" />
          <div className="h-4 w-28 rounded bg-slate-100" />
        </div>
        <div>
          <div className="h-3 w-16 rounded bg-slate-200 mb-1" />
          <div className="h-4 w-24 rounded bg-slate-100" />
        </div>
      </div>

      {/* Tab switcher */}
      <div className="mb-6">
        <div className="inline-flex rounded-lg bg-slate-200 p-0.5">
          <div className="h-8 w-20 rounded-md bg-white shadow-sm" />
          <div className="h-8 w-16 rounded-md bg-transparent" />
          <div className="h-8 w-16 rounded-md bg-transparent" />
        </div>
      </div>

      {/* Document preview card */}
      <div className="rounded-xl border border-slate-200 bg-white p-10 mb-8 space-y-4">
        <div className="h-7 w-48 rounded bg-slate-200 mb-6" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-slate-100" />
          <div className="h-4 w-full rounded bg-slate-100" />
          <div className="h-4 w-11/12 rounded bg-slate-100" />
          <div className="h-4 w-full rounded bg-slate-100" />
          <div className="h-4 w-3/4 rounded bg-slate-100" />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <div className="h-11 w-40 rounded-lg bg-slate-300" />
        <div className="h-11 w-40 rounded-lg bg-slate-200" />
      </div>
    </main>
  );
}
