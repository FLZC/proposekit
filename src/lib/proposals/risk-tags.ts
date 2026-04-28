import type { StructuredScope } from "./types";

export function getScopeRiskTags(scope: StructuredScope): string[] {
  const tags: string[] = [];

  if (scope.exclusions.length === 0) tags.push("Exclusions are missing");
  if (!scope.timeline) tags.push("Timeline is missing");
  if (!scope.pricingModel) tags.push("Pricing structure is unclear");
  if (scope.deliverables.some((item) => item.split(" ").length < 2)) tags.push("Deliverables may be too vague");

  return tags;
}
