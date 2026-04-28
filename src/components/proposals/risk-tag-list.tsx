export function RiskTagList({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-amber-300/20 bg-amber-400/15 px-3 py-1 text-xs font-medium text-amber-200"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
