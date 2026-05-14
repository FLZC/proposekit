export default function NewProposalLoading() {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12 animate-pulse">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-3 w-28 rounded bg-slate-200 mb-2" />
        <div className="h-8 w-56 rounded-md bg-slate-200 mb-2" />
        <div className="h-4 w-full rounded bg-slate-100" />
      </div>

      {/* Form skeleton */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="p-8 space-y-6">
          {/* Client name field */}
          <div className="space-y-2">
            <div className="h-4 w-20 rounded bg-slate-200" />
            <div className="h-11 w-full rounded-lg bg-slate-100" />
          </div>
          {/* Template field */}
          <div className="space-y-2">
            <div className="h-4 w-16 rounded bg-slate-200" />
            <div className="h-11 w-full rounded-lg bg-slate-100" />
          </div>
          {/* Brief textarea */}
          <div className="space-y-2">
            <div className="h-4 w-32 rounded bg-slate-200" />
            <div className="h-36 w-full rounded-lg bg-slate-100" />
          </div>
          {/* Budget field */}
          <div className="space-y-2">
            <div className="h-4 w-12 rounded bg-slate-200" />
            <div className="h-11 w-full rounded-lg bg-slate-100" />
          </div>
          {/* Timeline field */}
          <div className="space-y-2">
            <div className="h-4 w-16 rounded bg-slate-200" />
            <div className="h-11 w-full rounded-lg bg-slate-100" />
          </div>
          {/* Submit button */}
          <div className="flex justify-end pt-2">
            <div className="h-11 w-44 rounded-lg bg-slate-300" />
          </div>
        </div>
      </div>
    </main>
  );
}
