# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

The UI migration's status, the user's decisions and the working rules for it are in the handoff below, so every session (on any machine) starts with them:

@docs/ui-migration-handoff.md

## Project

Nuzlocke Tracker (https://nuzlocke.netlify.app) — a client-side PWA for tracking Pokémon Nuzlocke runs. React 18 + TypeScript + Vite 8, Zustand (with immer + persist) for state, Semantic UI React and SCSS modules for most components, migrating area by area to shadcn/ui (Radix) and Tailwind v4, i18next for translations (en/es/de), Sentry for error reporting. Deployed to Netlify automatically from `master`. Node version is pinned in `.node-version`.

## Commands

```bash
npm run verify        # THE gate: typecheck → lint → format:check → unit+coverage → build → Playwright e2e (chromium) + state goldens → merged threshold
npm run verify:fast   # same without coverage and e2e; fine for tooling-only changes, run the full gate before pushing
npm run dev           # Vite dev server on http://localhost:3000
npm run dev:cov       # same, Istanbul-instrumented (REACT_APP_COVERAGE=true), HMR off
npm run typecheck     # tsc for src (Vitest types) and tests/ (Playwright) separately
npm run lint          # eslint .            (lint:fix to autofix)
npm run format:check  # prettier --check .
npm run test          # vitest watch        (test:unit = single run, test:unit:cov = with coverage)
npm run pw:e2e        # Playwright e2e on chromium (starts its own instrumented dev server on :3001)
npm run pw:e2e:all    # chromium + firefox + webkit
npm run verify:state  # persisted-store goldens (tests/state)
npm run verify:visual # visual + ARIA + a11y baselines, inside the pinned Playwright Docker image
npm run seeds         # regenerate verification/seeds by driving the app
npm run coverage      # merges unit + raw e2e coverage → coverage/merged, enforces thresholds
```

- Single unit test: `npx vitest run src/store.test.ts` (or `-t "<test name>"`).
- Single e2e spec: `npx playwright test tests/e2e/main/Encounters.spec.ts --project=chromium` (add `-g "<title>"`, `--headed`, or `--debug`). A failure leaves a trace: `npx playwright show-trace test-results/<test>/trace.zip`.
- Playwright reuses a server already on :3001 outside CI. If that server isn't instrumented, `npm run coverage` fails with "has no files"; stop it (`Get-NetTCPConnection -LocalPort 3001`) and rerun. Local Node is 24.20 (winget's latest LTS); CI and Netlify use 24.22 from `.node-version`.

### Verification harness (Playwright)

Use the `verify-nuzlocke` skill (`.claude/skills/verify-nuzlocke/`) to drive the running app and prove a change: `control-nuzlocke.mjs` (launch/doctor/seed/goto/click/pick/type/snapshot/screenshot/state/cleanup on 127.0.0.1:3100) and a feature map with one file per feature. Pins that every UI change is held to:

- **e2e** (`tests/e2e`, import files in `tests/data`): ported from Cypress, which they replaced after a per-file coverage comparison showed Playwright covered every statement, branch and function Cypress did. Everything that touches UI-library markup lives in `tests/e2e/helpers.ts`; a library swap changes helper bodies, not specs. Select by `data-testid`; pick games with `selectGame`. The config blocks the dev PWA service worker, which would otherwise serve pages around init scripts and coverage. Coverage comes from `window.__coverage__` per worker (`tests/fixtures.ts`).
- **State goldens** (`tests/state`, `__goldens__/`): journeys from a seed record what they changed in `localStorage["pokemon-tracker"]`. A UI-only change must leave them byte-identical (CI requires the `state-change-approved` label otherwise). Ids from `Date.now()` become numbered placeholders, arrays of records are diffed by `id`, values over 300 chars become hashes.
- **Visual/ARIA/a11y baselines** (`tests/visual`, `__baselines__/`): 25 states × light/dark × desktop/mobile, compared at `threshold: 0`. Only render them with `npm run verify:visual` (Docker) or in CI's container: the visual project launches Chromium with software rasterization (GPU raster gave 8–24 px of corner noise), and the default 0.2 threshold hid dark-theme changes. Each state is tagged with every area it renders (its own, its page's, `@shell`): the sidebar over the tracker is a tracker state too.
- **Seeds** (`verification/seeds`): persisted stores produced by `npm run seeds`. `src/verification.seeds.test.ts` fails when one stops loading at the current persist version; regenerate them after a store-shape change.

**Change protocol for UI work** (enforced on PRs by `.github/workflows/review.yml`): `scripts/affected-areas.mjs` maps the diff to areas through the real import graph (aliases, named imports through barrels, SCSS `@use`; it stops at the router; `verification/areas.json` lists roots and global files). Every visual state outside those areas must match exactly. Baselines may change only for touched areas and need a glob row in `verification/approved-diffs.tsv`; `scripts/baseline-guard.mjs` also rejects edited goldens and new `skip`/`only`/masks/looser thresholds. `scripts/migration-ratchet.mjs` keeps the Semantic UI file, Sass file and hex-colour counts in `verification/ratchet.json` from going up (lower them with `--update`). Bundle size (+5% budget), dependency review and changed-line coverage (80%, in `main.yml`) also run. Update baselines with `npm run verify:visual -- --grep @<area> --update-snapshots`, log them, and never update an untouched area to make a diff pass. ARIA snapshots match loosely (a template without a name matches a named node), so a plain update leaves a newly named control unnamed in its baseline; when a change adds names, update that area with `--update-snapshots=all`.

Porting and harness gotchas:

- Cypress `force` clicks dispatch to the element; Playwright's `force` still clicks at coordinates. Ported as `dispatchEvent('click')`.
- `cy.type` goes through intermediate values (the ruleset-name input warns on a partial match); ported as keystrokes (`typeInto`), and `cy.clear` explicitly. `fill` skips them.
- `focus()` leaves the caret at the start, so `typeInto` moves it to the end first with `setSelectionRange` (number inputs, which lack it, go through `type = 'text'` and back). Not with an End press: on macOS End scrolls the page, which scrolled the virtualized tracker past `pokemon-1` in Options › Settings.
- Cypress's Chrome followed the OS dark theme, so e2e projects use `colorScheme: 'dark'`.
- Cypress `contains` matches CSS-uppercased text; Playwright matches DOM text. Assert a "not present" check's target exists first, or it can never fail (the PokéStats section checks could not).
- Hovering a badge clears its grayscale filter: move the pointer away before asserting. The first tracker row's nature menu opens under the badge strip (`pickOption(..., { covered: true })`). With several Builder members, the team panel covers the next member's delete button. All three are real UI issues for the redesign.
- Only dialogs with an `onClose` close on Escape today (pinned in `tests/e2e/main/Interactions.spec.ts`); Radix closes all of them by default.
- Playwright's own Firefox build won't start on this Windows machine ("side-by-side configuration is incorrect"); Firefox runs in CI's Linux container.
- From Git Bash, the control CLI accepts routes without a leading slash (`goto rules`); MSYS rewrites `/rules` into a Windows path. Git Bash's GNU `tar` reads `C:` as a remote host, so `scripts/visual.mjs` copies files with Node.

### Debugging CI failures

- Don't guess from a failing check name; read the logs. This `gh` version has no `gh run view --json jobs`, so use `gh api repos/diballesteros/nuzlocke/actions/runs/<run-id>/jobs` and `gh api repos/diballesteros/nuzlocke/actions/jobs/<job-id>/logs`. Failed Playwright jobs upload `playwright-<browser>-<shard>` artifacts with traces; the PR review workflow uploads `visual-report` and `state-report`.
- To reproduce CI's browsers, use the `mcr.microsoft.com/playwright:v<version>-noble` image (the tag follows `@playwright/test`). `scripts/visual.mjs` shows the recipe: copy the repo's tracked and unignored files into the container (never the Windows `node_modules`), `npm ci`, then `npx playwright test`. Docker Desktop is installed but may be stopped, so start it first. Run raw `docker` commands from Bash with `MSYS_NO_PATHCONV=1`, or Git Bash rewrites `/src` into a Windows path.
- A visual diff of a fraction of a pixel (everything below some point re-anti-aliased) only shows with the container's fonts, so Windows measurements can't find it. Measure inside the image instead:
  - Serve master from a worktree (`git worktree add <dir> origin/master`, then a junction to this checkout's `node_modules` with `mklink /J`) and the branch, each with `npx vite --port <p> --host 0.0.0.0`.
  - Run a script in `mcr.microsoft.com/playwright:v<version>-noble` that requires the mounted `playwright-core` (it is pure JS) and opens both. Use the host's IP from `dns.lookup('host.docker.internal')`: Vite rejects that hostname.
  - Compare `getBoundingClientRect()` of the same elements. A row that stays too tall when one icon is hidden may be stretched by a sibling's icon: hide them all at once.
  - Remove the junction with `rmdir` before `git worktree remove`, so `node_modules` isn't deleted.
- A fix isn't done until the CI run is green. Watch it in the background with `gh run watch <run-id> --repo diballesteros/nuzlocke`, then `gh pr checks <pr>`; the 3 Netlify checks are always skipped on PRs. This `gh` has no `gh run list --commit`: filter with `--json databaseId,headSha --jq` instead. `gh pr edit` fails on a Projects (classic) deprecation error; edit a PR body with `gh api -X PATCH repos/diballesteros/nuzlocke/pulls/<n> -F body=@<file>`.

### Security advisories

- Check Dependabot alerts with `gh api --paginate repos/diballesteros/nuzlocke/dependabot/alerts?state=open --jq '.[]'` (the `--jq` is needed; plain `--paginate` concatenates JSON arrays). Compare each alert's vulnerable range against `package-lock.json` with semver, using `origin/master` after a `git fetch` (local `master` can be stale).
- Fix with plain `npm audit fix` (lockfile only), then `npm run verify`. Never `npm audit fix --force`: it downgrades majors. The remaining moderates in the `@istanbuljs/load-nyc-config` → `js-yaml` chain (under `vite-plugin-istanbul`) only affect test tooling and are left on purpose, because npm's only fix is a downgrade that breaks coverage.

Prettier: single quotes, 100 col, es5 trailing commas, `quoteProps: preserve`.

## Verification workflow

Every change, and especially every dependency bump, must pass `npm run verify` before it's committed. Behaviour must stay the same unless the user asks otherwise.

- **Coverage** comes from Vitest (`coverage/unit`) plus Playwright (via `vite-plugin-istanbul`; raw data per worker in `coverage/playwright/raw/`, cleared at the start of each run), merged by `scripts/coverage.mjs` (`coverage-lib.mjs`). The script remaps the raw e2e data with Vitest's own remapper (`@vitest/istanbul-lib-source-maps`), so both sides get identical statement, branch and function maps. The instrumented server (`REACT_APP_COVERAGE=true`) turns HMR off so no Fast Refresh code is instrumented. If unit and e2e maps ever drift apart, the merge double-counts or under-counts. Exclusions (static data tables, tests) live in `COVERAGE_EXCLUDE` in `vite.config.ts` and are shared by both tools. Thresholds in `scripts/coverage.mjs` are a ratchet: raise them, never lower them.
- **Vite 8 compatibility shims** in `vite.config.ts`, all to be removed with Semantic UI: `legacy.inconsistentCjsInterop` (default imports from `semantic-ui-react/dist/commonjs/*`) and `build.cssMinify: 'esbuild'` (Lightning CSS rejects an invalid semantic-ui-css selector). `build.target` is pinned to Vite 7's defaults to keep browser support unchanged.
- **CI** (`.github/workflows/main.yml`) runs the static checks and unit coverage, a Playwright browser × shard matrix (chromium, firefox, webkit × 3) in the `mcr.microsoft.com/playwright` image, then a `coverage` job that merges every report and checks changed-line coverage. `review.yml` runs the blast-radius checks on PRs.
- **Unit tests** that act as upgrade safety nets: `src/store.test.ts` (persist key/version, `migrate` for every version, rehydration), `src/store.actions.test.ts`, `src/selectors.test.ts` (inline snapshots of type maths), `src/constants/data.test.ts`, `src/i18n.test.ts` (stored language applied at startup by the custom async detector, fallback, plurals), and `src/hooks/useCalculate.golden.test.ts` (snapshot of damage ranges for gens 1–8; a calc upgrade that changes any number fails it).
- `src/constants/data.test.ts` checks game data and locale integrity against an exact `KNOWN_ISSUES` list of existing data bugs (misspelled names, missing tables, locale key drift). A new problem fails the test. When fixing a known one, delete its entry.
- Accounts (Supabase auth and cloud saves) were removed in Phase 0. Runs live only in localStorage; `/delete` stays as a notice that accounts were discontinued, because outside links may point to it.
- **Held or pinned dependencies (deliberate, don't "fix" them):** React 19 and `@types/react*` 19 (semantic-ui-react needs `findDOMNode`); TypeScript 7 (`typescript-eslint` supports `<6.1`); `@types/node` 24 (matches the Node 24 runtime); `@vitest/istanbul-lib-*` on the same version `@vitest/coverage-istanbul` depends on, so e2e and unit remapping stay identical. The `overrides` let `eslint-plugin-react` and `jsx-a11y` run on ESLint 10 before they declare support.
- **Behaviour shims from upgrades** (each keeps the old behaviour and is tested): `getPokemon` passes 252 EVs in Gens 1–2 (no EV inputs; calc ≥ 0.11 reads EVs); encounter rows use `toTopPosition` (react-window 2 transforms trap dropdowns); `scrollToRow` is clamped; `Sentry.init` sets v11 options back to v10 data-collection and telemetry behaviour.
- Sass and Semantic UI React are being replaced by Tailwind v4 + shadcn/ui; follow the `nuzlocke-ui` skill (`.claude/skills/nuzlocke-ui/`) for tokens, `@source`, primitives and locators. Keep changes to unmigrated Semantic/Sass code minimal. semantic-ui-react 2.x needs React ≤ 18 (it uses `findDOMNode`), so React 19 waits for that replacement.

## Known issues (left as-is while behaviour is frozen)

- **Game data and locale bugs:** listed exactly in `KNOWN_ISSUES` in `src/constants/data.test.ts`. That covers one misspelled Pokémon name in `filters.ts` (`Hatterne` in swsh-30, which could be Hatterene or Hattrem, so it's never matched for that location), two locations without an encounter table, and a duplicate encounter id in OR/AS. Locale keys match across en/es/de, so `localeKeys` is empty and `src/i18n.test.ts` tests the English fallback with a key it adds itself.
- **Calculator:** an empty IV field reaches `@smogon/calc` as `undefined` and every stat becomes `NaN`. It's recorded in `src/components/Calculator/Calculator.test.ts`; update that test when fixing it.
- **Calculator wording (upstream):** since `@smogon/calc` 0.11, "possible nHKO" texts no longer say "after Spikes" (other KO texts still do). Hazards are still counted in the KO number.
- **react-toastify CSS loads twice:** `src/index.tsx` imports `ReactToastify.css`, and toastify ≥ 11.1 also injects its own styles. Harmless; drop the import during the styling rewrite.
- **Flaky e2e:** once on Vite 8, Cypress's `Calculator.spec.ts` timed out waiting for the page `load` event (60 s), and Playwright's WebKit keyboard test failed once while the machine was busy. Both passed on every rerun. WebKit's `Rules › Over 6 alert` failed three times in CI (2026-10-21/22) from a race in the test, now fixed: Semantic's `Popup` opens on hover after 50 ms and toggles on click, so on a slow run the hover opened it and the click closed it. Open popups with `openPopup` (`tests/e2e/helpers.ts`), which dispatches the click without moving the pointer. If it recurs, look at dev-server cold transforms of the large constants files.

## Architecture

### Imports

`vite.config.ts` defines bare-path aliases: `components`, `common`, `constants`, `hooks`, `store`, `selectors`, `assets`, `locale`, `error`, `routes`, and `@` → `src` (also a tsconfig path, so shadcn's `@/lib/utils` imports type-check). Use these (e.g. `import useStore from 'store'`) rather than relative paths. Every SCSS module automatically gets `@use "@/assets/styles" as *;` injected. Env vars must be prefixed `REACT_APP_` (`envPrefix`) and are read via `import.meta.env`.

### State (`src/store.ts`)

A single Zustand store, persisted to localStorage under the key `pokemon-tracker`, holds everything: games, encounters, badges, rules, team, summary, calculator forms, settings. Most per-game state is a dictionary keyed by the game's `value` string (`'1'`…`'13'`, `'13.1'`, and custom games), always indexed via `state.selectedGame.value`. A custom game's key is the last key + 1, so because the last base game is `'13.1'`, custom games get `'14.1'`, `'15.1'`, …; saved data depends on this. Actions mutate draft state with immer.

**Changing the persisted state shape requires bumping `version` in the persist config and adding a `version < N` branch in `migrate`** so existing users' localStorage is upgraded. Derived data (team, type suggestions, etc.) lives in `src/selectors.ts`. Encounter status `value === 7` means "on team".

### Game data (`src/constants/`)

Large static data files drive the app; most bug fixes and content updates are edits here, not in components:

- `constant.ts` — `GAMES` list, `INITIAL_STATE`, `GAME_KEY_DICTIONARY` (game key → encounter list), `GAME_GENERATION`, default rulesets.
- `locations/*.ts` — per-game encounter location lists (`TEncounter[]`). Each location has a `filterKey` (e.g. `frlg-3`).
- `filters.ts` — maps each `filterKey` to the Pokémon names available at that location (encounter tables).
- `badges.ts` — gym/trial badges, `LEVEL_CAPS`, `GAME_CAP_DICTIONARY`, badge images.
- `details.ts` — gym leader / Elite Four teams shown in badge details.
- `pokemon.ts`, `moves.ts`, `abilities.ts`, `natures.ts`, `effectiveness.ts`, `types.ts` (all shared TS types live in `types.ts`).
- Damage calculator uses `@smogon/calc` (`calculator.ts`, `hooks/useCalculate.ts`).

Changing `pokemon.ts` may require updating `tests/data/PokemonList.json` to keep e2e tests passing.

### UI

- `src/styles/globals.css` holds the design tokens (light on `:root`, dark on `:root.dark`; `App.tsx` toggles the `dark` class from the store) and Tailwind without preflight. Tailwind only generates utilities for directories in its `@source` list, because automatic detection would restyle Semantic markup that uses words like `container` or `hidden` as class names. shadcn primitives go in `src/components/ui/` (`npx shadcn@4.22.1 add <name>`), added in the PR that first uses them.

- `src/routes/AppRouter.tsx` — route table; each page is wrapped in a Sentry error boundary.
- `src/components/<Name>/<Name>.tsx` + `<Name>.module.scss`, with page-specific subcomponents under `<Name>/elements/`. Top-level components are re-exported from `src/components/index.ts`.
- `src/common/` — reusable selectors/widgets (Pokemon, item, encounter selectors, page wrapper, etc.).
- Translations: `src/locale/{en,es,de}/<namespace>.json`, registered in `src/i18n.ts`. Any new user-facing string must be added to all three locales.

## Releases

Versions follow SemVer and are done on `version/X.Y.Z` branches merged into `master`. A release bump touches: `package.json` version (exposed to the app as `REACT_APP_VERSION` via `.env`, which triggers the in-app "new version" notice), `CHANGELOG.md`, and a new entry at the top of `src/constants/changelog_2.ts` (the in-app changelog). Commit messages use the form `feat(X.Y.Z): <description>`.
