/**
 * Enums shared by the content schemas (src/content.config.ts), the filter UIs
 * and services.ts. Adding a value here is the only edit needed to add a filter.
 */

export const workCategories = ['web', 'marketing', 'creative', 'solutions'] as const;
export type WorkCategory = (typeof workCategories)[number];

// Displayed on the /work filter bar and each case study eyebrow.
export const workCategoryLabels: Record<WorkCategory, string> = {
  web: 'Web',
  marketing: 'Marketing',
  creative: 'Creative',
  solutions: 'Solutions',
};

export const insightTags = [
  'marketing',
  'sales',
  'positioning',
  'growth',
  'digital',
  'content',
  'technology',
  'execution',
] as const;
export type InsightTag = (typeof insightTags)[number];

// Displayed on the /insights filter bar and post tag chips.
export const insightTagLabels: Record<InsightTag, string> = {
  marketing: 'Marketing',
  sales: 'Sales',
  positioning: 'Positioning',
  growth: 'Growth',
  digital: 'Digital',
  content: 'Content',
  technology: 'Technology',
  execution: 'Execution',
};
