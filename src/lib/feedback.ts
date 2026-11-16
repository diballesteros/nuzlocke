// Sentry's user feedback form. Only the Report page's button imports this module (dynamically), so
// the form's code (about 18 KB gzipped) is its own chunk and stays out of every page's first load.
// Reports go through the client set up in sentry.ts, so through the /diag tunnel, and only in
// production builds: the dev DSN is empty, so a dev send times out with errorTimeoutText.
import { feedbackSyncIntegration } from '@sentry/react';

// Every string the form shows. The Report page passes them translated
export interface FeedbackTexts {
  formTitle: string;
  messageLabel: string;
  messagePlaceholder: string;
  isRequiredLabel: string;
  submitButtonLabel: string;
  cancelButtonLabel: string;
  successMessageText: string;
  errorEmptyMessageText: string;
  errorNoClientText: string;
  errorTimeoutText: string;
  errorForbiddenText: string;
  errorGenericText: string;
}

export interface FeedbackFormOptions {
  texts: FeedbackTexts;
  darkMode: boolean;
  // The selected game's name, sent as a tag (the Report form asks for it by hand)
  game?: string;
}

export const FEEDBACK_HOST_ID = 'nuzlocke-feedback';

// The app's tokens, by reference so they follow the theme. The form's own variables live in a
// shadow root, where --foreground and --background are its names: point them at the app's
// underlying colours (--contrast, --card), never at the app's same-named tokens, which would refer
// to themselves. The accent is the darker blue the Edit custom statuses button uses (4.67:1 with
// white), since the app's --primary is too light for small white text
const BORDER = '1px solid var(--contrast-border)';
const SHARED_THEME = {
  foreground: 'var(--contrast)',
  background: 'var(--card)',
  accentForeground: 'var(--primary-foreground)',
  accentBackground: 'var(--primary-hover)',
  border: BORDER,
  outline: '2px solid var(--ring)',
};
export const FEEDBACK_THEME_LIGHT = {
  ...SHARED_THEME,
  successColor: 'var(--note-feature-foreground)',
  errorColor: 'var(--destructive)',
};
export const FEEDBACK_THEME_DARK = {
  ...SHARED_THEME,
  successColor: 'var(--green-inverted)',
  errorColor: 'var(--red-inverted)',
};

let current: ReturnType<typeof feedbackSyncIntegration> | null = null;

// Opens the form, unless it's already open. Each opening builds a fresh widget, so it takes the
// language and theme in use, and closing or sending removes it from the page again
export async function openFeedbackForm({
  texts,
  darkMode,
  game,
}: FeedbackFormOptions): Promise<void> {
  if (current) return;
  const close = (): void => {
    widget.remove();
    // remove() means to take the host away too, but it calls parentElement on the shadow root,
    // which has none (SDK 11.10), so the host would stay and the next opening would add another
    document.getElementById(FEEDBACK_HOST_ID)?.remove();
    if (current === widget) current = null;
  };
  const widget = feedbackSyncIntegration({
    id: FEEDBACK_HOST_ID,
    autoInject: false,
    // Personal data stays off (sentry.ts): no name, no email, no screenshot of the player's run
    showName: false,
    showEmail: false,
    isNameRequired: false,
    isEmailRequired: false,
    useSentryUser: { name: '', email: '' },
    enableScreenshot: false,
    showBranding: false,
    colorScheme: darkMode ? 'dark' : 'light',
    themeLight: FEEDBACK_THEME_LIGHT,
    themeDark: FEEDBACK_THEME_DARK,
    tags: game ? { game } : undefined,
    ...texts,
    onFormClose: close,
    onFormSubmitted: close,
  });
  current = widget;
  try {
    const form = await widget.createForm();
    // The form's :host sets its own font; the page's wins over :host, so it takes the app's
    const host = document.getElementById(FEEDBACK_HOST_ID);
    host?.style.setProperty('--font-family', getComputedStyle(document.body).fontFamily);
    form.appendToDom();
    form.open();
  } catch (error) {
    close();
    throw error;
  }
}
