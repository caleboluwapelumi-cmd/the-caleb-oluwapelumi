import type { APIRoute } from 'astro';
import { CONTACT_TO_EMAIL, RESEND_API_KEY, TURNSTILE_SECRET_KEY } from 'astro:env/server';
import { site } from '../../data/site';
import {
  HONEYPOT_FIELD,
  TURNSTILE_FIELD,
  budgetOptions,
  contactSchema,
  serviceOptions,
  toFieldErrors,
  type ContactInput,
  type ContactResponse,
} from '../../lib/schema';

// The site is static; this route must run on demand or it builds to a file.
export const prerender = false;

const MAX_BODY_BYTES = 64 * 1024;
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const RESEND_URL = 'https://api.resend.com/emails';

const statusFor: Record<Exclude<ContactResponse, { ok: true }>['reason'], number> = {
  validation: 400,
  verification: 400,
  'bad-request': 400,
  send: 502,
  config: 500,
};

/**
 * fetch() callers ask for JSON. A native form post (JS off) gets a 303 to a
 * static result page instead of a raw JSON document.
 */
function respond(request: Request, body: ContactResponse): Response {
  const status = body.ok ? 200 : statusFor[body.reason];
  if (request.headers.get('accept')?.includes('application/json')) {
    return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
  }
  const location = body.ok ? '/contact/sent' : '/contact/not-sent';
  return new Response(null, { status: 303, headers: { Location: location } });
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// Header-ish values: no line breaks, bounded length.
const singleLine = (value: string, max = 120) => value.replace(/[\r\n]+/g, ' ').slice(0, max);

const labelFor = (options: { value: string; label: string }[], value: string) =>
  options.find((o) => o.value === value)?.label ?? value;

async function verifyTurnstile(token: string, ip: string | undefined): Promise<boolean> {
  const body = new URLSearchParams({ secret: TURNSTILE_SECRET_KEY ?? '', response: token });
  if (ip) body.set('remoteip', ip);
  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(5000),
    });
    const result = (await res.json()) as { success?: boolean; 'error-codes'?: string[] };
    if (!result.success) {
      console.warn('[contact] turnstile rejected', result['error-codes'] ?? []);
    }
    return result.success === true;
  } catch (error) {
    console.error('[contact] turnstile verification unavailable', (error as Error).name);
    return false;
  }
}

async function sendEmail(input: ContactInput, fromDomain: string): Promise<boolean> {
  const rows: [string, string][] = [
    ['Name', input.name],
    ['Email', input.email],
    ['Business', input.business || '—'],
    ['Needs', labelFor(serviceOptions, input.service)],
    ['Budget', labelFor(budgetOptions, input.budget)],
  ];

  // Every submitted value is escaped: a form post is untrusted input and the
  // receiving mail client renders HTML.
  const html = `<!doctype html><html><body style="font-family:sans-serif">
<table cellpadding="6">${rows
    .map(([k, v]) => `<tr><th align="left">${k}</th><td>${escapeHtml(v)}</td></tr>`)
    .join('')}</table>
<p style="white-space:pre-wrap">${escapeHtml(input.message)}</p>
</body></html>`;
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${input.message}`;

  try {
    const res = await fetch(RESEND_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Always our verified domain, never the submitter's address — sending
        // as an unverified sender gets the domain flagged for spoofing.
        from: `${site.name} website <hello@${fromDomain}>`,
        to: [CONTACT_TO_EMAIL],
        reply_to: input.email,
        subject: singleLine(`New enquiry from ${input.name}`),
        html,
        text,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) console.error('[contact] resend rejected', res.status);
    return res.ok;
  } catch (error) {
    console.error('[contact] resend unavailable', (error as Error).name);
    return false;
  }
}

export const POST: APIRoute = async ({ request, site: siteUrl, clientAddress }) => {
  const length = Number(request.headers.get('content-length') ?? 0);
  if (length > MAX_BODY_BYTES) return respond(request, { ok: false, reason: 'bad-request' });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return respond(request, { ok: false, reason: 'bad-request' });
  }

  // Honeypot before validation: a bot that fills every field with junk would
  // otherwise get field-level 400s back and learn what's being checked.
  const honeypot = form.get(HONEYPOT_FIELD);
  if (typeof honeypot === 'string' && honeypot.trim() !== '') {
    return respond(request, { ok: true });
  }

  const raw = Object.fromEntries(
    ['name', 'email', 'business', 'service', 'budget', 'message'].map((key) => {
      const value = form.get(key);
      return [key, typeof value === 'string' ? value : undefined];
    }),
  );
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return respond(request, { ok: false, reason: 'validation', errors: toFieldErrors(parsed.error) });
  }

  // Fail closed on missing configuration rather than silently dropping mail.
  const fromDomain = siteUrl?.hostname;
  if (
    !TURNSTILE_SECRET_KEY ||
    !RESEND_API_KEY ||
    !CONTACT_TO_EMAIL ||
    !fromDomain ||
    /todo/i.test(fromDomain)
  ) {
    console.error('[contact] missing configuration');
    return respond(request, { ok: false, reason: 'config' });
  }

  const token = form.get(TURNSTILE_FIELD);
  if (typeof token !== 'string' || token === '') {
    return respond(request, { ok: false, reason: 'verification' });
  }
  let ip: string | undefined;
  try {
    ip = clientAddress;
  } catch {
    ip = undefined;
  }
  if (!(await verifyTurnstile(token, ip))) {
    return respond(request, { ok: false, reason: 'verification' });
  }

  const sent = await sendEmail(parsed.data, fromDomain);
  return respond(request, sent ? { ok: true } : { ok: false, reason: 'send' });
};

export const ALL: APIRoute = () =>
  new Response(null, { status: 405, headers: { Allow: 'POST' } });
