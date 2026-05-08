"use client";

import { useState, useRef, useEffect } from "react";
import { submitFeedback } from "@/app/actions/feedback";

export function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  // close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (message.trim().length < 3) return;

    setStatus("sending");
    const form = formRef.current!;
    const formData = new FormData(form);
    formData.set("page_url", window.location.pathname);

    const result = await submitFeedback(formData);

    if (result.success) {
      setStatus("sent");
      setMessage("");
      setEmail("");
    } else {
      console.error("Feedback error:", result.error);
      setErrorMsg(result.error ?? "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <>
      {/* floating trigger button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex size-12 items-center justify-center rounded-full bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20 transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-900"
        aria-label="Send feedback"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
          <path fillRule="evenodd" d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902 1.168.188 2.352.327 3.55.414.28.02.521.18.642.413l1.713 3.293a.75.75 0 001.33 0l1.713-3.293a.783.783 0 01.642-.413 41.102 41.102 0 003.55-.414c1.437-.231 2.43-1.489 2.43-2.902V5.426c0-1.413-.993-2.67-2.43-2.902A41.102 41.102 0 0010 2z" clipRule="evenodd" />
        </svg>
      </button>

      {/* backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* modal */}
      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition ${open ? "" : "pointer-events-none opacity-0 invisible"}`}
      >
        <div
          className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-slate-950/50"
          onClick={(e) => e.stopPropagation()}
        >
          {status === "sent" ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-amber-400/15">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-6 text-amber-300">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-lg font-medium text-slate-50">Thanks for the feedback!</p>
              <p className="text-sm text-slate-400">We read every message.</p>
              <button
                type="button"
                onClick={() => { setOpen(false); setStatus("idle"); }}
                className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-50 transition hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="grid gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-50">Send feedback</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Found a bug? Have an idea? Let us know.
                </p>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-50" htmlFor="feedback-message">
                  Message <span className="text-slate-500">(required)</span>
                </label>
                <textarea
                  id="feedback-message"
                  name="message"
                  rows={4}
                  required
                  placeholder="What happened? What did you expect?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-28 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-slate-50 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300/30"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-50" htmlFor="feedback-email">
                  Email <span className="text-slate-500">(optional &mdash; for follow-up)</span>
                </label>
                <input
                  id="feedback-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="min-h-11 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-slate-50 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300/30"
                />
              </div>

              {status === "error" && (
                <p className="text-sm text-red-400">{errorMsg}</p>
              )}

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-400 transition hover:text-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={status === "sending" || message.trim().length < 3}
                  className="inline-flex min-h-10 items-center justify-center rounded-xl bg-amber-400 px-5 py-2 text-sm font-medium text-slate-950 transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "sending" ? "Sending..." : "Send feedback"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
