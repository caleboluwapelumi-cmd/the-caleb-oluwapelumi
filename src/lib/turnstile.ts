/**
 * Cloudflare Turnstile, rendered explicitly so it survives view transitions:
 * the script loads once, and each page-load renders into the fresh container.
 */

interface TurnstileApi {
  render(el: HTMLElement, options: { sitekey: string; theme?: 'light' | 'dark' | 'auto' }): string;
  reset(widgetId: string): void;
  remove(widgetId: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let loading: Promise<TurnstileApi> | null = null;

function loadScript(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  loading ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('turnstile')));
    script.onerror = () => {
      loading = null;
      reject(new Error('turnstile'));
    };
    document.head.append(script);
  });
  return loading;
}

export interface TurnstileHandle {
  reset(): void;
  remove(): void;
}

export async function renderTurnstile(container: HTMLElement): Promise<TurnstileHandle | null> {
  const sitekey = container.dataset.sitekey;
  if (!sitekey) return null;
  const api = await loadScript();
  const id = api.render(container, { sitekey, theme: 'light' });
  return { reset: () => api.reset(id), remove: () => api.remove(id) };
}
