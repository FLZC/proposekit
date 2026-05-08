import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { FeedbackWidget } from "@/components/feedback-widget";
import { Analytics } from "@/components/analytics";

export const metadata: Metadata = {
  title: "ProposeKit",
  description: "Turn messy client briefs into polished proposals, SOWs, and quotes.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50 antialiased">
        {children}
        <FeedbackWidget />
        <Analytics />
      </body>
    </html>
  );
}
