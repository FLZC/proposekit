import { LoadingLink } from "@/components/loading-link";

export function ExportButton({ proposalId }: { proposalId: string }) {
  return (
    <LoadingLink
      className="inline-flex min-h-9 items-center rounded-lg bg-amber-400 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-amber-500"
      href={`/export/${proposalId}`}
    >
      Export PDF ↗
    </LoadingLink>
  );
}
