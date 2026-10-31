// Entry point of .github/workflows/triage.yml: alerts, reviews and labels one new issue.
// The issue comes from GITHUB_EVENT_PATH, never through the workflow's expressions.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

import Anthropic from '@anthropic-ai/sdk';

import { buildTools, runLoop } from './claude.mjs';
import { createGitHub, sendDiscord } from './github.mjs';
import {
  arrivalAlert,
  buildIssueMessage,
  discordPayload,
  formatComment,
  formatSkippedComment,
  isFlood,
  isOwnReview,
  pickDuplicates,
  pickLabels,
  reviewAlert,
  scrubSecrets,
  shouldSkipReview,
  spamSignals,
  TRIAGE_SCHEMA,
  TRIAGE_SYSTEM,
} from './lib.mjs';

const { issue } = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
const secrets = [
  process.env.ANTHROPIC_API_KEY,
  process.env.DISCORD_WEBHOOK_URL,
  process.env.GITHUB_TOKEN,
];
const options = { secrets };
const github = createGitHub({
  token: process.env.GITHUB_TOKEN,
  repository: process.env.GITHUB_REPOSITORY,
});
const alert = (content) => sendDiscord(process.env.DISCORD_WEBHOOK_URL, discordPayload(content));

// From the real import graph. The model only picks files; a path is an argument, never a shell word.
const affectedAreas = (files) => {
  if (!files.length) return [];
  const output = execFileSync('node', ['scripts/affected-areas.mjs', ...files], {
    encoding: 'utf8',
    env: { PATH: process.env.PATH },
  });
  return JSON.parse(output).areas;
};

const trackedOnly = (files) => {
  const tracked = new Set(
    execFileSync('git', ['ls-files'], { encoding: 'utf8', env: { PATH: process.env.PATH } }).split(
      '\n'
    )
  );
  return [...new Set(files)].filter((file) => tracked.has(file)).slice(0, 8);
};

const main = async () => {
  // A re-run of the workflow doesn't comment or alert twice
  if ((await github.comments(issue.number)).some(isOwnReview)) {
    console.info('Already triaged.');
    return;
  }

  await alert(arrivalAlert(issue, options));

  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const recent = await github.recentIssues(since);
  const signals = spamSignals(issue, recent);
  const existingLabels = await github.labels();

  const skip = shouldSkipReview(issue, signals);
  if (skip || isFlood(recent, Date.now())) {
    const reason = skip
      ? 'the automatic signals below mark this as likely spam. Nothing was closed.'
      : 'too many issues arrived in the last hour, so the review was skipped to cap its cost.';
    await github.comment(issue.number, formatSkippedComment({ signals, reason }));
    const labels = skip ? pickLabels(['invalid'], existingLabels) : [];
    if (labels.length) await github.addLabels(issue.number, labels);
    await alert(reviewAlert({ issue, signals, reason: `Not reviewed: ${reason}` }, options));
    return;
  }

  const tools = buildTools({ searchIssues: github.searchIssues });
  const { result: triage, refused } = await runLoop({
    client: new Anthropic(),
    system: TRIAGE_SYSTEM,
    user: buildIssueMessage(issue, signals),
    tools,
    schema: TRIAGE_SCHEMA,
  });

  if (refused) {
    const reason = 'the automatic review declined this issue, so it needs a manual look.';
    await github.comment(issue.number, formatSkippedComment({ signals, reason }));
    await alert(reviewAlert({ issue, signals, reason: `Not reviewed: ${reason}` }, options));
    return;
  }

  const files = trackedOnly(triage.suspect_files);
  const areas = affectedAreas(files);
  const duplicates = pickDuplicates(triage.duplicates, tools.seen, issue.number);
  await github.comment(
    issue.number,
    formatComment({ triage, areas, files, duplicates, signals }, options)
  );
  const labels = pickLabels(triage.labels, existingLabels);
  if (labels.length) await github.addLabels(issue.number, labels);
  await alert(reviewAlert({ issue, triage, areas, signals }, options));
};

main().catch(async (error) => {
  console.error(scrubSecrets(error.stack ?? error, secrets));
  await alert(`Triage of #${issue.number} failed: ${issue.html_url}`);
  process.exitCode = 1;
});
