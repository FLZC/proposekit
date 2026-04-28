import type { StructuredScope } from "@/lib/proposals/types";
import { getTemplateByCategory, getTemplate } from "@/lib/templates/templates";
import { renderDocuments } from "@/lib/templates/render";
import type { Template } from "@/lib/templates/types";

export function buildDocumentContext(scope: StructuredScope) {
  return JSON.stringify(scope, null, 2);
}

export function pickTemplate(projectType?: string, serviceCategory?: string): Template | undefined {
  const byCategory = getTemplateByCategory(serviceCategory ?? "");
  if (byCategory) return byCategory;

  const byType = getTemplateByCategory(projectType ?? "");
  if (byType) return byType;

  return getTemplate("website_development");
}

export function generateStaticDocumentDrafts(
  scope: StructuredScope,
  template?: Template,
) {
  return renderDocuments(template ?? getTemplate("website_development")!, {
    clientName: "Client",
    projectType: "Website Project",
    scope,
  });
}
