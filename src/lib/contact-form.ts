/**
 * Enhances the contact form: inline validation with the shared zod schema,
 * fetch submission with a pending state, and success/failure panels. Without
 * JS the form still posts natively to /api/contact.
 */
import {
  TURNSTILE_FIELD,
  contactSchema,
  toFieldErrors,
  type ContactResponse,
  type FieldErrors,
} from './schema';
import { renderTurnstile, type TurnstileHandle } from './turnstile';

let turnstile: TurnstileHandle | null = null;

function showErrors(form: HTMLFormElement, errors: FieldErrors): void {
  let firstInvalid: HTMLElement | null = null;
  form.querySelectorAll<HTMLElement>('[data-field]').forEach((wrapper) => {
    const name = wrapper.dataset.field as keyof FieldErrors;
    const control = wrapper.querySelector<HTMLElement>('input, select, textarea');
    const slot = wrapper.querySelector<HTMLElement>('[data-error]');
    if (!control || !slot) return;
    const message = errors[name];
    slot.textContent = message ?? '';
    slot.hidden = !message;
    if (message) {
      control.setAttribute('aria-invalid', 'true');
      firstInvalid ??= control;
    } else {
      control.removeAttribute('aria-invalid');
    }
  });
  (firstInvalid as HTMLElement | null)?.focus();
}

function setPending(form: HTMLFormElement, pending: boolean): void {
  const button = form.querySelector<HTMLButtonElement>('[data-submit]');
  if (!button) return;
  button.disabled = pending;
  form.setAttribute('aria-busy', String(pending));
  const label = button.querySelector<HTMLElement>('[data-submit-label]');
  if (label) label.textContent = pending ? (button.dataset.pendingLabel ?? '') : (button.dataset.idleLabel ?? '');
}

function preselectService(form: HTMLFormElement): void {
  const requested = new URL(window.location.href).searchParams.get('service');
  const select = form.querySelector<HTMLSelectElement>('select[name="service"]');
  if (!requested || !select) return;
  if (Array.from(select.options).some((o) => o.value === requested)) select.value = requested;
}

export function initContactForm(): void {
  try {
    turnstile?.remove();
  } catch {
    // The previous page's widget container is already gone after a view transition.
  }
  turnstile = null;

  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (!form) return;
  const root = form.closest<HTMLElement>('[data-contact]');
  const success = root?.querySelector<HTMLElement>('[data-form-success]');
  const failure = root?.querySelector<HTMLElement>('[data-form-failure]');
  const verifyError = form.querySelector<HTMLElement>('[data-verify-error]');

  preselectService(form);

  const widget = form.querySelector<HTMLElement>('[data-turnstile]');
  if (widget) {
    renderTurnstile(widget)
      .then((handle) => (turnstile = handle))
      .catch(() => {
        if (failure) failure.hidden = false;
      });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (failure) failure.hidden = true;
    if (verifyError) verifyError.hidden = true;

    const data = new FormData(form);
    const parsed = contactSchema.safeParse(Object.fromEntries(data));
    if (!parsed.success) {
      showErrors(form, toFieldErrors(parsed.error));
      return;
    }
    showErrors(form, {});

    if (!data.get(TURNSTILE_FIELD)) {
      if (verifyError) verifyError.hidden = false;
      return;
    }

    setPending(form, true);
    let result: ContactResponse | null = null;
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      result = (await res.json()) as ContactResponse;
    } catch {
      result = null;
    }
    setPending(form, false);

    if (result?.ok) {
      form.hidden = true;
      if (success) {
        success.hidden = false;
        success.querySelector<HTMLElement>('[tabindex="-1"]')?.focus();
      }
      return;
    }

    if (result && result.reason === 'validation') {
      showErrors(form, result.errors);
      return;
    }

    // Tokens are single-use: any failed attempt needs a fresh challenge.
    turnstile?.reset();
    if (result?.reason === 'verification' && verifyError) {
      verifyError.hidden = false;
      return;
    }
    if (failure) {
      failure.hidden = false;
      failure.querySelector<HTMLElement>('[tabindex="-1"]')?.focus();
    }
  });
}
