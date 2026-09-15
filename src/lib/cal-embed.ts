/**
 * Lazy Cal.com inline embed. The panel ships as a plain link to the booking
 * page; Cal's script is only injected when the panel nears the viewport or the
 * visitor asks for the calendar, keeping a third-party script out of LCP.
 */

type CalFn = ((...args: unknown[]) => void) & { q?: unknown[][]; ns?: Record<string, unknown>; loaded?: boolean };

declare global {
  interface Window {
    Cal?: CalFn;
  }
}

const EMBED_SRC = 'https://app.cal.com/embed/embed.js';
let observer: IntersectionObserver | null = null;

/** Cal's documented queue stub: calls made before embed.js loads are replayed. */
function ensureCal(): CalFn {
  if (window.Cal) return window.Cal;
  const cal: CalFn = (...args: unknown[]) => {
    cal.q?.push(args);
  };
  cal.q = [];
  cal.ns = {};
  cal.loaded = true;
  window.Cal = cal;
  const script = document.createElement('script');
  script.src = EMBED_SRC;
  script.async = true;
  document.head.append(script);
  return cal;
}

function mount(panel: HTMLElement): void {
  const target = panel.querySelector<HTMLElement>('[data-cal-embed]');
  const calLink = panel.dataset.calLink;
  if (!target || !calLink || target.dataset.mounted) return;
  target.dataset.mounted = 'true';
  target.hidden = false;
  panel.querySelector<HTMLElement>('[data-cal-show]')?.setAttribute('hidden', '');

  // Cal injects its iframe without a title; screen readers need one.
  const title = panel.dataset.calTitle ?? 'Booking calendar';
  new MutationObserver((_, mo) => {
    const iframe = target.querySelector('iframe');
    if (!iframe) return;
    iframe.title = title;
    mo.disconnect();
  }).observe(target, { childList: true, subtree: true });

  const cal = ensureCal();
  cal('init', { origin: 'https://cal.com' });
  cal('inline', { elementOrSelector: target, calLink, config: { layout: 'month_view' } });
}

export function initCalEmbed(): void {
  observer?.disconnect();
  observer = null;

  const panel = document.querySelector<HTMLElement>('[data-cal-panel]');
  const calLink = panel?.dataset.calLink;
  // Until a real Cal.com link is configured, the static link is all there is.
  if (!panel || !calLink || /todo/i.test(calLink)) return;

  const button = panel.querySelector<HTMLButtonElement>('[data-cal-show]');
  if (button) {
    button.hidden = false;
    button.addEventListener('click', () => mount(panel), { once: true });
  }

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      ([entry], obs) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        mount(panel);
      },
      { rootMargin: '200px 0px' },
    );
    observer.observe(panel);
  }
}
