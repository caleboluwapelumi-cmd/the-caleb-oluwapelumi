import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import Lenis from 'lenis';

/**
 * Scroll motion: Lenis for the scroll itself, GSAP ScrollTrigger for reveals
 * and parallax.
 *
 * Two rules shape everything below.
 *
 * 1. Reduced motion is a hard stop, not a softer setting. Every builder opens
 *    with the same guard, Lenis is never constructed, and Base.astro does not
 *    even fetch this module — so a user who asked for less motion downloads
 *    none of this code.
 *
 * 2. Nothing above the fold animates. Revealing hero-adjacent content delays
 *    LCP, so anything already on screen when a page initialises is marked
 *    revealed outright and never gets a tween.
 *
 * The hidden state lives in CSS under html.reveal-ready, and only this module
 * adds that class. If the import fails, the class is never added and the page
 * is simply visible — the failure mode is "no animation", never "no content".
 */

gsap.registerPlugin(ScrollTrigger, CustomEase);

const READY = 'reveal-ready';
const REVEALED = 'is-revealed';
const REDUCE = '(prefers-reduced-motion: reduce)';

/** The single guard. Every tween in this file sits behind it. */
export const prefersReducedMotion = (): boolean => window.matchMedia(REDUCE).matches;

/* -------------------------------------------------------------------------
   Tokens. Durations and easing are theme values like every colour, so they
   are read from the @theme block at runtime rather than copied into JS.
------------------------------------------------------------------------- */

const rootStyle = () => getComputedStyle(document.documentElement);

/** '420ms' or '0.42s' -> seconds, which is the unit GSAP wants. */
function seconds(token: string, fallback: number): number {
  const raw = rootStyle().getPropertyValue(token).trim();
  const match = /^([\d.]+)(ms|s)$/.exec(raw);
  if (!match) return fallback;
  const value = Number(match[1]);
  if (!Number.isFinite(value)) return fallback;
  return match[2] === 'ms' ? value / 1000 : value;
}

const EASE_ID = 'theme-out-expo';
let easeReady = false;

/** --ease-out-expo, translated into a GSAP ease so both animators match. */
function themeEase(): string {
  if (easeReady) return EASE_ID;
  const points = rootStyle().getPropertyValue('--ease-out-expo').match(/-?[\d.]+/g);
  if (!points || points.length < 4) return 'power3.out';
  CustomEase.create(EASE_ID, `M0,0 C${points[0]},${points[1]} ${points[2]},${points[3]} 1,1`);
  easeReady = true;
  return EASE_ID;
}

/* -------------------------------------------------------------------------
   Lenis
------------------------------------------------------------------------- */

let lenis: Lenis | null = null;
let tick: ((time: number) => void) | null = null;

function startLenis(): void {
  // Reduced motion gets the browser's own scroll. That is not a taste call —
  // a hijacked scroll is precisely the motion the setting asks to be spared.
  if (prefersReducedMotion()) return;

  lenis = new Lenis({ duration: seconds('--dur-slow', 0.8) });

  // One clock: Lenis driven by GSAP's ticker, ScrollTrigger updated from
  // Lenis. Left separate, the two disagree about where the page is.
  lenis.on('scroll', ScrollTrigger.update);
  tick = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
}

function stopLenis(): void {
  if (tick) {
    gsap.ticker.remove(tick);
    tick = null;
  }
  gsap.ticker.lagSmoothing(500, 33); // GSAP's own defaults, restored
  lenis?.destroy();
  lenis = null;
}

/* -------------------------------------------------------------------------
   Reveals
------------------------------------------------------------------------- */

function revealNow(targets: HTMLElement[]): void {
  targets.forEach((el) => el.classList.add(REVEALED));
}

function reveal(targets: HTMLElement[], trigger: HTMLElement, fold: number): void {
  if (prefersReducedMotion()) return revealNow(targets);

  // Already on screen when the page initialises: show it, never animate it.
  if (trigger.getBoundingClientRect().top < fold) return revealNow(targets);

  gsap.set(targets, { opacity: 0, y: 24 });
  gsap.to(targets, {
    opacity: 1,
    y: 0,
    duration: seconds('--dur-base', 0.42),
    ease: themeEase(),
    // A real stagger: each child starts after the one before it, instead of
    // every child running its own fixed CSS transition-delay.
    stagger: targets.length > 1 ? seconds('--dur-stagger', 0.06) : 0,
    scrollTrigger: { trigger, start: 'top 88%', once: true },
    onComplete: () => {
      revealNow(targets);
      gsap.set(targets, { clearProps: 'opacity,transform' });
    },
  });
}

function buildReveals(fold: number): void {
  if (prefersReducedMotion()) return;

  // Stagger groups claim their children first, so the standalone pass below
  // cannot pick the same elements up a second time.
  const claimed = new Set<HTMLElement>();

  document.querySelectorAll<HTMLElement>('[data-reveal-stagger]').forEach((group) => {
    const children = Array.from(group.children).filter(
      (child): child is HTMLElement => child instanceof HTMLElement,
    );
    if (children.length === 0) return;
    children.forEach((child) => {
      child.setAttribute('data-reveal', '');
      claimed.add(child);
    });
    reveal(children, group, fold);
  });

  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    if (claimed.has(el)) return;
    reveal([el], el, fold);
  });
}

/* -------------------------------------------------------------------------
   Parallax
------------------------------------------------------------------------- */

/** Hard ceiling on drift, in px. Past this it stops reading as depth. */
const PARALLAX_CAP = 96;

function buildParallax(): void {
  if (prefersReducedMotion()) return;

  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const depth = Number(el.dataset.parallax);
    if (!Number.isFinite(depth) || depth <= 0) return;
    const container = el.parentElement ?? el;

    gsap.fromTo(
      el,
      { yPercent: 0 },
      {
        // Whichever is smaller: the requested fraction of the element's own
        // height, or the px cap. Recomputed on every refresh, so the cap holds
        // at 320px and at 2560px.
        yPercent: () => {
          const height = el.getBoundingClientRect().height || 1;
          return -Math.min(depth, PARALLAX_CAP / height) * 100;
        },
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          /*
           * The start point decides whether anything is offset on arrival, and
           * the right answer depends on where the container sits.
           *
           * 'top top' (the default) suits a container at or near the top of the
           * page: the drift begins only once its top reaches the viewport top,
           * so an above-the-fold image is exactly where it was authored until
           * the user actually scrolls.
           *
           * 'top bottom' suits a container far down the page, which may never
           * reach the viewport top at all — the CTA band being the case here.
           * It is equally safe there, because such a container starts below the
           * fold and so starts at progress 0 anyway.
           */
          start: el.dataset.parallaxStart || 'top top',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      },
    );
  });
}

/* -------------------------------------------------------------------------
   Lifecycle. View transitions swap the document, so everything built here has
   to be killed and rebuilt — a ScrollTrigger still pointing at a detached node
   is exactly the "works once, then stops after the first navigation" bug.
------------------------------------------------------------------------- */

function clearProps(selector: string): void {
  const nodes = document.querySelectorAll<HTMLElement>(selector);
  if (nodes.length > 0) gsap.set(nodes, { clearProps: 'all' });
}

export function teardownMotion(): void {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  const revealTargets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (revealTargets.length > 0) gsap.killTweensOf(revealTargets);
  clearProps('[data-reveal]');
  clearProps('[data-parallax]');
  // Anything killed mid-tween is left visible, never stranded at opacity 0.
  revealNow(revealTargets);
  document.documentElement.classList.remove(READY);
  stopLenis();
}

export function initMotion(): void {
  teardownMotion();
  if (prefersReducedMotion()) return;

  startLenis();

  const fold = window.innerHeight * 0.88;
  document.documentElement.classList.add(READY);
  buildReveals(fold);
  buildParallax();

  // Fonts and lazy images move elements after first layout.
  ScrollTrigger.refresh();
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

