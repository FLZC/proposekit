"use client";

import { usePathname } from "next/navigation";
import { LoadingLink } from "@/components/loading-link";

const VIEWS = [
  { href: "/", label: "Landing" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/proposals/new", label: "New Proposal" },
];

export function ViewSwitcher() {
  const pathname = usePathname();
  const isWorkspace = pathname.startsWith("/proposals/") && pathname !== "/proposals/new";

  return (
    <div className="fixed bottom-5 right-5 z-[200] flex gap-0.5 rounded-lg border border-slate-200 bg-white p-0.5 shadow-lg">
      {VIEWS.map((v) => (
        <LoadingLink
          key={v.href}
          href={v.href}
          className={`rounded-md px-3 py-1.5 text-[11px] font-medium transition ${
            pathname === v.href
              ? "bg-slate-900 text-white"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          {v.label}
        </LoadingLink>
      ))}
      {isWorkspace && (
        <span className="rounded-md bg-slate-900 text-white px-3 py-1.5 text-[11px] font-medium">
          Workspace
        </span>
      )}
    </div>
  );
}
