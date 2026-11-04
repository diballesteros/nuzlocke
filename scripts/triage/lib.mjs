// Pure helpers of the issue triage (Phase 7): nothing here touches the network, git or the disk,
// so scripts/triage/lib.test.mjs can pin all of it. Issue text comes from strangers, so everything
// from an issue goes through neutralize before GitHub or Discord renders it.

export const MARKER = '<!-- nuzlocke-triage -->';
// Anyone can write a comment that starts with the marker, so the author counts too
export const isOwnComment = (comment) =>
  comment.user?.login === 'github-actions[bot]' && Boolean(comment.body?.startsWith(MARKER));
export const SPAM_LABEL = 'invalid';

const FIELDS = {
  Type: 'type',
  Device: 'device',
  OS: 'os',
  Browser: 'browser',
  'Selected Game': 'game',
};
const RESUBMIT_WINDOW_MS = 10 * 60 * 1000;

// The Report form's Netlify submissions arrive as "Type: bug\n\nDevice: …\n\nDescription: …".
// Anything else (an issue written by hand, Sentry's) is all description.
export const parseIssue = (body) => {
  const text = (body ?? '').replace(/\r\n/g, '\n');
  const description = /^Description:[ \t]*(.*)$/ms.exec(text);
  if (!description || !/^Type:/m.test(text)) {
    return { isForm: false, description: text.trim() };
  }
  const head = text.slice(0, description.index);
  const parsed = { isForm: true, description: description[1].trim() };
  for (const [label, key] of Object.entries(FIELDS)) {
    parsed[key] = new RegExp(`^${label}:[ \\t]*(.*)$`, 'm').exec(head)?.[1].trim() ?? '';
  }
  return parsed;
};

const INJECTION_PATTERNS = [
  /<\s*\/?\s*(script|iframe|svg|img)\b/i,
  /\bon(error|load|click)\s*=/i,
  /javascript:/i,
  /\$\{\s*jndi:/i,
  /\{\{\s*\d+\s*\*\s*\d+\s*\}\}/,
  /\$\{\s*\d+\s*\*\s*\d+\s*\}/,
  /['"]\s*(or|and)\s+['"]?\d+['"]?\s*=\s*['"]?\d+/i,
  /\bunion\s+(all\s+)?select\b/i,
  /;\s*(drop|delete|insert|update)\s+\w+/i,
  /(\.\.[/\\]){2,}/,
  /\/etc\/(passwd|shadow)/i,
  /\b(sleep|benchmark|waitfor)\s*\(\s*\d+/i,
  /(ignore|disregard|forget)\s+(all\s+|any\s+)?(the\s+)?(previous|prior|above)\s+(instructions|prompts?)/i,
];

export const hasInjection = (text) => INJECTION_PATTERNS.some((pattern) => pattern.test(text));

const normalizeText = (text) => text.toLowerCase().replace(/\s+/g, ' ').trim();

// Issues opened just before this one with the same description. `recent` is the REST issue list.
export const findResubmissions = (issue, recent) => {
  const { description } = parseIssue(issue.body);
  if (!description) return [];
  const created = Date.parse(issue.created_at);
  const same = normalizeText(description);
  return recent
    .filter(
      (other) =>
        other.number !== issue.number &&
        !other.pull_request &&
        Math.abs(created - Date.parse(other.created_at)) <= RESUBMIT_WINDOW_MS &&
        normalizeText(parseIssue(other.body).description) === same
    )
    .map((other) => other.number);
};

// The signals from the backlog review. Gen 9 and version-split requests are planned work, so
// nothing here looks at what a report asks for.
export const spamSignals = (issue, recent = []) => {
  const parsed = parseIssue(issue.body);
  const signals = [];
  if (!parsed.description) signals.push('The description is empty.');
  if (parsed.isForm && !parsed.type && !parsed.device && !parsed.os) {
    signals.push("Type, Device and OS are all blank, which the form's UI can't send.");
  }
  if (hasInjection(`${issue.title ?? ''}\n${issue.body ?? ''}`)) {
    signals.push('A field contains an injection string.');
  }
  const resubmitted = findResubmissions(issue, recent);
  if (resubmitted.length) {
    signals.push(
      `The same text was sent ${resubmitted.length + 1} times within minutes (${resubmitted.map((n) => `#${n}`).join(', ')}).`
    );
  }
  return signals;
};

// An empty report, or two signals: spam in every case the backlog review saw. Such an issue is
// only flagged, never closed.
export const isLikelySpam = (issue, signals) =>
  !parseIssue(issue.body).description || signals.length >= 2;

const SECRET_PATTERNS = [
  /sk-ant-[\w-]+/g,
  /gh[pousr]_\w+/g,
  /github_pat_\w+/g,
  /https:\/\/(?:\w+\.)?discord(?:app)?\.com\/api\/webhooks\/\S+/g,
];

export const scrubSecrets = (text, secrets = []) => {
  let scrubbed = String(text);
  for (const secret of secrets) {
    if (secret) scrubbed = scrubbed.split(secret).join('[redacted]');
  }
  for (const pattern of SECRET_PATTERNS) scrubbed = scrubbed.replace(pattern, '[redacted]');
  return scrubbed;
};

// Makes stranger text inert when GitHub or Discord renders it: no mentions (a zero-width
// space breaks them), no issue references, so no back-links or closing keywords, no HTML, images or
// links out of this repository. Validated references are added afterwards by whoever formats it.
export const neutralize = (text, { secrets = [], limit = 1500 } = {}) => {
  const clean = scrubSecrets(text ?? '', secrets)
    .replace(/<!--/g, '‹!--')
    .replace(/</g, '‹')
    .replace(/@(?=[\w-])/g, '@​')
    .replace(/#(?=\d)/g, '#​')
    .replace(/!\[/g, '!​[')
    .replace(/\bhttps?:\/\/(?!github\.com\/diballesteros\/nuzlocke(?:[/?#\s]|$))/gi, 'hxxp://')
    .replace(/\bwww\./gi, 'www[.]')
    .trim();
  return clean.length > limit ? `${clean.slice(0, limit)}… (cut)` : clean;
};

export const formatSpamComment = (signals) =>
  [
    MARKER,
    '## Automatic triage',
    '',
    `The automatic signals below mark this as likely spam, so it was labelled \`${SPAM_LABEL}\`. Nothing was closed.`,
    '',
    '**Spam signals:**',
    ...signals.map((signal) => `- ${signal}`),
    '',
    '<sub>Automatic check: advisory. The owner reviews every issue.</sub>',
    '',
  ].join('\n');

// A Discord message: mentions are off, link previews are suppressed, and it fits the 2000 limit.
export const discordPayload = (content) => ({
  content: content.length > 1900 ? `${content.slice(0, 1900)}…` : content,
  allowed_mentions: { parse: [] },
  flags: 4,
});

// `signals` are this script's own strings, so they keep their real issue references.
export const issueAlert = ({ issue, signals, spam }, options = {}) => {
  const lines = [
    `New issue #${issue.number}: ${neutralize(issue.title, { ...options, limit: 200 })}`,
    issue.html_url,
  ];
  if (signals.length) lines.push(`Spam signals: ${signals.join(' ')}`);
  if (spam) lines.push(`Labelled ${SPAM_LABEL} as likely spam.`);
  return lines.join('\n');
};
