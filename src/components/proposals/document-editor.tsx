"use client";

export function DocumentEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (value: string) => void;
}) {
  return (
    <textarea
      aria-label="Document content"
      className="min-h-[420px] w-full rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm leading-6 text-slate-100 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300/30"
      value={content}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
