# Small tasks for a follow-up agent

These are low-risk fixes. Each one has an exact file list, an expected result, and a point at which to stop and ask. None of them touches the persisted store, Semantic UI widgets, or Sass, so they don't collide with the UI migration (Phases 1–5 in the modernization plan). Do them in order, **one task per branch and PR**.

Read `CLAUDE.md` first. Everything below assumes its commands and rules.

## Ground rules (hard stops)

Stop and report back instead of working around any of these:

1. **State goldens changed.** If `npm run verify` fails in `tests/state` (the persisted-store journeys), the task broke stored data. No task here should change them.
2. **A visual baseline changed that the task doesn't list as expected.** Never update baselines to make a check pass. Only Task 4 expects baseline changes, and it lists them exactly.
3. **Never edit or loosen the harness.** Don't touch `tests/` (except the one e2e line Task 3 names), `playwright.config.ts`, `scripts/`, `verification/` (except the `approved-diffs.tsv` row in Task 4), or `.github/`. Don't add `.skip`, `.only`, masks or thresholds.
4. **Never lower a number.** That covers the coverage thresholds in `scripts/coverage.mjs` and the counts in `verification/ratchet.json`. (Lowering ratchet counts with `--update` is fine; raising them is not.)
5. **No guessing data.** If a fix needs Pokémon game knowledge that isn't in this file, leave that item out and list it in the PR.
6. **Don't touch these:**
   - the OR/AS duplicate id (`KNOWN_ISSUES.duplicateIds`): changing ids breaks saved runs
   - the two missing encounter tables (`missingFilters`): they need real game data
   - the Calculator empty-IV `NaN` bug: it needs a product decision on the default IV
   - `package.json` dependency versions

## Workflow for every task

```bash
git fetch origin
git switch -c fix/<short-name> origin/master
```

If PR #822 (Phase 0) isn't merged yet, branch from `origin/chore/remove-auth` instead and open the PR against that branch.

1. Make the change.
2. Run `npm run verify`. It must pass. On Windows, if coverage says "has no files", follow the port-3001 note in `CLAUDE.md`.
3. Run `npm run verify:visual`, which needs Docker Desktop running. It must report 0 failures, unless the task lists expected changes (only Task 4 does).
4. Commit with a conventional message (`fix: …`, `chore: …`), then push and open a PR with `gh pr create --base master` (or `chore/remove-auth`, as above). The PR body says:
   - what changed
   - what `verify` and `verify:visual` reported
   - anything you skipped, and why
5. Wait for CI (`gh pr checks <number>`). The blast-radius bot comments the affected areas. A red check is a stop, unless the logs show an obvious mistake in your change (`CLAUDE.md` → "Debugging CI failures").

---

## Task 1: Spanish/German locale key drift

**Why:** Spanish and German have `None` where the code reads `none`, and both lack `encounter_template`. So the "Add game" dialog shows English, or the raw key, in those languages.

**Files:** `src/locale/es/common.json`, `src/locale/de/common.json`, `src/constants/data.test.ts`.

**Steps:**

1. In both files, rename the key `"None"` to `"none"`. Keep its value (`"Ninguno"` / `"Keiner"`).
2. Add `"encounter_template"`:
   - es: `"Plantilla de encuentros"`
   - de: `"Begegnungsvorlage"`
3. Edit only those lines. The files have their own key order and CRLF line endings, so don't reformat them.
4. In `src/constants/data.test.ts`, delete all six `localeKeys` entries in `KNOWN_ISSUES`, leaving `localeKeys: []`.

**Done when:**

- `npx vitest run src/constants/data.test.ts` passes.
- `verify` passes.
- `verify:visual` reports 0 diffs (the screenshots are English-only).

## Task 2: Misspelled Pokémon in encounter tables

**Why:** each misspelled name in `src/constants/filters.ts` never matches a Pokémon, so it's missing from that location's encounter suggestions.

**Files:** `src/constants/filters.ts` and `src/constants/data.test.ts` (`KNOWN_ISSUES.unknownEncounterNames`).

In each table under the given key, replace the misspelled string with the correct one. These are confirmed to exist in `src/constants/pokemon.ts`:

| Misspelled              | Correct     | Tables                                 |
| ----------------------- | ----------- | -------------------------------------- |
| Spinark                 | Spinarak    | gsc-63, hgss-17, hgss-63, sm-3, usum-3 |
| Milktank                | Miltank     | rse-36                                 |
| Macargo                 | Magcargo    | frlg-49                                |
| Ledybda                 | Ledyba      | hgss-87                                |
| Whimiscott              | Whimsicott  | bw2-44                                 |
| Liligant                | Lilligant   | bw2-44                                 |
| Konmmo-o                | Kommo-o     | sm-54, usum-56                         |
| Groyvle                 | Grovyle     | usum-18                                |
| Barrskewda, Barraskweda | Barraskewda | swsh-4, swsh-30                        |
| Skowvet                 | Skwovet     | swsh-5                                 |
| Kirilia                 | Kirlia      | swsh-5                                 |
| Seimsitoad              | Seismitoad  | swsh-6                                 |
| Grappoloct              | Grapploct   | swsh-7                                 |
| Galavantula             | Galvantula  | swsh-10                                |
| Rhyorn                  | Rhyhorn     | swsh-24                                |
| Rimbombee               | Ribombee    | swsh-24                                |
| Barbarcle               | Barbaracle  | swsh-26                                |
| Togedmaru               | Togedemaru  | swsh-30                                |
| Hakam-o                 | Hakamo-o    | swsh-30                                |
| Swirilix                | Swirlix     | swsh-32                                |
| Flaafy                  | Flaaffy     | bdsp-57                                |
| Tentracruel             | Tentacruel  | bdsp-63                                |
| Meditie                 | Meditite    | bdsp-63                                |

**Rules:**

- **Only touch the listed table.** A name like `'Spinark'` may appear in tables that aren't listed; search with the key, e.g. `'gsc-63': [`, and edit inside that array only.
- **No duplicates.** If the correct name is already in the same array, delete the misspelled entry instead of renaming it.
- **`Hatterne` in swsh-30 (Lake of Outrage) is ambiguous** between Hatterene and Hattrem. Leave it as is, keep its `KNOWN_ISSUES` entry, and mention it in the PR.
- In `KNOWN_ISSUES.unknownEncounterNames`, delete the entry for every name you fixed. Only `'swsh-30: Hatterne'` should remain.

**Done when:**

- `npx vitest run src/constants/data.test.ts` passes.
- `verify` passes.
- `verify:visual` reports 0 diffs. If a screenshot changes, stop and report which state changed (a selector state may list these Pokémon).

## Task 3: Replace deprecated `onKeyPress` with `onKeyDown`

**Why:** React deprecated `onKeyPress`, and React 19 (Phase 4) warns about it.

**Places** (from `grep -rn onKeyPress src`):

- `src/common/PokemonSelector/PokemonSelector.tsx` (69, 125)
- `src/components/Badges/Badges.tsx` (52)
- `src/components/Calculator/Calculator.tsx` (74, 84)
- `src/components/Calculator/elements/CalculatorHeader/CalculatorHeader.tsx` (110, 130, 149)

**Steps:**

1. Before changing a handler, read it. Only convert a handler that acts on specific keys (`e.key === 'Enter'` or `' '`). If a handler reacts to every key, leave it and list it in the PR. `keydown` also fires for keys such as Tab and arrows, which `keypress` ignored.
2. Rename the prop to `onKeyDown`. Rename handler variables like `onKeyPress`/`handleKeyPress` to `onKeyDown`/`handleKeyDown`, and keep their bodies.

**Done when:**

- `grep -rn onKeyPress src` is empty, or only lists the handlers you documented.
- `verify` passes, including the keyboard pins in `tests/e2e/main/Interactions.spec.ts`.
- `verify:visual` reports 0 diffs.

## Task 4: Allow pinch-zoom (practice for the change protocol)

**Why:** `maximum-scale=1` in `index.html` stops users zooming. It's an accessibility failure, and axe reports it as `meta-viewport` on every page.

**Files:**

- `index.html` line 6: the content becomes `width=device-width, initial-scale=1`
- `tests/visual/__baselines__/*-a11y.json`, updated by the tool
- `verification/approved-diffs.tsv`

**Expected diff:**

- Screenshots and ARIA snapshots: none.
- Every `*-a11y.json` loses only its `meta-viewport` entry.
- `index.html` is a global file, so the blast-radius check marks all areas as touched. That's expected.

**Steps:**

1. Edit `index.html`.
2. Run `npm run verify:visual`. Only the a11y summaries should fail. If any `.png` or `.aria.yml` comparison fails, stop.
3. Run `npm run verify:visual -- --update-snapshots`.
4. Check the diff:
   - `git status` shows only `*-a11y.json` files under `tests/visual/__baselines__/`.
   - `git diff -U0 tests/visual/__baselines__ | grep '^[-+] '` shows only removed lines from `meta-viewport` blocks: the `{`, `"id": "meta-viewport"`, `"impact"`, `"nodes"` and `}` lines, plus comma changes on the neighbouring lines.
   - If anything else changed, stop.
5. Commit `index.html` first (`fix: allow pinch-zoom`). Then append a row to `verification/approved-diffs.tsv`. The columns are TAB-separated: glob, commit, reason. For example:
   `*-a11y.json	<hash of the first commit>	Removed maximum-scale=1; axe no longer reports meta-viewport. No screenshot or ARIA change.`
6. Commit the baselines and the row together (`test(visual): a11y baselines without meta-viewport`).

**Done when:**

- `verify` passes.
- `verify:visual` reports 0 failures after the update.
- CI's baseline guard passes.

---

## Not for this agent

These need a decision from the owner, or they belong to the migration phases:

- **Owner decision needed:**
  - Missing PWA icons (`pwa-192x192.png`, `pwa-512x512.png`) and the duplicate manifests.
  - Workbox caching Google Fonts that are never loaded.
  - Light mode never resetting `--placeholder`.
- **Phase 2/3 work:**
  - The duplicate `ReactToastify.css` import: CSS order changes screenshots.
  - Colour contrast fixes and hard-coded hex colours.
  - Icon-only buttons without labels.
  - Clickable `div`s.
