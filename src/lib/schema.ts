/**
 * Contact form schema. Imported by the browser (inline validation) and by
 * /api/contact (the validation that counts), so the two can never drift.
 * Keep this file free of server-only imports — it ships to the client.
 */
import { z } from 'astro/zod';
import { services } from '../data/services';

export const HONEYPOT_FIELD = 'company_website';
/** Name of the hidden input Cloudflare's widget injects into the form. */
export const TURNSTILE_FIELD = 'cf-turnstile-response';

const NOT_SURE = 'not-sure';

// TODO(copy): "not sure" option label.
export const serviceOptions = [
  ...services.map((s) => ({ value: s.slug as string, label: s.name })),
  { value: NOT_SURE, label: 'Not sure yet' },
];

// TODO(copy): budget ranges. Real figures only — these qualify the lead.
export const budgetOptions = [
  { value: 'range-1', label: 'TODO(copy): budget range 1' },
  { value: 'range-2', label: 'TODO(copy): budget range 2' },
  { value: 'range-3', label: 'TODO(copy): budget range 3' },
  { value: 'range-4', label: 'TODO(copy): budget range 4' },
  { value: NOT_SURE, label: 'Not sure yet' },
];

const values = (options: { value: string }[]) =>
  options.map((o) => o.value) as [string, ...string[]];

// TODO(copy): validation messages.
export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Enter your name.').max(100, 'Keep your name under 100 characters.'),
  email: z
    .string()
    .trim()
    .min(1, 'Enter your email address.')
    .email('Enter a valid email address, like name@example.com.')
    .max(254, 'That email address is too long.'),
  business: z.string().trim().max(150, 'Keep the business name under 150 characters.').default(''),
  service: z.enum(values(serviceOptions), {
    errorMap: () => ({ message: 'Choose what you need help with.' }),
  }),
  budget: z.enum(values(budgetOptions), {
    errorMap: () => ({ message: 'Choose a budget range.' }),
  }),
  message: z
    .string()
    .trim()
    .min(1, 'Tell me a little about what you need.')
    .max(5000, 'Keep your message under 5,000 characters.'),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;
export type FieldErrors = Partial<Record<ContactField, string>>;

/** First message per field. Messages only — never the submitted values. */
export function toFieldErrors(error: z.ZodError): FieldErrors {
  const flat = error.flatten().fieldErrors as Record<string, string[] | undefined>;
  const out: FieldErrors = {};
  for (const [field, messages] of Object.entries(flat)) {
    if (messages?.[0]) out[field as ContactField] = messages[0];
  }
  return out;
}

/** Response body shared by the endpoint and the client. */
export type ContactResponse =
  | { ok: true }
  | { ok: false; reason: 'validation'; errors: FieldErrors }
  | { ok: false; reason: 'verification' | 'send' | 'config' | 'bad-request' };
