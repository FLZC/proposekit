import type { StructuredScope } from "@/lib/proposals/types";
import type { Template, TemplateSection } from "./types";

export type TemplateContext = {
  clientName: string;
  projectType: string;
  scope: StructuredScope;
};

const CATEGORY_DEFAULTS: Record<string, { deliverables: string[]; description: string }> = {
  "web design": {
    deliverables: ["Website redesign", "UI/UX design", "Responsive layouts", "Design system documentation"],
    description: "a website redesign with modern UI/UX",
  },
  "web development": {
    deliverables: ["Custom website development", "CMS integration", "Responsive frontend", "Backend API"],
    description: "a full-stack website build",
  },
  "landing page": {
    deliverables: ["Conversion-optimized landing page", "Mobile-responsive design", "Form implementation", "Analytics setup"],
    description: "a high-converting landing page",
  },
  branding: {
    deliverables: ["Logo design", "Color palette", "Typography system", "Brand guidelines"],
    description: "a complete brand identity system",
  },
  "monthly retainer": {
    deliverables: ["Website maintenance and updates", "Security monitoring", "Performance optimization", "Content updates"],
    description: "ongoing website maintenance and support",
  },
};

const PROJECT_TYPE_LABELS: Record<string, string> = {
  web_design: "Web Design",
  website_development: "Website Development",
  landing_page: "Landing Page",
  branding_package: "Branding Package",
  monthly_retainer: "Monthly Retainer",
};

export function projectTypeLabel(slug: string): string {
  return PROJECT_TYPE_LABELS[slug] ?? slug;
}

function fill(template: string, ctx: TemplateContext, category = ""): string {
  const def = CATEGORY_DEFAULTS[category];
  const defaultDesc = def?.description ?? "a custom project";
  const defaultDels = def?.deliverables ?? [];
  const dels = ctx.scope.deliverables.length > 0 ? ctx.scope.deliverables : defaultDels;

  return template
    .replace(/\{\{clientName\}\}/g, ctx.clientName)
    .replace(/\{\{projectType\}\}/g, projectTypeLabel(ctx.projectType))
    .replace(/\{\{deliverables\}\}/g, dels.map((d) => `— ${d}`).join("\n"))
    .replace(/\{\{deliverablesInline\}\}/g, ctx.scope.deliverables.length > 0 ? ctx.scope.deliverables.join(", ") : defaultDesc)
    .replace(/\{\{timeline\}\}/g, ctx.scope.timeline || "To be determined")
    .replace(/\{\{milestones\}\}/g, ctx.scope.milestones.map((m) => `— ${m}`).join("\n") || "— To be scheduled at kickoff")
    .replace(/\{\{assumptions\}\}/g, ctx.scope.assumptions.map((a) => `— ${a}`).join("\n") || "— Client provides necessary materials and timely feedback")
    .replace(/\{\{exclusions\}\}/g, ctx.scope.exclusions.map((e) => `— ${e}`).join("\n") || "— No additional exclusions beyond those stated above")
    .replace(/\{\{pricingModel\}\}/g, ctx.scope.pricingModel || "fixed_price")
    .replace(/\{\{pricingNotes\}\}/g, ctx.scope.pricingNotes || "Contact for pricing details")
    .replace(/\{\{budget\}\}/g, ctx.scope.optionalBudget || ctx.scope.pricingNotes || "Not specified")
    .replace(/\{\{packagingExclusion\}\}/g, dels.some((d) => d.toLowerCase().includes("packaging")) ? "" : "— Packaging design or production\n")
    .replace(/\{\{#ifNot\s+clientProvidesDesign\}\}([\s\S]*?)\{\{\/ifNot\}\}/g, (_, content) => ctx.scope.clientProvidesDesign ? "" : content);
}

export function renderSection(section: TemplateSection, ctx: TemplateContext, category = ""): TemplateSection {
  return {
    heading: fill(section.heading, ctx, category),
    body: fill(section.body, ctx, category),
  };
}

export function renderProposal(template: Template, ctx: TemplateContext): { title: string; body: string } {
  const filled = template.proposal.map((s) => renderSection(s, ctx, template.category));
  return {
    title: `${projectTypeLabel(ctx.projectType)} Proposal — ${ctx.clientName}`,
    body: filled.map((s) => `## ${s.heading}\n\n${s.body}`).join("\n\n"),
  };
}

export function renderSOW(template: Template, ctx: TemplateContext): { title: string; body: string } {
  const filled = template.sow.map((s) => renderSection(s, ctx, template.category));
  return {
    title: `Scope of Work — ${ctx.clientName}`,
    body: filled.map((s) => `## ${s.heading}\n\n${s.body}`).join("\n\n"),
  };
}

function parseFirstDollarAmount(s: string): number | undefined {
  const m = s.match(/\$([\d,]+)\s*(?:[Kk])?/);
  if (!m) return undefined;
  let n = parseInt(m[1].replace(/,/g, ""), 10);
  if (/[Kk]/.test(m[0])) n *= 1000;
  return n;
}

function findRecommendedTier(
  budget: string | undefined,
  tiers: { name: string; price: string }[],
): string | undefined {
  const amount = budget ? parseFirstDollarAmount(budget) : undefined;
  if (amount === undefined || tiers.length === 0) return undefined;

  // Check which tier's price range contains the budget amount
  for (const tier of tiers) {
    const lo = parseFirstDollarAmount(tier.price);
    const hiMatch = tier.price.match(/\$([\d,]+)[Kk]?\s*\+?$/);
    const hi = hiMatch
      ? parseInt(hiMatch[1].replace(/,/g, ""), 10) * (/[Kk]/.test(hiMatch[0]) ? 1000 : 1)
      : lo;
    if (lo !== undefined && amount >= lo && (hi === undefined || hi === lo || amount <= hi)) {
      return tier.name;
    }
  }
  return undefined;
}

export function renderQuote(template: Template, ctx: TemplateContext): { title: string; body: string } {
  const budget = ctx.scope.optionalBudget || ctx.scope.pricingNotes;
  const recommended = findRecommendedTier(budget, template.quote.tiers);

  const tiers = template.quote.tiers.map((t) => {
    const marker = t.name === recommended ? " ★ Recommended" : "";
    return `### ${t.name}${marker}\n${t.price}\n${t.description}\n${t.features.map((f) => `— ${f}`).join("\n")}`;
  });
  return {
    title: `Quote — ${ctx.clientName}`,
    body: `${tiers.join("\n\n")}\n\n**Payment Schedule:** ${template.quote.paymentSchedule}`,
  };
}

export function renderDocuments(
  template: Template,
  ctx: TemplateContext,
): {
  proposal: { title: string; body: string };
  sow: { title: string; body: string };
  quote: { title: string; body: string };
} {
  return {
    proposal: renderProposal(template, ctx),
    sow: renderSOW(template, ctx),
    quote: renderQuote(template, ctx),
  };
}
