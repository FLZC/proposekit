import type { Template } from "./types";

const templates: Record<string, Template> = {
  web_design: {
    id: "web_design",
    name: "Web Design Proposal",
    description: "For visual design, UI/UX redesign, and branding-adjacent web projects. Best when the core deliverable is design files, not code.",
    category: "web design",
    proposal: [
      {
        heading: "Project Understanding",
        body: `Thank you for the opportunity to propose a solution for {{clientName}}.

We understand you need {{deliverablesInline}}. The goal is a design-driven approach that elevates your brand, improves user experience, and delivers measurable results.

Based on the project brief, we have outlined a scope, timeline, and investment structure below.`,
      },
      {
        heading: "Proposed Solution",
        body: `Our approach combines strategic thinking with executional craft:

**Research & Discovery**
— Stakeholder interviews to align on vision and goals
— Competitive landscape review
— User journey mapping and information architecture

**Design**
— Wireframes for key page templates
— High-fidelity mockups with 2 rounds of revisions
— Responsive designs covering desktop, tablet, and mobile
— Interactive prototype for stakeholder review

**Handoff**
— Organized Figma files with component library
— Design system documentation (colors, typography, spacing, components)
— Developer-ready asset export`,
      },
      {
        heading: "Deliverables",
        body: `**In Scope:**
{{deliverables}}

**Key Deliverables:**
— Wireframes (all template pages)
— High-fidelity UI mockups
— Interactive prototype
— Design system / style guide
— Asset export package (SVG, PNG, PDF)`,
      },
      {
        heading: "Expected Outcomes",
        body: `While every project is unique, clients who invest in professional web design typically see:

— Stronger brand credibility and visual consistency across all touchpoints
— Improved user engagement through intuitive navigation and clear hierarchy
— Higher conversion potential from design optimized for your audience
— Reduced bounce rates with faster, mobile-responsive layouts
— Clean developer handoff that saves time and avoids costly rework`,
      },
      {
        heading: "Timeline",
        body: `Estimated duration: {{timeline}}

**Phases:**
{{milestones}}

A detailed schedule with specific dates will be provided at kickoff. Timeline depends on timely client feedback (48-hour review window per round).`,
      },
      {
        heading: "Investment",
        body: `Pricing model: {{pricingModel}}

**Budget:** {{budget}}
**Payment Notes:** {{pricingNotes}}

A 50% deposit secures the project start date. Remaining balance is due upon final delivery.`,
      },
      {
        heading: "Optional Add-Ons",
        body: `Available with any package — add what you need:
— Rush delivery (tight deadline): +25%
— Extra revision round: $500
— Copywriting for key pages: $1,500+
— SEO setup (meta, schema, sitemap): $1,200
— Monthly maintenance after launch: from $299/mo
— Custom illustration or icon set: custom quote`,
      },
      {
        heading: "Assumptions & Exclusions",
        body: `**Assumptions:**
{{assumptions}}

**Exclusions (out of scope):**
{{exclusions}}

Any work outside this scope will be handled as a separate change order.`,
      },
      {
        heading: "Why Choose Me",
        body: `I specialize in web design for small businesses and agencies. My process is direct, transparent, and focused on outcomes, not just files.

— Design files delivered in industry-standard formats (Figma, SVG, PNG, PDF)
— 2 revision rounds included on all mockups
— Post-handoff support for 30 days after delivery
— Direct communication — you talk to the designer, not an account manager`,
      },
      {
        heading: "Next Steps",
        body: `1. Review and accept this proposal
2. Sign the agreement and submit the 50% deposit
3. We'll schedule a kickoff call within 3 business days
4. Discovery phase begins immediately after kickoff

Questions? Reach out anytime. We're excited to work with {{clientName}}.`,
      },
    ],
    sow: [
      {
        heading: "Project Overview",
        body: `This Statement of Work defines the scope, deliverables, timeline, and terms for the web design project between our agency and {{clientName}}.

**Project:** {{projectType}}
**Start Date:** To be confirmed upon agreement signing`,
      },
      {
        heading: "Scope of Work",
        body: `**In Scope:**
{{deliverables}}

**Detailed Scope:**
— Stakeholder discovery and brand audit
— Information architecture and sitemap planning
— Wireframe creation for all unique page templates
— High-fidelity UI design for desktop, tablet, and mobile breakpoints
— Interactive prototyping for stakeholder review
— Design system documentation
— Final asset handoff in Figma, SVG, PNG, and PDF formats
— 2 rounds of design revisions`,
      },
      {
        heading: "Out of Scope",
        body: `The following are explicitly excluded unless added via change order:
{{exclusions}}

Additionally:
— Frontend or backend development (this is a design-only engagement)
— Copywriting or content creation
— Photography, illustration, or custom icon design
— SEO optimization or analytics setup
— Hosting, domain configuration, or deployment
— Ongoing maintenance after the 30-day post-delivery window`,
      },
      {
        heading: "Deliverables & Acceptance Criteria",
        body: `Each deliverable is considered accepted if no written feedback is received within 5 business days of submission.

| Deliverable | Format | Acceptance |
|---|---|---|
| Wireframes | Figma | Approved by client stakeholder |
| UI Mockups | Figma + PNG | Matches approved wireframes + brand direction |
| Prototype | Figma / web link | All key flows navigable |
| Design System | PDF + Figma | Covers colors, type, spacing, components |
| Asset Export | SVG, PNG, PDF | All files open correctly and match mockups |`,
      },
      {
        heading: "Timeline & Milestones",
        body: `**Overall Timeline:** {{timeline}}

**Milestones:**
{{milestones}}

Timeline is dependent on timely client feedback. Review windows are 48 hours per round. Delays in feedback may push subsequent milestones.`,
      },
      {
        heading: "Assumptions & Dependencies",
        body: `**Assumptions:**
{{assumptions}}

**Client Dependencies:**
— Client provides brand assets, existing style guides, and access to stakeholders within 3 business days of request
— Client designates a single point of contact for approvals
— Client reviews deliverables within the 5-business-day window

If any assumption proves incorrect, scope, timeline, or cost may be revised by mutual agreement.`,
      },
      {
        heading: "Change Management",
        body: `Any work outside the defined scope requires a written change request. Process:

1. Client submits change request in writing
2. Agency provides impact estimate (effort, timeline, cost) within 3 business days
3. Client approves in writing before work begins
4. Change is added to scope baseline`,
      },
      {
        heading: "Terms",
        body: `**Payment:** 50% deposit upon signing, 50% upon final delivery. Invoices due within 15 days.

**IP Ownership:** Full IP rights transfer to client upon final payment.

**Cancellation:** Either party may cancel with 14 days written notice. Deposit is non-refundable.

**Confidentiality:** Both parties agree to protect confidential information shared during the engagement.`,
      },
    ],
    quote: {
      tiers: [
        {
          name: "Essentials",
          price: "$3,000 – $5,000",
          description: "Best for a single-page or small-site redesign with limited pages.",
          features: [
            "Up to 5 page templates",
            "1 design concept, 2 revision rounds",
            "Mobile-responsive designs",
            "Basic style guide",
            "Asset export (PNG, SVG)",
          ],
        },
        {
          name: "Growth",
          price: "$5,000 – $10,000",
          description: "Best for a full website redesign with custom UI and prototyping.",
          features: [
            "Up to 10 page templates",
            "2 design concepts, 3 revision rounds",
            "Interactive prototype",
            "Full design system documentation",
            "Component library in Figma",
            "Developer handoff support",
          ],
        },
        {
          name: "Authority",
          price: "$10,000 – $20,000",
          description: "Best for complex redesigns, multi-brand systems, or design at scale.",
          features: [
            "Unlimited page templates",
            "3 design concepts, unlimited revisions on final concept",
            "User research and usability testing",
            "Full design system with token-based architecture",
            "Motion design and micro-interaction specs",
            "3 months post-launch design support",
          ],
        },
      ],
      paymentSchedule:
        "50% deposit to start, 25% at design approval milestone, 25% on final delivery.",
    },
  },

  website_development: {
    id: "website_development",
    name: "Website Development Proposal",
    description: "For full-stack website builds: frontend, backend, CMS, and deployment. Best when the deliverable is a working website.",
    category: "web development",
    proposal: [
      {
        heading: "Project Understanding",
        body: `Thank you for the opportunity to build a solution for {{clientName}}.

Based on your brief, we understand the core requirement: {{deliverablesInline}}.

We've scoped a complete build — from architecture through deployment — designed to be fast, maintainable, and aligned with your goals.`,
      },
      {
        heading: "Proposed Solution",
        body: `**Discovery & Planning**
— Requirements gathering and technical specification
— Information architecture and sitemap
— Technology stack recommendation

**Design & Prototyping**
— Wireframes for all page templates
— UI design for desktop, tablet, and mobile
— Interactive prototype for stakeholder sign-off

**Development**
— Frontend: modern framework with responsive, accessible markup
— Backend: secure API with database design
— CMS: content management system tailored to your workflow

**Testing & Launch**
— Cross-browser and device testing
— Performance optimization (targeting 90+ Lighthouse)
— Deployment and 30-day post-launch support`,
      },
      {
        heading: "Deliverables",
        body: `**In Scope:**
{{deliverables}}

**Technical Deliverables:**
— Fully functional website (staging + production)
— Source code repository access
— CMS admin panel with user documentation
— Deployment runbook
— 30 days post-launch bug-fix support`,
      },
      {
        heading: "Expected Outcomes",
        body: `Clients who invest in a well-built website typically see:

— Faster load times and better Google rankings from modern, optimized code
— Higher conversion rates with clear user flows and fast checkout experiences
— Lower long-term maintenance costs from clean architecture and documentation
— Easier content updates with a CMS tailored to your team's workflow
— Room to grow — scalable infrastructure that handles traffic spikes`,
      },
      {
        heading: "Timeline",
        body: `Estimated duration: {{timeline}}

**Phases:**
{{milestones}}

Timeline depends on timely provision of content, assets, and feedback from client.`,
      },
      {
        heading: "Investment",
        body: `Pricing model: {{pricingModel}}

**Budget:** {{budget}}
**Payment Notes:** {{pricingNotes}}

A 40% deposit secures the start date. 30% at development milestone. 30% before launch.`,
      },
      {
        heading: "Optional Add-Ons",
        body: `Available with any package — add what you need:
— Rush delivery (tight deadline): +25%
— Extra revision round: $750
— SEO setup (meta, schema, sitemap, robots.txt): $1,500
— Copywriting for key pages: $2,000+
— Monthly maintenance after launch: from $299/mo
— Custom admin dashboard or reporting: custom quote`,
      },
      {
        heading: "Assumptions & Exclusions",
        body: `**Assumptions:**
{{assumptions}}

**Exclusions:**
{{exclusions}}`,
      },
      {
        heading: "Why Choose Me",
        body: `I build websites that are fast, maintainable, and built to grow with your business — not bloated with unnecessary complexity.

— Clean, commented source code delivered via Git
— CMS documentation written for real humans, not developers
— 30 days of post-launch bug-fix support included
— Direct communication — you talk to the builder, not a project manager`,
      },
      {
        heading: "Next Steps",
        body: `1. Accept proposal and sign agreement
2. Submit 40% deposit
3. Kickoff call within 3 business days
4. Discovery phase begins immediately`,
      },
    ],
    sow: [
      {
        heading: "Project Overview",
        body: `This Statement of Work defines the technical scope, deliverables, and terms for the website development project between our agency and {{clientName}}.

**Project:** {{projectType}}
**Engagement Type:** Fixed-price development`,
      },
      {
        heading: "Scope of Work",
        body: `**In Scope:**
{{deliverables}}

**Phase 1 — Discovery (1–2 weeks)**
— Requirements analysis and technical specification
— Architecture and database schema design
— Sitemap and user flow mapping
— Technology stack selection and environment setup

**Phase 2 — Design (2–3 weeks)**
— Wireframe creation for all page templates
— UI design for desktop, tablet, mobile
— Design system / component library
— Interactive prototype

**Phase 3 — Development (4–8 weeks)**
— Frontend development (HTML, CSS, JS, framework)
— Backend API and database implementation
— CMS integration and content modeling
— Third-party integrations
— Responsive implementation

**Phase 4 — Testing & QA (1–2 weeks)**
— Cross-browser testing (Chrome, Firefox, Safari, Edge)
— Mobile/tablet responsive testing
— Accessibility audit (WCAG 2.1 AA)
— Performance testing (Core Web Vitals)
— User acceptance testing (UAT)

**Phase 5 — Launch (1 week)**
— Production environment configuration
— SSL, DNS, and domain setup
— Final deployment
— 72-hour post-launch monitoring`,
      },
      {
        heading: "Out of Scope",
        body: `**Explicitly Excluded:**
{{exclusions}}

Additionally:
— Ongoing hosting, server administration, or infrastructure management
— Content population beyond placeholder data
— SEO keyword research, content strategy, or paid advertising
— Training beyond one initial session (additional sessions available as change order)
— Performance guarantees for browsers more than 2 major versions behind current
— Third-party system modifications (CRM, ERP, payment platforms)`,
      },
      {
        heading: "Deliverables & Acceptance",
        body: `| Deliverable | Acceptance Criteria |
|---|---|
| Technical specification | Approved by client stakeholder |
| Wireframes + mockups | Match brand direction, approved in writing |
| Staging deployment | All core user flows pass UAT |
| Production deployment | Site live, SSL active, all forms functional |
| Source code | Accessible via Git repository |
| CMS documentation | PDF guide covering all admin functions |`,
      },
      {
        heading: "Timeline & Milestones",
        body: `**Overall Timeline:** {{timeline}}

**Milestones:**
{{milestones}}

Client review windows are 5 business days per deliverable. Delays in feedback or asset provision will shift the schedule accordingly.`,
      },
      {
        heading: "Assumptions & Dependencies",
        body: `**Assumptions:**
{{assumptions}}

**Client Dependencies:**
— Client provides all content (text, images, data) in agreed format before development phase
— Client provides API keys, DNS access, and hosting credentials within Week 1
— Client designates a single point of contact for technical decisions
— Third-party APIs remain available and backward-compatible during development

If any assumption is invalidated, scope, timeline, or cost may require revision.`,
      },
      {
        heading: "Change Management",
        body: `Scope changes require: (1) written request from client, (2) impact estimate within 3 business days, (3) written approval before work begins. Approved changes update the scope baseline.`,
      },
      {
        heading: "Terms",
        body: `**Payment:** 40% deposit, 30% at development milestone, 30% before launch. Invoices due within 15 days.

**IP Ownership:** Full source code and IP transfer to client upon final payment. Agency retains right to display work in portfolio.

**Warranty:** 30-day bug-fix warranty from launch date. Does not cover feature requests, content updates, or third-party service changes.

**Cancellation:** 14 days written notice. Work completed to date is invoiced. Deposit is non-refundable.`,
      },
    ],
    quote: {
      tiers: [
        {
          name: "Essentials",
          price: "$8,000 – $15,000",
          description: "Brochure site or small business website with CMS.",
          features: [
            "Up to 10 pages",
            "Responsive frontend",
            "WordPress or static site CMS",
            "Contact form + basic SEO setup",
            "30-day post-launch support",
          ],
        },
        {
          name: "Growth",
          price: "$15,000 – $35,000",
          description: "Custom web app or mid-size site with backend, auth, and integrations.",
          features: [
            "Up to 25 pages / views",
            "Custom backend with API",
            "User auth + role-based access",
            "CMS with custom content types",
            "Payment or booking integration",
            "Performance optimization (90+ Lighthouse)",
            "60-day post-launch support",
          ],
        },
        {
          name: "Authority",
          price: "$35,000 – $75,000+",
          description: "Complex platform, SaaS MVP, or custom web application with advanced features.",
          features: [
            "Unlimited pages / views",
            "Full-stack architecture with modern frameworks",
            "Advanced auth (SSO, social login, 2FA)",
            "Admin dashboard with analytics",
            "CI/CD pipeline + staging environment",
            "Load testing and scalability planning",
            "90-day post-launch support + documentation",
          ],
        },
      ],
      paymentSchedule: "40% deposit, 30% at development milestone, 30% before launch.",
    },
  },

  landing_page: {
    id: "landing_page",
    name: "Landing Page Proposal",
    description: "For conversion-optimized landing pages: lead gen, product launches, campaign pages, and microsites.",
    category: "landing page",
    proposal: [
      {
        heading: "Project Understanding",
        body: `{{clientName}} needs a high-converting landing page. Based on your brief — {{deliverablesInline}} — the goal is clear: turn visitors into leads or customers.

A great landing page does one thing exceptionally well. We'll design and build one that converts, loads fast, and looks sharp on every device.`,
      },
      {
        heading: "Proposed Solution",
        body: `**Strategy & Research**
— Audit of existing page or competitor benchmarks
— Conversion goal definition and KPI targets
— Copy structure and messaging framework

**Design**
— Conversion-focused layout with clear visual hierarchy
— Mobile-first responsive design
— High-fidelity mockup with 2 revision rounds

**Build**
— Performance-optimized HTML/CSS/JS
— Form implementation with validation
— Analytics and conversion tracking setup
— A/B test-ready structure (optional)

**Launch**
— Deployment to production
— Post-launch performance verification`,
      },
      {
        heading: "Deliverables",
        body: `**In Scope:**
{{deliverables}}

**Key Deliverables:**
— Conversion strategy brief
— Wireframe (mobile + desktop)
— High-fidelity design mockup
— Live, deployed landing page
— Analytics + conversion tracking setup
— 14 days post-launch support`,
      },
      {
        heading: "Expected Outcomes",
        body: `A focused landing page typically delivers:

— 2–5x higher conversion rates compared to sending traffic to a homepage
— Lower cost-per-lead from paid ads (better Quality Score, higher relevance)
— Clearer messaging that speaks directly to one audience with one goal
— Faster load times optimized for mobile visitors and Google rankings
— Clean data: know exactly what's working with proper tracking setup`,
      },
      {
        heading: "Timeline",
        body: `Estimated duration: {{timeline}}

**Phases:**
{{milestones}}

Landing pages move fast. Typical turnaround: 1–2 weeks from kickoff to launch, depending on feedback speed.`,
      },
      {
        heading: "Investment",
        body: `Pricing model: {{pricingModel}}

**Budget:** {{budget}}
**Payment Notes:** {{pricingNotes}}

50% to start, 50% on launch.`,
      },
      {
        heading: "Optional Add-Ons",
        body: `Add to any landing page package:
— Rush delivery (under 5 business days): +25%
— A/B test setup with variant: $800
— Copywriting for landing page: $1,200
— Email follow-up sequence (3 emails): $900
— CRM integration (HubSpot, Mailchimp, ConvertKit): $600
— Monthly CRO retainer: from $399/mo`,
      },
      {
        heading: "Assumptions & Exclusions",
        body: `**Assumptions:**
{{assumptions}}

**Exclusions:**
{{exclusions}}`,
      },
      {
        heading: "Why Choose Me",
        body: `I build landing pages that convert — not just look good. Every design decision is backed by conversion principles: clear hierarchy, strong CTAs, social proof at the right moment. A focused page converts 2–5x better than sending traffic to a homepage. I build for one outcome: more leads and sales for your business.`,
      },
      {
        heading: "Next Steps",
        body: `1. Accept proposal and submit 50% deposit
2. We'll send a creative brief within 24 hours
3. Strategy + wireframe delivered within 3 business days
4. Launch within 1–2 weeks of kickoff`,
      },
    ],
    sow: [
      {
        heading: "Project Overview",
        body: `This SOW defines the scope for a conversion-optimized landing page for {{clientName}}.

**Project:** {{projectType}}
**Goal:** Drive conversions (leads, signups, or sales) through a focused, single-purpose page.`,
      },
      {
        heading: "Scope of Work",
        body: `**In Scope:**
{{deliverables}}

**Detailed Scope:**
— Conversion strategy and KPI definition
— Copy audit and messaging recommendations
— Wireframe (mobile + desktop)
— High-fidelity UI design
— Responsive frontend development
— Form implementation with validation
— Thank-you / confirmation state
— Google Analytics 4 + conversion event tracking
— Cookie consent banner (if needed)
— 14 days post-launch bug-fix support`,
      },
      {
        heading: "Out of Scope",
        body: `**Explicitly Excluded:**
{{exclusions}}

Additionally:
— Ongoing A/B testing management or CRO programs
— Paid advertising, ad creative, or campaign management
— Email marketing, CRM, or marketing automation integration
— Copywriting (unless explicitly listed)
— Hosting, domain registration, or SSL (page deployed to agency staging or client-provided host)
— SEO strategy beyond on-page basics (title, meta, H1, schema)`,
      },
      {
        heading: "Deliverables & Acceptance",
        body: `| Deliverable | Acceptance Criteria |
|---|---|
| Conversion strategy brief | Approved by client |
| Wireframe | Covers all states (loading, empty, error, success) |
| Design mockup | Matches approved wireframe + brand |
| Live landing page | Deployed, all links/forms functional, analytics firing |
| Tracking setup | GA4 events verified, conversion goal tracking active |`,
      },
      {
        heading: "Timeline & Milestones",
        body: `**Overall Timeline:** {{timeline}}

**Milestones:**
{{milestones}}`,
      },
      {
        heading: "Assumptions & Dependencies",
        body: `**Assumptions:**
{{assumptions}}

**Dependencies:**
— Client provides brand assets (logo, colors, fonts) within 2 business days
— Client provides copy or reviews agency copy within 48 hours
— Client provides analytics account access
— Third-party form/email services remain operational

Invalid assumptions may impact timeline or cost.`,
      },
      {
        heading: "Change Management",
        body: `Scope changes use a formal change order process: written request → impact estimate → written approval → execution.`,
      },
      {
        heading: "Terms",
        body: `**Payment:** 50% deposit, 50% on launch. Invoices due within 15 days.

**IP:** Full ownership transfers upon final payment.

**Warranty:** 14 days post-launch bug fixes.`,
      },
    ],
    quote: {
      tiers: [
        {
          name: "Single Page",
          price: "$2,000 – $4,000",
          description: "One conversion-focused landing page, design + build.",
          features: [
            "1 landing page (10 sections max)",
            "Mobile-responsive design",
            "Contact/lead form with validation",
            "Basic on-page SEO",
            "GA4 + conversion tracking",
            "14 days post-launch support",
          ],
        },
        {
          name: "Campaign Bundle",
          price: "$4,000 – $8,000",
          description: "3 landing page variants for A/B testing or multi-channel campaigns.",
          features: [
            "3 landing pages (variants of same core page)",
            "A/B test structure",
            "Analytics dashboard setup",
            "Copy audit + recommendations",
            "Social proof + testimonial sections",
            "30 days post-launch support",
          ],
        },
        {
          name: "Funnel Package",
          price: "$8,000 – $15,000",
          description: "Full conversion funnel: landing page + thank-you page + email follow-up sequence.",
          features: [
            "Landing page + confirmation page + 3 email templates",
            "Multi-step form or pricing calculator",
            "CRM/email integration",
            "Heatmap + session recording setup",
            "Performance optimization (95+ Lighthouse)",
            "60 days support + 1 round of CRO recommendations",
          ],
        },
      ],
      paymentSchedule: "50% deposit to start, 50% on launch.",
    },
  },

  branding_package: {
    id: "branding_package",
    name: "Branding Package Proposal",
    description: "For brand identity projects: logo, color palette, typography, guidelines, and stationery. Best for new brands or rebrands.",
    category: "branding",
    proposal: [
      {
        heading: "Project Understanding",
        body: `A brand is more than a logo — it's the system that shapes how your audience perceives you.

For {{clientName}}, we understand the goal: {{deliverablesInline}}. We'll build a cohesive brand identity that communicates your values, resonates with your audience, and works everywhere you show up.`,
      },
      {
        heading: "Proposed Solution",
        body: `**Discovery**
— Brand questionnaire and stakeholder interviews
— Competitive landscape and visual audit
— Brand positioning workshop

**Identity Design**
— Logo system: primary mark, secondary mark, icon, wordmark
— Color palette with accessibility-verified combinations
— Typography system: heading + body pairings with usage rules

**Brand System**
— Graphic elements: patterns, icons, imagery style
— Brand guidelines document (print + digital)
— Stationery and template designs`,
      },
      {
        heading: "Deliverables",
        body: `**In Scope:**
{{deliverables}}

**Assets You'll Receive:**
— Logo suite (AI, EPS, SVG, PNG, JPG)
— Color palette document (HEX, RGB, CMYK, Pantone)
— Typography guide with font files or recommendations
— Brand guidelines (20–50 page PDF)
— Business card, letterhead, and email signature designs
— Social media template set`,
      },
      {
        heading: "Expected Outcomes",
        body: `A cohesive brand identity helps you:

— Stand out in a crowded market with a memorable, professional look
— Build trust faster — consistent branding signals reliability to potential clients
— Save time on every future project with clear guidelines and ready-to-use templates
— Charge premium rates backed by a brand that looks the part
— Scale consistently across web, print, social, and presentations`,
      },
      {
        heading: "Timeline",
        body: `Estimated duration: {{timeline}}

**Phases:**
{{milestones}}

Branding projects typically run 4–8 weeks depending on feedback cycles and scope.`,
      },
      {
        heading: "Investment",
        body: `Pricing model: {{pricingModel}}

**Budget:** {{budget}}
**Payment Notes:** {{pricingNotes}}

50% deposit to start. 25% at concept approval. 25% on final delivery.`,
      },
      {
        heading: "Optional Add-Ons",
        body: `Add to any branding package:
— Rush delivery: +25%
— Extra logo concept direction: $800
— Brand naming exploration + trademark screening: $2,500
— Presentation deck template (10 slides): $1,200
— Branded social media content pack (12 posts): $900
— Print collateral design (brochure, flyer, signage): custom quote`,
      },
      {
        heading: "Assumptions & Exclusions",
        body: `**Assumptions:**
{{assumptions}}

**Exclusions:**
{{exclusions}}`,
      },
      {
        heading: "Why Choose Me",
        body: `I don't just design logos — I build brand systems that work across every surface. My process is collaborative: you get multiple directions, honest feedback, and a final system you can actually use without a designer on staff.

— All logo files in every format you'll ever need (AI, EPS, SVG, PNG, JPG)
— Color palette with print and digital values (HEX, RGB, CMYK, Pantone)
— Brand guidelines written in plain English, not designer jargon`,
      },
      {
        heading: "Next Steps",
        body: `1. Accept proposal and submit deposit
2. We'll send a brand questionnaire within 24 hours
3. Discovery session scheduled within 1 week
4. First concepts presented within 2–3 weeks`,
      },
    ],
    sow: [
      {
        heading: "Project Overview",
        body: `This SOW defines the brand identity engagement for {{clientName}}.

**Project:** {{projectType}}
**Objective:** Create a cohesive, scalable brand identity system.`,
      },
      {
        heading: "Scope of Work",
        body: `**In Scope:**
{{deliverables}}

**Phase 1 — Discovery (1–2 weeks)**
— Brand questionnaire and stakeholder interviews
— Visual landscape and competitor audit
— Brand positioning and personality definition
— Mood board and visual direction (3 directions)

**Phase 2 — Concept Development (2–3 weeks)**
— Logo concepts (3 initial directions, 2 refinement rounds on selected)
— Color palette exploration
— Typography pairing and testing
— Preliminary application mockups

**Phase 3 — Refinement & System Build (2–3 weeks)**
— Final logo suite (primary, secondary, icon, wordmark, lockups)
— Color system with accessibility verification
— Typography system with usage rules
— Graphic elements and patterns
— Brand guidelines compilation`,
      },
      {
        heading: "Out of Scope",
        body: `**Explicitly Excluded:**
{{exclusions}}

Additionally:
— Trademark registration or legal clearance (we recommend a trademark attorney)
— Naming or tagline development (available as add-on)
— Website design or development
— Packaging design or production
— Environmental or signage design
— Ongoing brand management or retainer services
— Photography, illustration, or custom icon sets beyond the core brand system
— Print production or vendor coordination`,
      },
      {
        heading: "Deliverables & Acceptance",
        body: `| Deliverable | Format | Acceptance |
|---|---|---|
| Brand strategy brief | PDF | Approved by client |
| Logo concepts (3 directions) | PDF + PNG | Selected direction approved |
| Final logo suite | AI, EPS, SVG, PNG, JPG | All formats open correctly |
| Color palette | PDF + ASE | Colors verified across print/digital |
| Typography system | PDF | Font files delivered or recommended |
| Brand guidelines | PDF (20–50 pages) | Complete, no factual errors |
| Stationery designs | AI + PDF | Layouts approved |
| Social templates | AI + PNG | Approved |`,
      },
      {
        heading: "Timeline & Milestones",
        body: `**Overall Timeline:** {{timeline}}

**Milestones:**
{{milestones}}

Review windows: 5 business days per round. Delays in feedback extend the timeline.`,
      },
      {
        heading: "Assumptions & Dependencies",
        body: `**Assumptions:**
{{assumptions}}

**Dependencies:**
— Client provides existing brand assets and access to stakeholders within 3 business days
— Client designates a single decision-maker for approvals
— Client reviews within the 5-business-day window`,
      },
      {
        heading: "Change Management",
        body: `Additional concepts, extra revision rounds, or new deliverables outside the defined scope require a written change order with impact estimate and signed approval.`,
      },
      {
        heading: "Terms",
        body: `**Payment:** 50% deposit, 25% at concept approval, 25% on final delivery.

**IP:** Full ownership transfers to client upon final payment. Agency retains portfolio display rights.

**Cancellation:** 14 days written notice. Completed work invoiced. Deposit non-refundable.

**Font Licensing:** Client is responsible for purchasing commercial font licenses if required.`,
      },
    ],
    quote: {
      tiers: [
        {
          name: "Essentials",
          price: "$2,500 – $5,000",
          description: "Essential brand identity for early-stage businesses.",
          features: [
            "Logo (2–3 concepts, 2 revision rounds)",
            "Color palette (primary + secondary)",
            "Typography recommendations",
            "Basic brand guidelines (10–15 pages)",
            "Business card + letterhead design",
            "Final files in AI, EPS, SVG, PNG",
          ],
        },
        {
          name: "Growth",
          price: "$5,000 – $12,000",
          description: "Complete brand identity for growing businesses and competitive markets.",
          features: [
            "Logo system (5+ concepts, 3 revision rounds)",
            "Full color system with accessibility testing",
            "Typography system (heading + body pairings)",
            "Brand guidelines (25–40 pages)",
            "Stationery suite (card, letterhead, envelope, email sig)",
            "Social media template pack (6 templates)",
            "Brand pattern / graphic element",
            "Favicon and web assets",
          ],
        },
        {
          name: "Authority",
          price: "$12,000 – $25,000",
          description: "Comprehensive brand platform for established companies and rebrands.",
          features: [
            "Brand strategy workshop + stakeholder interviews",
            "Competitive audit + positioning recommendations",
            "Complete logo and identity system",
            "Verbal identity: messaging, voice, tagline options",
            "Comprehensive brand guidelines (50–80 pages)",
            "Full stationery + presentation deck template",
            "Brand collateral (brochure, one-pager, signage)",
            "Brand rollout consultation + 3 months support",
          ],
        },
      ],
      paymentSchedule: "50% deposit, 25% at concept approval, 25% on final delivery.",
    },
  },

  monthly_retainer: {
    id: "monthly_retainer",
    name: "Monthly Retainer Proposal",
    description: "For ongoing website maintenance, support, updates, and optimization. Subscription-based recurring revenue.",
    category: "monthly retainer",
    proposal: [
      {
        heading: "Overview",
        body: `This proposal outlines an ongoing support and maintenance retainer for {{clientName}}.

Instead of scrambling when something breaks or queuing up for ad-hoc work, a retainer gives you predictable access to our team, faster turnaround, and a website that stays secure, fast, and up to date — every month.`,
      },
      {
        heading: "What's Included",
        body: `**Core Services:**
{{deliverables}}

**Monthly Commitments:**
— Scheduled maintenance windows (no surprise downtime)
— Proactive monitoring: uptime, performance, security
— Monthly report: what was done, what's ahead, key metrics
— Priority support queue: retainer clients jump the line

**Also Included:**
— CMS, plugin, and framework updates
— Security patches and vulnerability scans
— Daily backups with verified restore
— Minor content and design updates (within monthly hours)
— Performance monitoring and optimization
— Monthly analytics summary`,
      },
      {
        heading: "Expected Outcomes",
        body: `With ongoing maintenance and support, you can expect:

— Peace of mind: your site is monitored, backed up, and secure 24/7
— Faster fixes: no waiting weeks for a freelancer to become available
— Steady improvements: small optimizations each month compound over time
— Predictable costs: no surprise emergency bills when something breaks
— A partner who knows your stack and can move fast when you need it`,
      },
      {
        heading: "How It Works",
        body: `1. **Onboarding call** — We review your current setup, access requirements, and priorities
2. **Monthly allocation** — Your plan includes a set number of hours per month for updates and improvements
3. **Request via email or portal** — Send requests anytime; we triage and schedule within 1 business day
4. **Monthly report** — Summary of all work completed, site health metrics, and recommendations

You always know what's happening with your site. No black boxes.`,
      },
      {
        heading: "Timeline & Term",
        body: `**Duration:** {{timeline}}

**Commitment:** Month-to-month after an initial 3-month term. Cancel anytime with 30 days notice after the initial term.

**Onboarding:** 1–2 weeks to audit the current site, set up monitoring, and establish access.`,
      },
      {
        heading: "Investment",
        body: `Pricing model: {{pricingModel}}

**Monthly Investment:** {{budget}}
**Details:** {{pricingNotes}}

Invoiced on the 1st of each month. Net 15.`,
      },
      {
        heading: "Optional Add-Ons",
        body: `Extend your retainer with:
— Emergency after-hours support: +$150/incident
— Additional monthly hours (billed at $95/hr in blocks of 5)
— Quarterly SEO audit + recommendations report: $600
— Dedicated staging environment: +$100/mo
— Monthly content strategy call + editorial calendar: $400/mo`,
      },
      {
        heading: "Assumptions & Boundaries",
        body: `**Assumptions:**
{{assumptions}}

**What's NOT covered (separate scoping required):**
{{exclusions}}

New projects (full redesigns, new feature builds, new websites) are scoped and quoted separately.`,
      },
      {
        heading: "Why Choose Me",
        body: `— **Predictable budget** — no surprise invoices for urgent fixes
— **Faster turnaround** — retainer clients get priority, typically same or next business day
— **Proactive, not reactive** — I catch issues before they become problems
— **Relationship, not transaction** — I learn your business, your stack, your preferences
— **Direct access** — you message me, I fix it. No ticket systems, no runaround`,
      },
      {
        heading: "Next Steps",
        body: `1. Select your plan tier below
2. Sign the agreement
3. We'll schedule an onboarding call within 3 business days
4. Monitoring and support begin immediately after onboarding`,
      },
    ],
    sow: [
      {
        heading: "Service Overview",
        body: `This Statement of Work defines the ongoing support and maintenance services for {{clientName}}.

**Engagement Type:** Monthly retainer
**Initial Term:** {{timeline}} (month-to-month thereafter)`,
      },
      {
        heading: "Scope of Services",
        body: `**Core Services:**
{{deliverables}}

**Monthly Allocation:**
— Up to the hours included in your plan tier for support and updates
— Unused hours do NOT roll over to the next month
— Overages are billed at the agreed hourly rate with prior approval

**Response Times:**
— Critical (site down, security breach): response within 4 business hours
— High (broken feature, form, or checkout): response within 1 business day
— Medium (content update, minor change): response within 2 business days
— Low (cosmetic, nice-to-have): scheduled in next sprint`,
      },
      {
        heading: "Out of Scope",
        body: `The following are NOT covered by the monthly retainer and require separate scoping:
{{exclusions}}

Additionally:
— New website builds or full redesigns
— Major feature development (new custom functionality)
— Third-party API integrations (unless maintenance of existing)
— Copywriting or content strategy
— SEO audits, keyword research, or paid advertising management
— Server procurement, migration to new host, or infrastructure changes
— Emergency after-hours support (available at premium rate)`,
      },
      {
        heading: "Service Levels",
        body: `| Severity | Definition | Response | Resolution Target |
|---|---|---|---|
| Critical | Site down, security breach, data loss | 2 hours | 4 hours |
| High | Broken feature, form, checkout, or key integration | 4 hours | 1 business day |
| Medium | Content update, layout fix, minor change | 1 business day | 3 business days |
| Low | Cosmetic, enhancement, nice-to-have | 3 business days | Next sprint |

Response time = we acknowledge and begin work. Resolution time = fix deployed.`,
      },
      {
        heading: "Assumptions & Dependencies",
        body: `**Assumptions:**
{{assumptions}}

**Client Dependencies:**
— Client provides all necessary access credentials within the first week
— Client designates a primary contact for requests and approvals
— Client notifies us of any third-party service changes (hosting, DNS, plugins)`,
      },
      {
        heading: "Reporting",
        body: `Each month you'll receive:
— Summary of all completed work (tickets, hours, outcomes)
— Site health dashboard (uptime, performance scores, security status)
— Recommendations for next month (priority items, risks, opportunities)

Quarterly: strategy call to review goals and plan upcoming work.`,
      },
      {
        heading: "Terms",
        body: `**Billing:** Invoiced on the 1st of each month. Net 15.

**Initial Term:** 3 months minimum. Month-to-month thereafter.

**Cancellation:** 30 days written notice after the initial term.

**Overages:** Any work exceeding the monthly hour allocation is billed at the standard hourly rate with prior written approval.

**Confidentiality:** All client data, credentials, and business information are treated as confidential.

**IP:** Work produced during the retainer belongs to the client upon payment.`,
      },
    ],
    quote: {
      tiers: [
        {
          name: "Basic",
          price: "$199 – $399 / month",
          description: "Essential maintenance for small websites that just need to stay secure and online.",
          features: [
            "2 hours of updates/support per month",
            "WordPress/core/plugin updates",
            "Security monitoring + malware scanning",
            "Daily backups with verified restore",
            "Uptime monitoring",
            "Monthly health report",
            "Response within 1 business day",
          ],
        },
        {
          name: "Growth",
          price: "$399 – $799 / month",
          description: "Active support for growing businesses that regularly update their site.",
          features: [
            "5 hours of updates/support per month",
            "Everything in Basic, plus:",
            "Performance optimization (monthly audit)",
            "Content updates (text, images, layout changes)",
            "Broken link/form/button fixes",
            "Priority response (within 4 hours)",
            "Quarterly strategy call",
            "Staging environment for testing changes",
          ],
        },
        {
          name: "Authority",
          price: "$799 – $1,500+ / month",
          description: "Full-service partnership for businesses that treat their website as a growth asset.",
          features: [
            "10+ hours of updates/support per month",
            "Everything in Standard, plus:",
            "Dedicated development hours for improvements",
            "A/B testing and CRO support",
            "SEO monitoring + monthly recommendations",
            "Critical response within 2 hours",
            "Monthly strategy call + roadmap planning",
            "Unlimited content updates within hour cap",
          ],
        },
      ],
      paymentSchedule:
        "Invoiced monthly on the 1st. Initial 3-month commitment, then month-to-month. 30-day cancellation notice.",
    },
  },
};

export function getTemplate(id: string): Template | undefined {
  return templates[id];
}

export function getTemplateByCategory(category: string): Template | undefined {
  return Object.values(templates).find((t) => t.category === category);
}

export function listTemplates(): Template[] {
  return Object.values(templates);
}

export { templates };
