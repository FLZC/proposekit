export default function DashboardLoading() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12 animate-pulse">
      {/* Header skeleton */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <div className="h-8 w-48 rounded-md bg-slate-200 mb-2" />
          <div className="h-4 w-72 rounded-md bg-slate-100" />
        </div>
        <div className="flex items-center gap-4">
          <div className="h-4 w-16 rounded-md bg-slate-200" />
          <div className="h-10 w-36 rounded-lg bg-slate-300" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-3 flex gap-12">
          <div className="h-3 w-20 rounded bg-slate-200" />
          <div className="h-3 w-16 rounded bg-slate-200" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border-b border-slate-100 px-6 py-4 flex gap-12">
            <div>
              <div className="h-4 w-32 rounded bg-slate-200 mb-1.5" />
              <div className="h-3 w-24 rounded bg-slate-100" />
            </div>
            <div className="h-4 w-20 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </main>
  );
}
