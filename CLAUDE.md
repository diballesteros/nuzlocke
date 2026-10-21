# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Nuzlocke Tracker (https://nuzlocke.netlify.app) — a client-side PWA for tracking Pokémon Nuzlocke runs. React 18 + TypeScript + Vite 8, Zustand (with immer + persist) for state, Semantic UI React for components, SCSS modules for styling, i18next for translations (en/es/de), Supabase for optional auth/sharing, Sentry for error reporting. Deployed to Netlify automatically from `master`. Node version is pinned in `.node-version`.

## Commands

```bash
npm run verify        # THE gate: typecheck → lint → format:check → unit+coverage → build → e2e+coverage → merged threshold
npm run dev           # Vite dev server on http://localhost:3000
npm run dev:cov       # same, Istanbul-instrumented (CYPRESS_COVERAGE=true), HMR off
npm run typecheck     # tsc for src (Vitest types) and cypress/ (Cypress types) separately
npm run lint          # eslint .            (lint:fix to autofix)
npm run format:check  # prettier --check .
npm run test          # vitest watch        (test:unit = single run, test:unit:cov = with coverage)
npm run e2e:run       # starts dev:cov, runs all Cypress specs headless in Chrome
npm run coverage      # merges unit + raw e2e coverage → coverage/merged, enforces thresholds
npm run e2e           # Cypress UI (needs a dev server on :3000)
```

- Single unit test: `npx vitest run src/store.test.ts` (or `-t "<test name>"`).
- Single e2e spec headless: `npx cypress run --browser chrome --spec cypress/e2e/main/Encounters.spec.ts` (dev server must be up on port 3000).
- Port 3000 must be free before `e2e:run`. If another server holds it, `dev:cov` exits and the specs run against the uninstrumented server; `npm run coverage` then fails with "has no files". Stopping a backgrounded `vite` shell can leave its `node` child running, so check the port (`Get-NetTCPConnection -LocalPort 3000`) and stop the owning process.
- Firefox is installed locally (winget `Mozilla.Firefox`; CI's image may be a version ahead): `npx cypress run --browser firefox --spec "cypress/e2e/main/*"`. `e2e:run` uses Chrome only. Some failures happen only on CI's Linux Firefox and not locally; failure screenshots are uploaded as `screenshots-*` artifacts on the workflow run. Local Node is 24.20 (winget's latest LTS); CI and Netlify use 24.22 from `.node-version`.
- Semantic UI `Checkbox` focuses its hidden input on mousedown. On Firefox ≥ 158 that focus can undo the scroll Cypress does before a click, so mouseup lands elsewhere and the toggle is silently dropped (seen in the PokéStats settings panel). Click those labels with `{ scrollBehavior: false }` and assert the `checked` class after each toggle. Real users aren't affected (no pre-click scroll). To reproduce CI's exact browsers, run the spec inside the `cypress/browsers:<.node-version>` Docker image (Docker Desktop is installed); run `docker` from Bash with `MSYS_NO_PATHCONV=1`.

Prettier: single quotes, 100 col, es5 trailing commas, `quoteProps: preserve`.

## Verification workflow

Every change, and especially every dependency bump, must pass `npm run verify` before it's committed. Behaviour must stay the same unless the user asks otherwise.

- **Coverage** comes from Vitest (`coverage/unit`) plus Cypress (via `vite-plugin-istanbul` and `@cypress/code-coverage`; raw data in `coverage/e2e/raw/out.json`), merged by `scripts/coverage.mjs`. The script remaps the raw e2e data with Vitest's own remapper (`@vitest/istanbul-lib-source-maps`), so both sides get identical statement, branch and function maps. nyc's report in `coverage/e2e` is only a console summary and is not used. `dev:cov` turns HMR off so no Fast Refresh code is instrumented. If unit and e2e maps ever drift apart, the merge double-counts or under-counts. Exclusions (static data tables, tests, Auth) live in `COVERAGE_EXCLUDE` in `vite.config.ts` and are shared by both tools. Thresholds in `scripts/coverage.mjs` are a ratchet: raise them, never lower them.
- **Vite 8 compatibility shims** in `vite.config.ts`, all to be removed with Semantic UI: `legacy.inconsistentCjsInterop` (default imports from `semantic-ui-react/dist/commonjs/*`) and `build.cssMinify: 'esbuild'` (Lightning CSS rejects an invalid semantic-ui-css selector). `build.target` is pinned to Vite 7's defaults to keep browser support unchanged.
- **CI** (`.github/workflows/main.yml`) runs the static checks and unit coverage, then a browser × spec-group × container matrix against `dev:cov`, then a `coverage` job that merges every container's report.
- **Unit tests** that act as upgrade safety nets: `src/store.test.ts` (persist key/version, `migrate` for every version, rehydration), `src/store.actions.test.ts`, `src/selectors.test.ts` (inline snapshots of type maths), `src/constants/data.test.ts`, `src/i18n.test.ts` (stored language applied at startup by the custom async detector, fallback, plurals), and `src/hooks/useCalculate.golden.test.ts` (snapshot of damage ranges for gens 1–8; a calc upgrade that changes any number fails it).
- `src/constants/data.test.ts` checks game data and locale integrity against an exact `KNOWN_ISSUES` list of existing data bugs (misspelled names, missing tables, locale key drift). A new problem fails the test. When fixing a known one, delete its entry.
- **Cypress conventions:** select by `data-testid`. Pick games with `cy.selectGame('<name>')` (in `cypress/support/commands.ts`), not raw dropdown clicks. `cypress/support/e2e.ts` blocks the dev PWA service worker. Without that, reloads skip Cypress's `window:before:load`, so stubs and coverage silently stop working.
- Auth/Supabase (`src/components/Auth`) is going to be removed. Don't add tests for it.
- **Held or pinned dependencies (deliberate, don't "fix" them):** React 19 and `@types/react*` 19 (semantic-ui-react needs `findDOMNode`); TypeScript 7 (`typescript-eslint` supports `<6.1`); `@types/node` 24 (matches the Node 24 runtime); `@babel/core` 7.x (`@cypress/code-coverage` needs Babel 7; it's declared so npm resolves plugin-react's optional Babel peer); `@vitest/istanbul-lib-*` on the same version `@vitest/coverage-istanbul` depends on, so e2e and unit remapping stay identical. The `overrides` let `eslint-plugin-react` and `jsx-a11y` run on ESLint 10 before they declare support.
- **Behaviour shims from upgrades** (each keeps the old behaviour and is tested): `getPokemon` passes 252 EVs in Gens 1–2 (no EV inputs; calc ≥ 0.11 reads EVs); encounter rows use `toTopPosition` (react-window 2 transforms trap dropdowns); `scrollToRow` is clamped; `Sentry.init` sets v11 options back to v10 data-collection and telemetry behaviour.
- Sass and Semantic UI React will be replaced (Tailwind is planned). Keep changes to them minimal. semantic-ui-react 2.x needs React ≤ 18 (it uses `findDOMNode`), so React 19 waits for that replacement.

## Known issues (left as-is while behaviour is frozen)

- **Game data and locale bugs:** listed exactly in `KNOWN_ISSUES` in `src/constants/data.test.ts`. That covers 30 misspelled Pokémon names in `filters.ts` (never matched for their location), two locations without an encounter table, a duplicate encounter id in OR/AS, and es/de `common.json` key drift (the Spanish file has the key `sincronizando` instead of `syncing`).
- **Calculator:** an empty IV field reaches `@smogon/calc` as `undefined` and every stat becomes `NaN`. It's recorded in `src/components/Calculator/Calculator.test.ts`; update that test when fixing it.
- **Calculator wording (upstream):** since `@smogon/calc` 0.11, "possible nHKO" texts no longer say "after Spikes" (other KO texts still do). Hazards are still counted in the KO number.
- **react-toastify CSS loads twice:** `src/index.tsx` imports `ReactToastify.css`, and toastify ≥ 11.1 also injects its own styles. Harmless; drop the import during the styling rewrite.
- **Flaky e2e:** once on Vite 8, `Calculator.spec.ts` timed out waiting for the page `load` event in its `beforeEach` (60 s). It passed on every rerun. If it recurs, look at dev-server cold transforms of the large constants files.

## Architecture

### Imports

`vite.config.ts` defines bare-path aliases: `components`, `common`, `constants`, `hooks`, `store`, `selectors`, `assets`, `locale`, `error`, `routes`, `supabaseClient`, and `@` → `src`. Use these (e.g. `import useStore from 'store'`) rather than relative paths. Every SCSS module automatically gets `@use "@/assets/styles" as *;` injected. Env vars must be prefixed `REACT_APP_` (`envPrefix`) and are read via `import.meta.env`.

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

Changing `pokemon.ts` may require updating `cypress/fixtures/PokemonList.json` to keep e2e tests passing.

### UI

- `src/routes/AppRouter.tsx` — route table; each page is wrapped in a Sentry error boundary.
- `src/components/<Name>/<Name>.tsx` + `<Name>.module.scss`, with page-specific subcomponents under `<Name>/elements/`. Top-level components are re-exported from `src/components/index.ts`.
- `src/common/` — reusable selectors/widgets (Pokemon, item, encounter selectors, page wrapper, etc.).
- Translations: `src/locale/{en,es,de}/<namespace>.json`, registered in `src/i18n.ts`. Any new user-facing string must be added to all three locales.

### Supabase

`src/supabaseClient.ts` creates the client from `REACT_APP_SUPABASE_URL`/`REACT_APP_SUPABASE_ANON_KEY`. Schema migrations and an edge function (`user-self-deletion`) are in `supabase/`.

## Releases

Versions follow SemVer and are done on `version/X.Y.Z` branches merged into `master`. A release bump touches: `package.json` version (exposed to the app as `REACT_APP_VERSION` via `.env`, which triggers the in-app "new version" notice), `CHANGELOG.md`, and a new entry at the top of `src/constants/changelog_2.ts` (the in-app changelog). Commit messages use the form `feat(X.Y.Z): <description>`.
