import clapperboard from 'lucide-static/icons/clapperboard.svg?raw';
import monitor from 'lucide-static/icons/monitor.svg?raw';
import megaphone from 'lucide-static/icons/megaphone.svg?raw';
import compass from 'lucide-static/icons/compass.svg?raw';
import target from 'lucide-static/icons/target.svg?raw';
import penLine from 'lucide-static/icons/pen-line.svg?raw';
import lightbulb from 'lucide-static/icons/lightbulb.svg?raw';
import workflow from 'lucide-static/icons/workflow.svg?raw';
import search from 'lucide-static/icons/search.svg?raw';
import route from 'lucide-static/icons/route.svg?raw';
import hammer from 'lucide-static/icons/hammer.svg?raw';
import trendingUp from 'lucide-static/icons/trending-up.svg?raw';
import mail from 'lucide-static/icons/mail.svg?raw';
import messageCircle from 'lucide-static/icons/message-circle.svg?raw';
import idCard from 'lucide-static/icons/id-card.svg?raw';
import signalLow from 'lucide-static/icons/signal-low.svg?raw';
import signalMedium from 'lucide-static/icons/signal-medium.svg?raw';
import signalHigh from 'lucide-static/icons/signal-high.svg?raw';
import settings2 from 'lucide-static/icons/settings-2.svg?raw';

/**
 * Lucide's raw SVG source, inlined at build time. lucide-static ships files,
 * not a runtime, so an icon costs one `<svg>` in the HTML and no client JS.
 *
 * Only the icons the site actually uses are registered. That keeps the union
 * small enough to be useful — a wrong name is a type error, not a blank space
 * discovered in review.
 */
const sources = {
  clapperboard,
  monitor,
  megaphone,
  compass,
  target,
  'pen-line': penLine,
  lightbulb,
  workflow,
  search,
  route,
  hammer,
  'trending-up': trendingUp,
  mail,
  'message-circle': messageCircle,
  // Lucide dropped its brand icons, so LinkedIn has no mark of its own. The
  // profile-card glyph is the closest thin-line stand-in; swap it if a
  // licensed brand SVG is ever added to src/assets.
  'id-card': idCard,
  'signal-low': signalLow,
  'signal-medium': signalMedium,
  'signal-high': signalHigh,
  'settings-2': settings2,
} as const;

export type IconName = keyof typeof sources;

const INNER = /<svg[^>]*>([\s\S]*)<\/svg>/;

/**
 * The shapes inside a lucide file, without its `<svg>` wrapper — Icon.astro
 * supplies its own so size, stroke weight and colour come from our tokens
 * rather than lucide's hardcoded 24px / stroke-width 2.
 */
export function iconBody(name: IconName): string {
  const body = sources[name].match(INNER)?.[1];
  if (!body) throw new Error(`Malformed lucide source for icon: ${name}`);
  return body.trim();
}
