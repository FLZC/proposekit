import { Suspense } from "react";
import { AuthForm } from "./auth-form";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-8 px-6 py-16">
      <div className="text-center space-y-3">
        <h1 className="font-display text-2xl font-semibold text-slate-900">ProposeKit</h1>
        <p className="text-sm text-slate-500">
          Enter your email. We&apos;ll send you a magic link — no password needed.
        </p>
      </div>
      <Suspense>
        <AuthForm />
      </Suspense>
    </main>
  );
}
