export const documentSections = ["deliverables", "timeline", "pricing", "assumptions_exclusions"] as const;

export type DocumentSection = (typeof documentSections)[number];
