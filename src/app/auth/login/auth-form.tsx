"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (err) {
      setError(err.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center">
        <p className="text-slate-200 font-medium">Check your email</p>
        <p className="mt-2 text-sm text-slate-400">
          We sent a magic link to <strong className="text-slate-200">{email}</strong>. Click the link to sign in.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-100" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          required
          className="min-h-11 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-slate-50 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300/30"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-amber-400 px-4 py-3 text-base font-medium text-slate-950 transition hover:bg-amber-300 disabled:opacity-60"
      >
        {loading ? "Sending link..." : "Send magic link"}
      </button>
    </form>
  );
}
