export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-8 px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-50">Privacy Policy</h1>
      <p className="text-sm text-slate-400">Last updated: May 8, 2026</p>

      <section className="space-y-4 text-sm leading-7 text-slate-400">
        <h2 className="text-lg font-medium text-slate-50">1. Information we collect</h2>
        <p>
          When you use ProposeKit, we collect your email address (for authentication), project data
          (client briefs, structured scopes, and generated documents), and optional feedback you choose
          to submit. We do not collect payment information — ProposeKit is free during beta.
        </p>
        <p>
          We use Umami for privacy-first analytics. Umami does not use cookies and does not collect
          personal data. Visit{" "}
          <a href="https://umami.is" className="text-amber-300 underline hover:text-amber-200">umami.is</a>
          {" "}for details.
        </p>
      </section>

      <section className="space-y-4 text-sm leading-7 text-slate-400">
        <h2 className="text-lg font-medium text-slate-50">2. How we use your information</h2>
        <p>
          We use your email to authenticate you and send login magic links. We use your project data
          to provide the ProposeKit service — extracting scopes, generating documents, and enabling
          PDF export. We do NOT sell, rent, or share your personal data with third parties for
          commercial purposes.
        </p>
        <p>
          Feedback submissions are stored to improve the product. Your email is optional when
          submitting feedback.
        </p>
      </section>

      <section className="space-y-4 text-sm leading-7 text-slate-400">
        <h2 className="text-lg font-medium text-slate-50">3. Data storage, retention and security</h2>
        <p>
          Your data is stored in Supabase (PostgreSQL) and processed via our Next.js application.
          Project data and generated documents are associated with your user account and are not
          publicly accessible. We use industry-standard encryption in transit (HTTPS) and at rest.
        </p>
        <p>
          <strong className="text-slate-300">Data retention:</strong> We retain your account data
          and project data until you delete your account or request data deletion. After deletion,
          we permanently erase or anonymize your data within 30 days, except as required by law.
        </p>
        <p>
          <strong className="text-slate-300">Third-party services:</strong>
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Supabase — data processing per{" "}
            <a href="https://supabase.com/privacy" className="text-amber-300 underline hover:text-amber-200">Supabase Privacy Policy</a>
          </li>
          <li>
            Umami — privacy-first analytics per{" "}
            <a href="https://umami.is/privacy" className="text-amber-300 underline hover:text-amber-200">Umami Privacy Policy</a>
          </li>
        </ul>
      </section>

      <section className="space-y-4 text-sm leading-7 text-slate-400">
        <h2 className="text-lg font-medium text-slate-50">4. Your rights and choices</h2>
        <p>
          You may request to <strong className="text-slate-300">access, correct, delete, or restrict
          processing</strong> of your account and project data at any time by contacting us. We will
          respond to valid requests within 45 days.
        </p>
        <p>
          Since ProposeKit does not use cookies for tracking, no cookie consent is required.
        </p>
        <p>
          <strong className="text-slate-300">Do Not Sell My Personal Information:</strong> ProposeKit
          does not sell, rent, or share your personal information for monetary or other valuable
          consideration. We comply with California&apos;s &ldquo;Do Not Sell My Personal Information&rdquo;
          requirements.
        </p>
      </section>

      <section className="space-y-4 text-sm leading-7 text-slate-400">
        <h2 className="text-lg font-medium text-slate-50">5. Changes to this policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of material changes
          by posting the updated policy on our website with a revised &ldquo;last updated&rdquo; date.
        </p>
      </section>

      <section className="space-y-4 text-sm leading-7 text-slate-400">
        <h2 className="text-lg font-medium text-slate-50">6. Contact</h2>
        <p>
          For privacy-related inquiries, email us at privacy@proposekit.com or use the feedback
          button in the app.
        </p>
      </section>
    </main>
  );
}
