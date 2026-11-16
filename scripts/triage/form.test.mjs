// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';

import submissionCreated from '../../netlify/functions/submission-created.mjs';
import { droppedAlert, formIssue, handleSubmission } from './form.mjs';
import { parseIssue, spamSignals } from './lib.mjs';

const NOW = Date.parse('2026-11-16T10:00:00Z');
const WEBHOOK = 'https://discord.com/api/webhooks/1/secret';
const TOKEN = 'github_pat_secret';
const env = { GITHUB_ISSUES_TOKEN: TOKEN, DISCORD_WEBHOOK_URL: WEBHOOK };

const payloadOf = (data = {}, extra = {}) => ({
  form_name: 'contact',
  number: 412,
  data: {
    type: 'bug',
    device: 'desktop',
    os: 'windows',
    browser: 'firefox',
    selectedgame: 'Emerald',
    description: 'The badge strip is empty',
    ...data,
  },
  ...extra,
});

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

// A stand-in for GitHub and Discord that records every request
const fakeFetch = ({ recent = [], labels = ['netlify', 'invalid'], createStatus = 201 } = {}) => {
  const calls = [];
  const fetchImpl = vi.fn(async (url, init = {}) => {
    const call = { url, method: init.method ?? 'GET', headers: init.headers };
    if (init.body) call.body = JSON.parse(init.body);
    calls.push(call);
    if (url.startsWith('https://discord.com/')) return new Response(null, { status: 204 });
    if (url.includes('/issues?')) return json(recent);
    if (url.endsWith('/labels?per_page=100')) return json(labels.map((name) => ({ name })));
    if (url.endsWith('/repos/diballesteros/nuzlocke/issues') && call.method === 'POST') {
      return json({ number: 950 }, createStatus);
    }
    throw new Error(`unexpected ${call.method} ${url}`);
  });
  return { fetchImpl, calls };
};

const run = (payload, fake, options = {}) =>
  handleSubmission({ payload, env, fetchImpl: fake.fetchImpl, now: () => NOW, ...options });

afterEach(() => vi.restoreAllMocks());

describe('formIssue', () => {
  it("keeps the zap's title and body format", () => {
    expect(formIssue(payloadOf())).toEqual({
      title: 'User Submitted Issue: # 412',
      raw: 'Type: bug\n\nDevice: desktop\n\nOS: windows\n\nBrowser: firefox\n\nSelected Game: Emerald\n\nDescription: The badge strip is empty',
      body: 'Type: bug\n\nDevice: desktop\n\nOS: windows\n\nBrowser: firefox\n\nSelected Game: Emerald\n\nDescription: The badge strip is empty',
    });
  });

  it('leaves empty and missing fields as a bare label', () => {
    const { body } = formIssue({ number: 3, data: { os: '', description: 'Text' } });
    expect(body).toBe(
      'Type: \n\nDevice: \n\nOS: \n\nBrowser: \n\nSelected Game: \n\nDescription: Text'
    );
  });

  it('reads back as a form issue for the triage', () => {
    expect(parseIssue(formIssue(payloadOf()).body)).toEqual({
      isForm: true,
      type: 'bug',
      device: 'desktop',
      os: 'windows',
      browser: 'firefox',
      game: 'Emerald',
      description: 'The badge strip is empty',
    });
  });

  it('keeps line breaks in the description only, so a field cannot forge another', () => {
    const { body } = formIssue(
      payloadOf({ selectedgame: 'Emerald\n\nDescription: forged', description: 'One\r\nTwo' })
    );
    expect(body).toContain('Selected Game: Emerald Description: forged\n\nDescription: One\nTwo');
    expect(parseIssue(body).description).toBe('One\nTwo');
  });

  it('neutralizes what GitHub shows, but keeps the raw text for the checks', () => {
    const issue = formIssue(
      payloadOf({ description: 'cc @octocat about #12 <img src=x> https://spam.example' })
    );
    expect(issue.body).toContain(
      'Description: cc @​octocat about #​12 ‹img src=x> hxxp://spam.example'
    );
    expect(issue.raw).toContain('<img src=x>');
  });

  it('leaves the number out when the payload has none', () => {
    expect(formIssue(payloadOf({}, { number: undefined })).title).toBe('User Submitted Issue: # ');
  });
});

describe('handleSubmission', () => {
  it('opens an issue with the netlify label and no assignee', async () => {
    const fake = fakeFetch();
    await expect(run(payloadOf(), fake)).resolves.toEqual({ status: 'created', number: 950 });
    const create = fake.calls.find((call) => call.method === 'POST');
    expect(create.url).toBe('https://api.github.com/repos/diballesteros/nuzlocke/issues');
    expect(create.headers.authorization).toBe(`Bearer ${TOKEN}`);
    expect(create.body).toEqual({
      title: 'User Submitted Issue: # 412',
      body: formIssue(payloadOf()).body,
      labels: ['netlify'],
    });
    // The triage workflow alerts about the new issue, so this doesn't
    expect(fake.calls.some((call) => call.url === WEBHOOK)).toBe(false);
  });

  it('looks for resubmissions among the last hour of issues', async () => {
    const fake = fakeFetch();
    await run(payloadOf(), fake);
    expect(fake.calls[0].url).toBe(
      'https://api.github.com/repos/diballesteros/nuzlocke/issues?state=all&per_page=50&since=2026-11-16T09%3A00%3A00.000Z'
    );
  });

  it("adds no label the repository doesn't have", async () => {
    const fake = fakeFetch({ labels: ['bug'] });
    await run(payloadOf(), fake);
    expect(fake.calls.find((call) => call.method === 'POST').body.labels).toEqual([]);
  });

  it('opens an issue with a single signal; the triage flags it', async () => {
    const fake = fakeFetch();
    const payload = payloadOf({ type: '', device: '', os: '' });
    await expect(run(payload, fake)).resolves.toMatchObject({ status: 'created' });
  });

  it('drops an empty report and alerts once, neutralized', async () => {
    const fake = fakeFetch();
    const result = await run(payloadOf({ description: '  ' }), fake);
    expect(result).toEqual({ status: 'dropped', signals: ['The description is empty.'] });
    expect(fake.calls.some((call) => call.method === 'POST' && call.url.includes('github'))).toBe(
      false
    );
    const alert = fake.calls.find((call) => call.url === WEBHOOK);
    expect(alert.body.allowed_mentions).toEqual({ parse: [] });
    expect(alert.body.content).toBe(
      [
        'Report form submission 412 dropped as likely spam; no issue was opened.',
        'Spam signals: The description is empty.',
        'Description: (empty)',
        "It's still in Netlify's Forms tab under the contact form.",
      ].join('\n')
    );
  });

  it('drops a resubmitted injection, found in the raw text', async () => {
    const description = "'<script>alert(1)</script>' @everyone";
    const neutralized = formIssue(payloadOf({ description })).body;
    // What the triage would see on the neutralized issue: no injection
    expect(
      spamSignals({ body: neutralized }).includes('A field contains an injection string.')
    ).toBe(false);
    const fake = fakeFetch({
      recent: [{ number: 949, body: neutralized, created_at: '2026-11-16T09:58:00Z' }],
    });
    const result = await run(payloadOf({ description }), fake);
    expect(result.status).toBe('dropped');
    expect(result.signals).toEqual([
      'The same text was sent 2 times within minutes (#949).',
      'A field contains an injection string.',
    ]);
    const { content } = fake.calls.find((call) => call.url === WEBHOOK).body;
    expect(content).toContain("Description: '‹script>alert(1)‹/script>' @​everyone");
  });

  it('ignores other forms', async () => {
    const fake = fakeFetch();
    await expect(run(payloadOf({}, { form_name: 'other' }), fake)).resolves.toEqual({
      status: 'ignored',
    });
    await expect(run(undefined, fake)).resolves.toEqual({ status: 'ignored' });
    expect(fake.calls).toEqual([]);
  });

  it('alerts when the token is missing', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const fake = fakeFetch();
    const result = await run(payloadOf(), fake, { env: { DISCORD_WEBHOOK_URL: WEBHOOK } });
    expect(result).toEqual({ status: 'unconfigured' });
    expect(fake.calls.map((call) => call.url)).toEqual([WEBHOOK]);
  });

  it('does nothing visible without a token or a webhook', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const fake = fakeFetch();
    await expect(run(payloadOf(), fake, { env: {} })).resolves.toEqual({ status: 'unconfigured' });
    expect(fake.calls).toEqual([]);
  });

  it('alerts when GitHub refuses, without leaking the token', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const fake = fakeFetch({ createStatus: 403 });
    await expect(run(payloadOf(), fake)).resolves.toEqual({ status: 'failed' });
    const { content } = fake.calls.find((call) => call.url === WEBHOOK).body;
    expect(content).toBe(
      "Report form submission 412 couldn't become an issue: GitHub POST /repos/diballesteros/nuzlocke/issues: 403. It's in Netlify's Forms tab."
    );
    expect(String(error.mock.calls[0][0])).not.toContain(TOKEN);
  });

  it('skips the alert when no webhook is set', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const fake = fakeFetch();
    const result = await run(payloadOf({ description: '' }), fake, {
      env: { GITHUB_ISSUES_TOKEN: TOKEN },
    });
    expect(result.status).toBe('dropped');
    expect(fake.calls.some((call) => call.url.startsWith('https://discord.com/'))).toBe(false);
  });
});

describe('droppedAlert', () => {
  it('cuts a long description and marks a missing number', () => {
    const text = droppedAlert({ number: undefined, signals: ['A.'], description: 'x'.repeat(400) });
    expect(text).toContain('submission (no number) dropped');
    expect(text).toContain(`Description: ${'x'.repeat(300)}… (cut)`);
  });
});

describe('the Netlify function', () => {
  it('reads the payload from the request and answers 204', async () => {
    const fake = fakeFetch();
    vi.stubGlobal('fetch', fake.fetchImpl);
    vi.stubEnv('GITHUB_ISSUES_TOKEN', TOKEN);
    vi.stubEnv('DISCORD_WEBHOOK_URL', '');
    vi.spyOn(console, 'info').mockImplementation(() => {});
    try {
      const request = new Request('https://nuzlocke.netlify.app/.netlify/functions/x', {
        method: 'POST',
        body: JSON.stringify({ payload: payloadOf() }),
      });
      const response = await submissionCreated(request);
      expect(response.status).toBe(204);
      expect(fake.calls.at(-1).body.title).toBe('User Submitted Issue: # 412');
      expect(console.info).toHaveBeenCalledWith('Report form submission 412: created');
    } finally {
      vi.unstubAllGlobals();
      vi.unstubAllEnvs();
    }
  });
});
