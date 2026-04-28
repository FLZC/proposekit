import type { DocumentSection } from "@/lib/proposals/document-sections";

export function applyRegeneratedSection(
  original: { deliverables: string; timeline: string; pricing: string; assumptionsExclusions: string },
  section: DocumentSection,
  replacement: string,
) {
  if (section === "deliverables") return { ...original, deliverables: replacement };
  if (section === "timeline") return { ...original, timeline: replacement };
  if (section === "pricing") return { ...original, pricing: replacement };
  return { ...original, assumptionsExclusions: replacement };
}
