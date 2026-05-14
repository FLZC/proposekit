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
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-6 z-40 flex size-11 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
        aria-label="Send feedback"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
          <path fillRule="evenodd" d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902 1.168.188 2.352.327 3.55.414.28.02.521.18.642.413l1.713 3.293a.75.75 0 001.33 0l1.713-3.293a.783.783 0 01.642-.413 41.102 41.102 0 003.55-.414c1.437-.231 2.43-1.489 2.43-2.902V5.426c0-1.413-.993-2.67-2.43-2.902A41.102 41.102 0 0010 2z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition ${open ? "" : "pointer-events-none opacity-0 invisible"}`}
      >
        <div
          className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {status === "sent" ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-sage-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-6 text-sage-400">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="font-display text-lg font-medium text-slate-800">Thanks for the feedback!</p>
              <p className="text-sm text-slate-500">We read every message.</p>
              <button
                type="button"
                onClick={() => { setOpen(false); setStatus("idle"); }}
                className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="grid gap-4">
              <div>
                <h2 className="font-display text-lg font-semibold text-slate-800">Send feedback</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Found a bug? Have an idea? Let us know.
                </p>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-500" htmlFor="feedback-message">
                  Message <span className="text-slate-400">(required)</span>
                </label>
                <textarea
                  id="feedback-message"
                  name="message"
                  rows={4}
                  required
                  placeholder="What happened? What did you expect?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-28 rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100 font-body"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-500" htmlFor="feedback-email">
                  Email <span className="text-slate-400">(optional — for follow-up)</span>
                </label>
                <input
                  id="feedback-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100 font-body"
                />
              </div>

              {status === "error" && (
                <p className="text-sm text-red-500">{errorMsg}</p>
              )}

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 transition hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={status === "sending" || message.trim().length < 3}
                  className="inline-flex min-h-10 items-center justify-center rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-slate-50 transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
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
