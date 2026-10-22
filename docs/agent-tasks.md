# Small tasks for a follow-up agent

These are low-risk tasks. Each one has an exact file list, an expected result, and a point at which to stop and ask. None of them touches the persisted store, Semantic UI widgets, Sass or anything under `src/components/`, so they don't collide with the UI migration running in parallel (Phase 2 slices such as #830 and #831). Do them in order, **one task per branch and PR**.

Read `CLAUDE.md` first. Everything below assumes its commands and rules.

## Ground rules (hard stops)

Stop and report back instead of working around any of these:

1. **State goldens changed.** If `npm run verify` fails in `tests/state` (the persisted-store journeys), the task broke stored data. No task here should change them.
2. **A visual baseline changed.** No task in this batch expects a baseline change. Never update baselines to make a check pass.
3. **Never edit or loosen the harness.** Don't touch `tests/`, `playwright.config.ts`, `scripts/`, `verification/` or `.github/`. The only exception is Task 2, which may edit the `uses:` lines in `.github/workflows/` as it describes, and nothing else there. Don't add `.skip`, `.only`, retries, masks or thresholds.
4. **Never lower a number.** That covers the coverage thresholds in `scripts/coverage.mjs` and the counts in `verification/ratchet.json`.
5. **No guessing.** If a step needs a fact that isn't in this file or in a source the task names, leave it out and list it in the PR.
6. **Don't touch these:**
   - anything under `src/components/` or `src/common/`: the UI migration owns them
   - `package.json` and `package-lock.json`
   - the items under "Not for this agent" at the end

## Workflow for every task

Use a separate worktree per task, so the main checkout (where the UI migration works) is never switched or left mid-merge:

```bash
git fetch origin
git worktree add -b <type>/<short-name> ../nuzlocke-task-<short-name> origin/master
cd ../nuzlocke-task-<short-name>
npm ci
```

1. Make the change.
2. Run `npm run verify` unless the task says otherwise. It must pass. On Windows, if coverage says "has no files", follow the port-3001 note in `CLAUDE.md`.
3. Run `npm run verify:visual` (needs Docker Desktop running) unless the task says otherwise. It must report 0 failures.
4. Before committing, run `git status`. On Windows, Vitest rewrites `src/hooks/__snapshots__/useCalculate.golden.test.ts.snap` with different line endings. That isn't a real change: restore it with `git checkout -- <file>` and never commit it.
5. Commit with a conventional message (`fix: …`, `chore: …`, `docs: …`), then push and open a PR with `gh pr create --base master`. The PR body says:
   - what changed
   - what `verify` and `verify:visual` reported (or why the task skips them)
   - anything you skipped, and why
6. Wait for CI (`gh pr checks <number>`). The blast-radius bot comments the affected areas. A red check is a stop, unless the logs show an obvious mistake in your change (`CLAUDE.md` → "Debugging CI failures").

### CI situations from the last batch

- **The PR conflicts with master** (`gh pr view <n> --json mergeable` says `CONFLICTING`). GitHub doesn't run the "Blast radius" workflow on a conflicting PR, so its checks silently never appear. Merge `origin/master` into the branch, resolve, run `npm ci` again if `package-lock.json` changed, re-run `verify`, and push. An empty commit doesn't help here. If the conflict isn't obvious, stop and report.
- **A job stays "in progress" after it finished.** The run shows completed, the job's own steps all succeeded, and jobs that depend on it (such as `coverage`) already passed, but `gh pr checks` keeps it pending. Rerunning the job reproduces the problem. Push an empty commit (`git commit --allow-empty -m "ci: rerun checks (<job> of run <id> stuck in progress)"`) to get a fresh run.

---

## Batch 2

### Task 1: Stop ImgBot from rewriting the visual baselines

**Why:** ImgBot opened #828 to "optimize" 94 PNGs under `tests/visual/__baselines__/`. Those baselines are compared at `threshold: 0`, so any re-encoding breaks the visual check (that PR was closed). The repo has no `.imgbotconfig`, so ImgBot will keep proposing it.

**Files:** a new `.imgbotconfig` at the repository root. Nothing else.

**Steps:**

1. Create `.imgbotconfig` with exactly:

   ```json
   {
     "ignoredFiles": ["tests/visual/__baselines__/*"]
   }
   ```

   The baselines folder has no subfolders, so `/*` covers every file in it. Check the pattern syntax against ImgBot's documentation for `ignoredFiles` before committing.

2. Don't add other settings (schedule, aggressive compression, etc.). Other images in the repo stay eligible for optimization.

**Checks:** `npm run verify:fast` is enough (no source file changes). Skip `verify:visual`.

**Done when:**

- `npm run format:check` passes.
- CI is green, and the blast-radius comment lists no affected areas.

### Task 2: Move GitHub Actions off Node 20

**Why:** every CI job logs `Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24`. The actions are pinned to `@v4`.

**Files:** `.github/workflows/main.yml` and `.github/workflows/review.yml`. This is the one task allowed in `.github/` (ground rule 3), and only for these edits:

- the version in each `uses: <action>@vN` line
- the `with:` inputs of a step, only when the new major's release notes require it

Nothing else in the workflows changes: no new jobs, steps, conditions, permissions, triggers, timeouts, container options or matrix values.

**Actions in use** (all `@v4` today): `actions/checkout`, `actions/setup-node`, `actions/upload-artifact`, `actions/download-artifact`, `actions/dependency-review-action`.

**Steps:**

1. For each action, find the newest major and check that it runs on Node 24. Don't rely on memory, read the source:

   ```bash
   gh api repos/actions/checkout/releases/latest --jq .tag_name
   gh api "repos/actions/checkout/contents/action.yml?ref=<tag>" --jq .content | base64 -d | grep using
   ```

   Use the newest major whose `action.yml` says `using: node24`. If an action has no such major yet, leave it on `@v4` and say so in the PR.

2. Read the release notes for every major between v4 and the target (`gh release view <tag> --repo actions/<name>`), and list the breaking changes that apply here in the PR. Things to check in particular:
   - `upload-artifact` and `download-artifact` must be on majors that can read each other's artifacts. The `coverage` job in `main.yml` and the visual/state jobs in `review.yml` download artifacts that other jobs upload.
   - `setup-node`'s caching behaviour. The workflows set `cache: npm` explicitly; `package.json` has no `packageManager` field.
   - `checkout`'s defaults that the workflows rely on (`fetch-depth: 0` in `review.yml`, credentials for later `git` commands).
   - The `playwright` job runs in a container as `--user 1001`. The new majors must work there.
3. Keep the existing pin style (`@vN`, major only). Don't switch to commit SHAs.

**Checks:** `npm run verify:fast` locally (nothing in the app changes). Skip `verify:visual`. The real test is CI.

**Done when:**

- Both the "CI" and "Blast radius" runs on the PR are green, including `coverage`, `visual` and `state`, which use downloaded artifacts.
- No job log contains the Node 20 warning: for each job of both runs, `gh api repos/diballesteros/nuzlocke/actions/jobs/<id>/logs | grep "Node.js 20 is deprecated"` prints nothing. Get job ids with `gh api repos/diballesteros/nuzlocke/actions/runs/<run-id>/jobs --jq '.jobs[]|"\(.id) \(.name)"'`.

**Stop if:** a new major needs a change outside the allowed edits, or a job fails for a reason the release notes don't explain.

### Task 3: Bring the GitHub Pages copy of the README up to date

**Why:** GitHub Pages serves https://diballesteros.github.io/nuzlocke/ from `docs/` on `master`, so `docs/index.md` is the project's public page. It's an old copy of `README.md`: it still says Create-React-App, tells people to install and run yarn (`yarn`, `yarn start`, `yarn test`), and shows badges for a CodeQL workflow and Codecov that no longer exist.

**Files:** `docs/index.md` only. Don't edit `README.md`.

**Steps:**

1. Replace the contents of `docs/index.md` with the contents of `README.md`.
2. Then add back the `## Contact` section that `docs/index.md` has today, as the last section, unchanged. `README.md`'s table of contents links to `#contact` but has no Contact section. Don't fix that in `README.md`: mention it in the PR for the owner.
3. Run `npx prettier --write docs/index.md` if `format:check` complains.

**Checks:** `npm run verify:fast` is enough (docs only). Skip `verify:visual`.

**Done when:**

- `git diff --no-index README.md docs/index.md` shows only the added Contact section.
- `npm run format:check` passes and CI is green.

### Task 4: ~~Investigate the flaky WebKit test `Rules › Over 6 alert`~~ (done, don't pick up)

Resolved in #830 on 2026-10-22, so there's nothing left to investigate and no issue to open. The cause was a race in the test, not WebKit: Semantic's `Popup` opens on hover after 50 ms and toggles on click, so when the browser was slow the hover opened the alert and the click closed it again. Tests now open popups with `openPopup` in `tests/e2e/helpers.ts`, which dispatches the click without moving the pointer. If a popup test flakes again, check that it uses `openPopup` before anything else.

---

## Batch 1 (done)

Merged on 2026-10-22: Spanish/German locale keys (#824), misspelled encounter-table names (#826), `onKeyPress` → `onKeyDown` (#827), and allowing pinch-zoom (#829). The full task text is in the git history of this file.

## Not for this agent

These need a decision from the owner, or they belong to the migration phases:

- **Owner decision needed:**
  - `Hatterne` in swsh-30 (Lake of Outrage): Hatterene or Hattrem.
  - The two locations without an encounter table, Rocket Hideout (`frlg-30`) and Royal Avenue (`usum-51`): an empty table, or real encounters.
  - The Calculator empty-IV `NaN` bug: which default IV to use.
  - Missing PWA icons (`pwa-192x192.png`, `pwa-512x512.png`) and the duplicate manifests.
  - Workbox caching Google Fonts that are never loaded.
  - Light mode never resetting `--placeholder`.
  - Dependabot alert #227 (`sprintf-js`, moderate, no patched version): it's in the test-only `@istanbuljs/load-nyc-config` → `js-yaml` → `argparse` chain that `CLAUDE.md` already leaves on purpose.
- **Migration work (Phase 2 onward):**
  - The duplicate `ReactToastify.css` import: CSS order changes screenshots.
  - Colour contrast fixes and hard-coded hex colours.
  - Icon-only buttons without labels.
  - Clickable `div`s.
  - The leftover `Image.propTypes = {}` in `src/components/Pokestats/elements/Image/Image.tsx`.
  - The React 19 upgrade.
