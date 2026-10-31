// Entry point of the draft job in .github/workflows/triage-fix.yml: Claude edits the checkout with
// the approved plan, and the result leaves as a patch. This job can't push. The job that can
// checks the patch (check-patch.mjs) and runs no model.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import Anthropic from '@anthropic-ai/sdk';

import { buildTools, runLoop } from './claude.mjs';
import { createGitHub } from './github.mjs';
import {
  buildIssueMessage,
  FIX_SCHEMA,
  FIX_SYSTEM,
  isOwnReview,
  prBody,
  scrubSecrets,
} from './lib.mjs';

const [outDir] = process.argv.slice(2);
const { issue } = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
const secrets = [process.env.ANTHROPIC_API_KEY, process.env.GITHUB_TOKEN];
const github = createGitHub({
  token: process.env.GITHUB_TOKEN,
  repository: process.env.GITHUB_REPOSITORY,
});
const env = { PATH: process.env.PATH };

const setOutput = (line) => fs.appendFileSync(process.env.GITHUB_OUTPUT, `${line}\n`);

const main = async () => {
  const review = (await github.comments(issue.number)).find(isOwnReview);
  if (!review) throw new Error('This issue has no triage review to implement.');

  const tools = buildTools({ searchIssues: github.searchIssues, canEdit: true });
  const { result, refused } = await runLoop({
    client: new Anthropic(),
    system: FIX_SYSTEM,
    user: buildIssueMessage(
      issue,
      [],
      `The approved triage review, which holds the plan:\n<approved_review>\n${review.body.replace(/</g, '\\u003c')}\n</approved_review>`
    ),
    tools,
    schema: FIX_SCHEMA,
    effort: 'high',
    maxTurns: 40,
  });

  fs.mkdirSync(outDir, { recursive: true });
  execFileSync('git', ['add', '-N', '.'], { env });
  const patch = execFileSync('git', ['diff', '--binary'], {
    encoding: 'utf8',
    env,
    maxBuffer: 64 * 1024 * 1024,
  });
  if (refused || !result.changed || !patch.trim()) {
    console.info(refused ? 'The model declined.' : 'No edit was made.');
    setOutput('has_patch=false');
    return;
  }
  fs.writeFileSync(path.join(outDir, 'fix.patch'), patch);
  fs.writeFileSync(
    path.join(outDir, 'body.md'),
    prBody({ number: issue.number, summary: result.summary, tests: result.tests }, { secrets })
  );
  setOutput('has_patch=true');
};

main().catch((error) => {
  console.error(scrubSecrets(error.stack ?? error, secrets));
  process.exitCode = 1;
});
