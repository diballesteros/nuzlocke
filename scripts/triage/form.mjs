// Phase 7, step 1: turns a Report form submission into a GitHub issue, in the format the Zapier zap
// used, so earlier issues and the triage workflow read the same. Netlify calls this through
// netlify/functions/submission-created.mjs for each submission that passed its spam filter and the
// bot-field honeypot.
//
// The issue is created with the owner's fine-grained token, so the `issues: opened` triage workflow
// runs on it and sends its Discord alert as for any other issue. Likely spam never becomes an issue:
// it stays in Netlify's Forms tab and this sends the only alert about it.
import { createGitHub, sendDiscord } from './github.mjs';
import {
  discordPayload,
  hasInjection,
  isLikelySpam,
  neutralize,
  scrubSecrets,
  spamSignals,
} from './lib.mjs';

export const FORM_NAME = 'contact';
export const REPOSITORY = 'diballesteros/nuzlocke';
export const FORM_LABEL = 'netlify';
export const TITLE_PREFIX = 'User Submitted Issue: # ';

// The zap's order and labels, and the form's field names (src/components/Report/Report.tsx)
const FIELDS = [
  ['Type', 'type'],
  ['Device', 'device'],
  ['OS', 'os'],
  ['Browser', 'browser'],
  ['Selected Game', 'selectedgame'],
  ['Description', 'description'],
];

const INJECTION_SIGNAL = 'A field contains an injection string.';

const value = (data, key) => (typeof data?.[key] === 'string' ? data[key] : '');

// Only the description may span lines: a line break in another field could forge the next field
const fieldText = (data, key) =>
  key === 'description'
    ? value(data, key).replace(/\r\n?/g, '\n').trim()
    : value(data, key).replace(/\s+/g, ' ').trim();

const formatBody = (data, transform) =>
  FIELDS.map(([label, key]) => {
    const text = transform(fieldText(data, key));
    return text ? `${label}: ${text}` : `${label}: `;
  }).join('\n\n');

// `raw` is what the reporter sent, for the spam checks; `body` is what GitHub shows, with each
// field neutralized (no mentions, issue references, HTML or outside links).
export const formIssue = (payload, options = {}) => ({
  title: `${TITLE_PREFIX}${Number.isInteger(payload.number) ? payload.number : ''}`,
  raw: formatBody(payload.data, (text) => text),
  body: formatBody(payload.data, (text) => neutralize(text, { ...options, limit: 1500 })),
});

// The triage's signals, against the recent issues as GitHub shows them. Neutralizing hides an
// injection string from the triage that runs on the new issue, so it's looked for in the raw text.
export const submissionSignals = (issue, createdAt, recent) => {
  const signals = spamSignals(
    { title: issue.title, body: issue.body, created_at: createdAt },
    recent
  );
  if (!signals.includes(INJECTION_SIGNAL) && hasInjection(issue.raw))
    signals.push(INJECTION_SIGNAL);
  return signals;
};

export const droppedAlert = ({ number, signals, description }, options = {}) =>
  [
    `Report form submission ${Number.isInteger(number) ? number : '(no number)'} dropped as likely spam; no issue was opened.`,
    `Spam signals: ${signals.join(' ')}`,
    `Description: ${neutralize(description, { ...options, limit: 300 }) || '(empty)'}`,
    "It's still in Netlify's Forms tab under the contact form.",
  ].join('\n');

export const handleSubmission = async ({ payload, env, fetchImpl = fetch, now = Date.now }) => {
  if (payload?.form_name !== FORM_NAME) {
    return { status: 'ignored' };
  }
  const token = env.GITHUB_ISSUES_TOKEN;
  const webhook = env.DISCORD_WEBHOOK_URL;
  const options = { secrets: [token, webhook] };
  const alert = (content) =>
    webhook ? sendDiscord(webhook, discordPayload(content), fetchImpl) : Promise.resolve();
  if (!token) {
    console.error('GITHUB_ISSUES_TOKEN is not set: the submission stays in Netlify only.');
    await alert(
      `Report form submission ${payload.number} couldn't become an issue: GITHUB_ISSUES_TOKEN is not set.`
    );
    return { status: 'unconfigured' };
  }

  const github = createGitHub({ token, repository: REPOSITORY, fetchImpl });
  try {
    const issue = formIssue(payload, options);
    const createdAt = new Date(now()).toISOString();
    const since = new Date(now() - 60 * 60 * 1000).toISOString();
    const signals = submissionSignals(issue, createdAt, await github.recentIssues(since));
    if (isLikelySpam({ body: issue.raw }, signals)) {
      await alert(
        droppedAlert(
          { number: payload.number, signals, description: fieldText(payload.data, 'description') },
          options
        )
      );
      return { status: 'dropped', signals };
    }
    // Adding a label the repository lacks would create it
    const labels = (await github.labels()).includes(FORM_LABEL) ? [FORM_LABEL] : [];
    const created = await github.createIssue({ title: issue.title, body: issue.body, labels });
    return { status: 'created', number: created.number };
  } catch (error) {
    console.error(scrubSecrets(error.stack ?? error, options.secrets));
    await alert(
      `Report form submission ${payload.number} couldn't become an issue: ${scrubSecrets(error.message, options.secrets)}. It's in Netlify's Forms tab.`
    );
    return { status: 'failed' };
  }
};
