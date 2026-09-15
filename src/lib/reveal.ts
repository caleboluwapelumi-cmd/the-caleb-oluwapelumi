/**
 * Scroll reveal. Elements marked [data-reveal] fade up once as they enter the
 * viewport; children of [data-reveal-stagger] are marked and staggered here.
 *
 * The hidden state is scoped to html.reveal-ready, which only this script
 * adds — so with JS off, reduced motion on, or no IntersectionObserver,
 * everything simply stays visible.
 */

const READY = 'reveal-ready';
const REVEALED = 'is-revealed';
let observer: IntersectionObserver | null = null;

function canAnimate(): boolean {
  return (
    'IntersectionObserver' in window &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function initReveal(): void {
  observer?.disconnect();
  observer = null;
  if (!canAnimate()) {
    document.documentElement.classList.remove(READY);
    return;
  }

  document.querySelectorAll<HTMLElement>('[data-reveal-stagger]').forEach((group) => {
    Array.from(group.children).forEach((child, i) => {
      if (!(child instanceof HTMLElement)) return;
      child.setAttribute('data-reveal', '');
      child.style.setProperty('--reveal-index', String(i));
    });
  });

  const targets = document.querySelectorAll<HTMLElement>(`[data-reveal]:not(.${REVEALED})`);
  // Anything already on screen (short page, anchor jump, restored scroll) is
  // marked revealed before the hidden state exists, so it never flashes out.
  const fold = window.innerHeight * 0.88;
  targets.forEach((el) => {
    if (el.getBoundingClientRect().top < fold) el.classList.add(REVEALED);
  });

  observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add(REVEALED);
        obs.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.1 },
  );
  targets.forEach((el) => {
    if (!el.classList.contains(REVEALED)) observer?.observe(el);
  });
  document.documentElement.classList.add(READY);
}
