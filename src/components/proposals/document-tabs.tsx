"use client";

export function DocumentTabs({
  active,
  onChange,
}: {
  active: "proposal" | "sow" | "quote";
  onChange: (value: "proposal" | "sow" | "quote") => void;
}) {
  return (
    <div className="inline-flex rounded-lg bg-slate-200 p-0.5" role="tablist" aria-label="Document type">
      {(["proposal", "sow", "quote"] as const).map((tab) => (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={active === tab}
          className={
            active === tab
              ? "rounded-md bg-white px-4 py-1.5 text-sm font-medium text-slate-900 shadow-sm"
              : "rounded-md px-4 py-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-700"
          }
          onClick={() => onChange(tab)}
        >
          {tab.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
