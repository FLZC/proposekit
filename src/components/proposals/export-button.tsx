import Link from "next/link";

export function ExportButton({ proposalId }: { proposalId: string }) {
  return (
    <Link
      className="inline-flex min-h-11 items-center justify-center rounded-xl bg-amber-400 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-900"
      href={`/export/${proposalId}`}
    >
      Export &amp; download
    </Link>
  );
}
