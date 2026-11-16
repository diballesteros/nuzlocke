import * as Sentry from '@sentry/react';
import { FEEDBACK_HOST_ID, type FeedbackTexts, openFeedbackForm } from './feedback';

const TEXTS: FeedbackTexts = {
  formTitle: 'Title',
  messageLabel: 'Message label',
  messagePlaceholder: 'Placeholder',
  isRequiredLabel: '(req)',
  submitButtonLabel: 'Submit it',
  cancelButtonLabel: 'Cancel it',
  successMessageText: 'Thanks',
  errorEmptyMessageText: 'Empty',
  errorNoClientText: 'Failed',
  errorTimeoutText: 'Failed',
  errorForbiddenText: 'Failed',
  errorGenericText: 'Failed',
};

type Envelope = [unknown, [{ type: string }, Record<string, unknown>][]];
let envelopes: Envelope[];

beforeEach(() => {
  envelopes = [];
  Sentry.init({
    dsn: 'https://key@o1.ingest.sentry.io/1',
    defaultIntegrations: false,
    transport: () => ({
      send: async (envelope) => {
        envelopes.push(envelope as unknown as Envelope);
        return { statusCode: 200 };
      },
      flush: async () => true,
    }),
  });
});

afterEach(() => {
  document.getElementById(FEEDBACK_HOST_ID)?.shadowRoot?.querySelector('dialog')?.click();
  document.getElementById(FEEDBACK_HOST_ID)?.remove();
});

const shadow = (): ShadowRoot => document.getElementById(FEEDBACK_HOST_ID).shadowRoot;
const field = (name: string): HTMLInputElement | HTMLTextAreaElement =>
  shadow().querySelector(`[name="${name}"]`);
const button = (text: string): HTMLButtonElement =>
  [...shadow().querySelectorAll('button')].find((b) => b.textContent === text);

describe('openFeedbackForm', () => {
  test('shows the message field only, with the given strings', async () => {
    await openFeedbackForm({ texts: TEXTS, darkMode: false });
    const root = shadow();
    expect(root.querySelector('dialog').open).toBe(true);
    expect(root.textContent).toContain('Title');
    expect(root.textContent).toContain('Message label');
    expect(field('message').getAttribute('placeholder')).toBe('Placeholder');
    // No name or email to fill in: Sentry keeps them as hidden, empty inputs
    expect(field('name')).toMatchObject({ type: 'hidden', value: '' });
    expect(field('email')).toMatchObject({ type: 'hidden', value: '' });
    // No screenshot button, no Sentry branding link
    expect(root.querySelectorAll('button')).toHaveLength(2);
    expect(button('Submit it')).toBeTruthy();
    expect(button('Cancel it')).toBeTruthy();
    expect(root.querySelector('a')).toBeNull();
  });

  test("takes the app's tokens, in the app's theme", async () => {
    await openFeedbackForm({ texts: TEXTS, darkMode: true });
    const styles = [...shadow().querySelectorAll('style')].map((s) => s.textContent).join('');
    expect(styles).toContain('color-scheme: only dark');
    expect(styles).toContain('--background: var(--card)');
    expect(styles).toContain('--foreground: var(--contrast)');
    expect(styles).toContain('--accent-background: var(--primary-hover)');
    expect(styles).toContain('--error-color: var(--red-inverted)');
  });

  test('opens once at a time, and again after Cancel', async () => {
    await openFeedbackForm({ texts: TEXTS, darkMode: false });
    await openFeedbackForm({ texts: TEXTS, darkMode: false });
    expect(document.querySelectorAll(`#${FEEDBACK_HOST_ID}`)).toHaveLength(1);
    expect(shadow().querySelectorAll('dialog')).toHaveLength(1);

    button('Cancel it').click();
    expect(document.getElementById(FEEDBACK_HOST_ID)).toBeNull();

    await openFeedbackForm({ texts: TEXTS, darkMode: false });
    expect(shadow().querySelector('dialog').open).toBe(true);
  });

  test('sends the message and the game, with no name or email', async () => {
    await openFeedbackForm({ texts: TEXTS, darkMode: false, game: 'Emerald' });
    const message = field('message');
    message.value = 'The Rival fight is missing';
    shadow().querySelector('form').requestSubmit();
    await vi.waitFor(() => expect(envelopes).toHaveLength(1));

    const [[header, payload]] = envelopes[0][1];
    expect(header.type).toBe('feedback');
    expect(payload.tags).toEqual({ game: 'Emerald' });
    const { feedback } = payload.contexts as { feedback: Record<string, unknown> };
    expect(feedback.message).toBe('The Rival fight is missing');
    expect(feedback.name ?? '').toBe('');
    expect(feedback.contact_email ?? '').toBe('');
    expect(payload.user).toBeUndefined();
  });
});
