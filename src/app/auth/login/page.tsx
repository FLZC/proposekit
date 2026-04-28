import { AuthForm } from "./auth-form";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6 py-16">
      <div className="space-y-2 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-amber-300">ProposalCraft</p>
        <h1 className="text-2xl font-semibold text-slate-50">Sign in or create an account</h1>
        <p className="text-sm text-slate-400">
          Enter your email. We'll send you a magic link — no password needed.
        </p>
      </div>
      <AuthForm />
    </main>
  );
}
