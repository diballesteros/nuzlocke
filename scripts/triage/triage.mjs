// Entry point of .github/workflows/triage.yml: checks one new issue for spam signals, flags likely
// spam with a comment and a label, and alerts the owner on Discord. The issue comes from
// GITHUB_EVENT_PATH, never through the workflow's expressions.
import fs from 'node:fs';

import { createGitHub, sendDiscord } from './github.mjs';
import {
  discordPayload,
  formatSpamComment,
  isLikelySpam,
  isOwnComment,
  issueAlert,
  scrubSecrets,
  SPAM_LABEL,
  spamSignals,
} from './lib.mjs';

const { issue } = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
const secrets = [process.env.DISCORD_WEBHOOK_URL, process.env.GITHUB_TOKEN];
const options = { secrets };
const github = createGitHub({
  token: process.env.GITHUB_TOKEN,
  repository: process.env.GITHUB_REPOSITORY,
});
const alert = (content) => sendDiscord(process.env.DISCORD_WEBHOOK_URL, discordPayload(content));

const main = async () => {
  // A re-run of the workflow doesn't flag twice
  if ((await github.comments(issue.number)).some(isOwnComment)) {
    console.info('Already flagged.');
    return;
  }

  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const signals = spamSignals(issue, await github.recentIssues(since));
  const spam = isLikelySpam(issue, signals);
  if (spam) {
    await github.comment(issue.number, formatSpamComment(signals));
    // Adding a label the repository lacks would create it
    if ((await github.labels()).includes(SPAM_LABEL)) {
      await github.addLabels(issue.number, [SPAM_LABEL]);
    }
  }
  await alert(issueAlert({ issue, signals, spam }, options));
};

main().catch(async (error) => {
  console.error(scrubSecrets(error.stack ?? error, secrets));
  await alert(`Triage of #${issue.number} failed: ${issue.html_url}`);
  process.exitCode = 1;
});
