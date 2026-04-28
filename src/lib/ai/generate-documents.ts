import type { StructuredScope } from "@/lib/proposals/types";
import { getTemplateByCategory, getTemplate } from "@/lib/templates/templates";
import { renderDocuments } from "@/lib/templates/render";
import type { Template } from "@/lib/templates/types";

export function buildDocumentContext(scope: StructuredScope) {
  return JSON.stringify(scope, null, 2);
}

function fuzzyMatch(input: string, candidates: string[]): string | undefined {
  const normalized = input.toLowerCase().trim();
  if (candidates.includes(normalized)) return normalized;

  for (const c of candidates) {
    if (normalized.includes(c) || c.includes(normalized)) return c;
  }
  return undefined;
}

const CATEGORIES = ["web design", "web development", "landing page", "branding", "monthly retainer"];

export function pickTemplate(projectType?: string, serviceCategory?: string): Template | undefined {
  const match = fuzzyMatch(serviceCategory ?? "", CATEGORIES) ?? fuzzyMatch(projectType ?? "", CATEGORIES);

  if (match) return getTemplateByCategory(match);

  if ((projectType ?? "").toLowerCase().includes("design")) return getTemplate("web_design");
  if ((projectType ?? "").toLowerCase().includes("landing")) return getTemplate("landing_page");
  if ((projectType ?? "").toLowerCase().includes("brand")) return getTemplate("branding_package");
  if ((projectType ?? "").toLowerCase().includes("retainer") || (projectType ?? "").toLowerCase().includes("maintenance")) {
    return getTemplate("monthly_retainer");
  }

  return getTemplate("website_development");
}

export function generateStaticDocumentDrafts(
  scope: StructuredScope,
  template?: Template,
  clientName = "Client",
  projectType = "Website Project",
) {
  return renderDocuments(template ?? getTemplate("website_development")!, {
    clientName,
    projectType,
    scope,
  });
}
