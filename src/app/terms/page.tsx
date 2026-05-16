import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "ProposeKit terms of service — the rules of the road for using our platform.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-8 px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-800">Terms of Service</h1>
      <p className="text-sm text-slate-500">Last updated: May 8, 2026</p>

      <section className="space-y-4 text-sm leading-7 text-slate-500">
        <h2 className="text-lg font-medium text-slate-800">1. Acceptance of terms</h2>
        <p>
          By using ProposeKit (&ldquo;the Service&rdquo;), you agree to these Terms of Service. If you do not
          agree, please do not use the Service.
        </p>
      </section>

      <section className="space-y-4 text-sm leading-7 text-slate-500">
        <h2 className="text-lg font-medium text-slate-800">2. Description of service</h2>
        <p>
          ProposeKit is an AI-assisted tool that helps freelancers and small agencies turn client briefs
          into proposal, SOW, and quote documents. Output is generated using AI and is intended as a
          starting point for your review and customization.
        </p>
      </section>

      <section className="space-y-4 text-sm leading-7 text-slate-500">
        <h2 className="text-lg font-medium text-slate-800">3. User responsibilities</h2>
        <p>
          You are responsible for reviewing all AI-generated content before sharing with clients.
          ProposeKit output does not constitute legal, financial, or professional advice. For
          legally binding contracts, consult a qualified attorney. You are responsible for maintaining
          the confidentiality of your account credentials.
        </p>
      </section>

      <section className="space-y-4 text-sm leading-7 text-slate-500">
        <h2 className="text-lg font-medium text-slate-800">4. Disclaimer of warranties</h2>
        <p>
          The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any
          kind, express or implied. ProposeKit does not warrant that the Service will be uninterrupted,
          error-free, or that AI-generated content will be accurate or complete.
        </p>
      </section>

      <section className="space-y-4 text-sm leading-7 text-slate-500">
        <h2 className="text-lg font-medium text-slate-800">5. Limitation of liability</h2>
        <p>
          ProposeKit and its operators shall not be liable for any indirect, incidental, special, or
          consequential damages arising from your use of the Service, including but not limited to
          lost profits, lost business opportunities, or damages resulting from AI-generated content.
        </p>
      </section>

      <section className="space-y-4 text-sm leading-7 text-slate-500">
        <h2 className="text-lg font-medium text-slate-800">6. Beta terms</h2>
        <p>
          ProposeKit is currently in beta. Features and availability may change without notice.
          During the beta period, the Service is provided free of charge. We reserve the right to
          introduce paid tiers with advance notice.
        </p>
      </section>

      <section className="space-y-4 text-sm leading-7 text-slate-500">
        <h2 className="text-lg font-medium text-slate-800">7. Changes to terms</h2>
        <p>
          We reserve the right to update these Terms at any time. Continued use of the Service after
          changes constitutes acceptance of the new Terms.
        </p>
      </section>

      <section className="space-y-4 text-sm leading-7 text-slate-500">
        <h2 className="text-lg font-medium text-slate-800">8. Contact</h2>
        <p>
          For questions about these Terms, contact us at legal@proposekit.com or use the feedback
          button in the app.
        </p>
      </section>
    </main>
  );
}
