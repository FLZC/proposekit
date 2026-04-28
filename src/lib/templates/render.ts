import type { StructuredScope } from "@/lib/proposals/types";
import type { Template, TemplateSection } from "./types";

export type TemplateContext = {
  clientName: string;
  projectType: string;
  scope: StructuredScope;
};

function fill(template: string, ctx: TemplateContext): string {
  return template
    .replace(/\{\{clientName\}\}/g, ctx.clientName)
    .replace(/\{\{projectType\}\}/g, ctx.projectType)
    .replace(/\{\{deliverables\}\}/g, ctx.scope.deliverables.map((d) => `— ${d}`).join("\n"))
    .replace(/\{\{deliverablesInline\}\}/g, ctx.scope.deliverables.join(", "))
    .replace(/\{\{timeline\}\}/g, ctx.scope.timeline || "To be determined")
    .replace(/\{\{milestones\}\}/g, ctx.scope.milestones.map((m) => `— ${m}`).join("\n") || "— Milestones to be defined")
    .replace(/\{\{assumptions\}\}/g, ctx.scope.assumptions.map((a) => `— ${a}`).join("\n") || "— Client provides necessary materials and timely feedback")
    .replace(/\{\{exclusions\}\}/g, ctx.scope.exclusions.map((e) => `— ${e}`).join("\n") || "— None explicitly listed")
    .replace(/\{\{pricingModel\}\}/g, ctx.scope.pricingModel || "fixed_price")
    .replace(/\{\{pricingNotes\}\}/g, ctx.scope.pricingNotes || "Contact for pricing details")
    .replace(/\{\{budget\}\}/g, ctx.scope.optionalBudget || ctx.scope.pricingNotes || "Not specified");
}

export function renderSection(section: TemplateSection, ctx: TemplateContext): TemplateSection {
  return {
    heading: fill(section.heading, ctx),
    body: fill(section.body, ctx),
  };
}

const DISCLAIMER = `\n\n---\n\n**Disclaimer:** This document was generated with AI assistance and is a starting point only. It does not constitute legal, financial, or professional advice. Review all content carefully before sending to clients. Pricing figures are illustrative estimates — adjust to match your actual rates. For legally binding contracts, consult a qualified attorney. ProposalCraft is not a law firm and assumes no liability for the use of these templates.`;

export function renderProposal(template: Template, ctx: TemplateContext): { title: string; body: string } {
  const filled = template.proposal.map((s) => renderSection(s, ctx));
  return {
    title: `${ctx.projectType} Proposal — ${ctx.clientName}`,
    body: filled.map((s) => `## ${s.heading}\n\n${s.body}`).join("\n\n") + DISCLAIMER,
  };
}

export function renderSOW(template: Template, ctx: TemplateContext): { title: string; body: string } {
  const filled = template.sow.map((s) => renderSection(s, ctx));
  return {
    title: `Scope of Work — ${ctx.clientName}`,
    body: filled.map((s) => `## ${s.heading}\n\n${s.body}`).join("\n\n") + DISCLAIMER,
  };
}

export function renderQuote(template: Template, ctx: TemplateContext): { title: string; body: string } {
  const tiers = template.quote.tiers.map((t) => `### ${t.name}\n${t.price}\n${t.description}\n${t.features.map((f) => `— ${f}`).join("\n")}`);
  return {
    title: `Quote — ${ctx.clientName}`,
    body: `${tiers.join("\n\n")}\n\n**Payment Schedule:** ${template.quote.paymentSchedule}${DISCLAIMER}`,
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
