import type { ServiceSlug } from '../data/services';
import type { IconName } from './icons';

/**
 * One thin-line mark per service. Kept out of data/services.ts on purpose:
 * the contact endpoint imports that module, and it has no use for 19 inlined
 * SVG strings in its serverless bundle.
 */
export const serviceIcons: Record<ServiceSlug, IconName> = {
  'video-editing': 'clapperboard',
  'web-development': 'monitor',
  'paid-advertising': 'megaphone',
  'brand-positioning': 'compass',
  'marketing-strategy': 'target',
  'content-strategy': 'pen-line',
  'business-consultation': 'lightbulb',
  'digital-solutions': 'workflow',
};

/**
 * Tier header marks. Ranked tiers climb an ascending signal; a quoted tier
 * gets the settings glyph instead, because it is not a rung on that ladder.
 * `rank` counts only the ranked tiers before it, so a service whose list
 * starts with a custom tier still begins its ladder at the bottom.
 */
export function tierIcon(isCustom: boolean, rank: number): IconName {
  if (isCustom) return 'settings-2';
  if (rank === 0) return 'signal-low';
  return rank === 1 ? 'signal-medium' : 'signal-high';
}
