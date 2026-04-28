export type PricingModel = "fixed_price" | "milestone" | "three_tier" | "";

export type StructuredScope = {
  deliverables: string[];
  assumptions: string[];
  exclusions: string[];
  timeline: string;
  milestones: string[];
  pricingModel: PricingModel;
  pricingNotes: string;
  optionalBudget?: string;
  optionalTargetTimeline?: string;
  extractionNotes?: string;
};
