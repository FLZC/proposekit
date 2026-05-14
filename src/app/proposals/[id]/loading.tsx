function Shimmer({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`relative overflow-hidden rounded bg-slate-100 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_ease-in-out_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent ${className ?? ""}`}
      style={style}
    />
  );
}

function Dots() {
  return (
    <span className="inline-flex" aria-hidden="true">
      <span className="animate-[dot_1.4s_ease-in-out_infinite]">.</span>
      <span className="animate-[dot_1.4s_ease-in-out_0.2s_infinite]">.</span>
      <span className="animate-[dot_1.4s_ease-in-out_0.4s_infinite]">.</span>
    </span>
  );
}

export default function WorkspaceLoading() {
  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        @keyframes dot {
          0%, 20% { opacity: 0; }
          50% { opacity: 1; }
          80%, 100% { opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Status bar */}
      <div
        className="flex items-center justify-center gap-3 border-b border-slate-200 bg-white px-4 py-3"
        style={{ animation: "fadeUp 0.4s ease-out" }}
      >
        <div className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
        <p className="text-sm font-medium text-slate-600">
          AI is polishing your proposal<Dots />
        </p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar skeleton */}
        <aside className="w-[340px] shrink-0 border-r border-slate-200 bg-slate-50/80 p-4 space-y-3">
          {/* Scope header */}
          <div className="flex items-center gap-2 px-1 mb-1">
            <Shimmer className="h-4 w-28" />
          </div>

          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 space-y-2.5"
              style={{ animation: `fadeUp 0.4s ease-out ${0.1 + i * 0.08}s both` }}
            >
              <div className="flex items-center justify-between">
                <Shimmer className="h-3 w-16 rounded" />
                {i === 0 && <Shimmer className="h-5 w-14 rounded-full" />}
              </div>
              <Shimmer className="h-3.5 w-full rounded" />
              <Shimmer className="h-3.5 w-11/12 rounded" />
              <Shimmer className="h-3.5 w-3/4 rounded" />
            </div>
          ))}

          {/* Risk tags skeleton */}
          <div className="pt-3 px-1 space-y-2">
            <Shimmer className="h-3 w-20 rounded" />
            <div className="flex flex-wrap gap-1.5">
              <Shimmer className="h-6 w-14 rounded-full" />
              <Shimmer className="h-6 w-20 rounded-full" />
              <Shimmer className="h-6 w-16 rounded-full" />
            </div>
          </div>
        </aside>

        {/* Right content skeleton */}
        <section className="flex flex-1 flex-col overflow-hidden bg-slate-50">
          {/* Toolbar skeleton */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-3">
            <div className="flex gap-1 rounded-lg bg-slate-100 p-0.5">
              <div className="h-8 w-24 rounded-md bg-white shadow-sm" />
              <div className="h-8 w-16 rounded-md" />
              <div className="h-8 w-16 rounded-md" />
            </div>
            <div className="flex items-center gap-2">
              <Shimmer className="h-9 w-20 rounded-lg" />
              <Shimmer className="h-9 w-28 rounded-lg" />
            </div>
          </div>

          {/* Document body skeleton */}
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-3xl px-10 py-10">
              {/* Letterhead skeleton */}
              <div className="mb-8 pb-6 border-b-2 border-slate-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl font-semibold text-slate-300 font-display">Proposal</span>
                  <span className="text-xl font-semibold text-amber-300 font-display">Craft</span>
                </div>
                <Shimmer className="h-4 w-64 rounded mb-1.5" />
                <Shimmer className="h-3.5 w-48 rounded" />
              </div>

              {/* Content lines with staggered animation */}
              <div className="space-y-3">
                {/* Section heading */}
                <Shimmer className="h-5 w-48 rounded" />

                {/* Body paragraphs */}
                {[...Array(6)].map((_, i) => (
                  <Shimmer
                    key={i}
                    className={`h-3.5 rounded ${i === 3 ? "w-1/2" : "w-full"}`}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}

                <div className="py-2" />

                {/* Another section */}
                <Shimmer className="h-5 w-40 rounded" />
                {[...Array(4)].map((_, i) => (
                  <Shimmer
                    key={i}
                    className={`h-3.5 rounded ${i === 2 ? "w-3/4" : "w-full"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
