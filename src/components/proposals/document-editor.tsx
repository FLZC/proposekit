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
      className="min-h-[520px] w-full rounded-lg border border-slate-200 bg-white p-6 text-sm leading-relaxed text-slate-700 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100 font-body"
      value={content}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
