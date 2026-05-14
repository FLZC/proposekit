import Link from "next/link";
import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { FeedbackWidget } from "@/components/feedback-widget";
import { Analytics } from "@/components/analytics";
import { LoadingProvider } from "@/components/loading-bar";
import { ViewSwitcher } from "@/components/view-switcher";

export const metadata: Metadata = {
  title: "ProposeKit",
  description: "Turn messy client briefs into polished proposals, SOWs, and quotes.",
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-800 antialiased font-body flex flex-col min-h-screen">
        <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-[#FBF7F2]/85 backdrop-blur-sm px-6 py-3.5 shrink-0">
          <Link href="/" className="font-display text-lg font-semibold text-slate-900">
            Propose<span className="text-amber-400">Kit</span>
          </Link>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <Link href="/dashboard" className="hover:text-slate-700 transition">Dashboard</Link>
          </div>
        </nav>
        <div className="flex-1">
          <LoadingProvider>
            {children}
            <FeedbackWidget />
            <ViewSwitcher />
          </LoadingProvider>
        </div>
        <Analytics />
        <footer className="border-t border-slate-200 px-6 py-8 shrink-0">
          <div className="mx-auto max-w-5xl space-y-3">
            <p className="text-xs text-slate-500">
              AI-powered proposals, SOWs &amp; quotes — from messy brief to polished PDF in minutes.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span>&copy; {new Date().getFullYear()} ProposeKit. All rights reserved.</span>
              <Link href="/privacy" className="hover:text-slate-700 transition">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-slate-700 transition">Terms of Service</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
