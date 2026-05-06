export default function WorkspaceLoading() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-6 px-6 py-16">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
      <div className="space-y-2 text-center">
        <p className="text-lg font-medium text-slate-200">Generating your proposal package</p>
        <p className="text-sm text-slate-400">AI is extracting scope and writing proposal, SOW, and quote drafts</p>
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-2 w-2 animate-bounce rounded-full bg-amber-400"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </main>
  );
}
