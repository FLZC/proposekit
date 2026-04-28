export type TemplateId =
  | "web_design"
  | "website_development"
  | "landing_page"
  | "branding_package"
  | "monthly_retainer";

export type TemplateSection = {
  heading: string;
  body: string;
};

export type PricingTier = {
  name: string;
  price: string;
  description: string;
  features: string[];
};

export type Template = {
  id: TemplateId;
  name: string;
  description: string;
  category: string;
  proposal: TemplateSection[];
  sow: TemplateSection[];
  quote: {
    tiers: PricingTier[];
    paymentSchedule: string;
  };
};
