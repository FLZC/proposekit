"use client";

export function DocumentTabs({
  active,
  onChange,
}: {
  active: "proposal" | "sow" | "quote";
  onChange: (value: "proposal" | "sow" | "quote") => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Document type">
      {(["proposal", "sow", "quote"] as const).map((tab) => (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={active === tab}
          className={
            active === tab
              ? "min-h-11 rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-950"
              : "min-h-11 rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300"
          }
          onClick={() => onChange(tab)}
        >
          {tab.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
