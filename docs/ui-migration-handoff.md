# UI migration handoff

This is what an agent continuing the UI migration needs. Until now, it lived in one machine's Claude memory and plan files.

Read it together with `CLAUDE.md` (commands, harness, change protocol, CI debugging) and the `nuzlocke-ui` and `verify-nuzlocke` skills in `.claude/skills/`. Those stay the source of truth for how things work. This file covers where the migration stands, what the user decided, and how they want the work done.

Last updated 2026-11-10 (Phase 5: 5a–5y merged; release 7.0.0 in review, #922).

## Where it stands

The goal: replace Semantic UI React and Sass with Tailwind v4 and shadcn/ui (Radix, lucide), then move to React 19, then improve the UI. The order is **parity first, redesign later**. Each area keeps its looks and behaviour until Phase 5.

| Phase | What                                                                                               | Status                  |
| ----- | -------------------------------------------------------------------------------------------------- | ----------------------- |
| V     | Playwright harness replaces Cypress: state goldens, visual + ARIA + axe baselines, blast-radius CI | Done (#821)             |
| 0     | Remove Auth/Supabase                                                                               | Done (#822)             |
| 1     | Tailwind v4 + shadcn foundation, coexisting with Semantic                                          | Done (#823)             |
| 2     | Migrate shared primitives, then one area per PR                                                    | Done (#825–#857)        |
| 3     | Remove `semantic-ui-*` and `sass`, turn on preflight, drop the Vite shims, raise `build.target`    | Done (#858, #867, #869) |
| 4     | React 19 and the packages it unblocks, one bump per commit                                         | Done (#875, #878, #879) |
| 5     | UI improvements (contrast, a11y, navigation, tracker density, encounter reordering), one PR each   | In progress, see below  |
| 6     | Fixes for user reports from the issue backlog review (bugs, game data, storage, Report form)       | In progress, see below  |
| 7     | Report form issues via a Netlify function, then triage: an Action flags spam, Discord alerts       | Alerts in review        |
| 8     | Usage analytics on free resources, and modern Sentry reporting errors into the triage loop         | Not started             |
| 9     | SEO: full sitemap, metadata per route, pre-rendering, structured data, indexable encounter pages   | Not started             |
| 10    | Features users asked for, ranked by how many asked, one PR each                                    | Not started             |
| 11    | Gen 9: the species first, then a Scarlet/Violet game mode                                          | Not started             |

### Phase 2 areas

| Area                                                                                                       | PR   | Status |
| ---------------------------------------------------------------------------------------------------------- | ---- | ------ |
| `common/` Page and Back                                                                                    | #825 | Merged |
| Selector dialogs, Effectiveness on a Radix Dialog                                                          | #830 | Merged |
| ItemSelector on the Combobox                                                                               | #831 | Merged |
| @misc (About, Changelog, Delete, Import, Report)                                                           | #833 | Merged |
| @settings (Settings, CustomStatuses)                                                                       | #837 | Merged |
| @rules                                                                                                     | #838 | Merged |
| @badges (strip, BadgePage, BadgeDetail, editor dialogs)                                                    | #839 | Merged |
| @builder (Builder, Coverage, Member, Effectiveness tabs)                                                   | #840 | Merged |
| @pokestats (Pokestats, Summary, Image, DisplaySettings, Tip)                                               | #843 | Merged |
| @calculator                                                                                                | #845 | Merged |
| @tracker, part 1: the list (rows, Status, Options, ScrollList, FAB, Share, Add/Reset)                      | #850 | Merged |
| @tracker, part 2: the Detail dialog with `MoveSelector`, `Natures`, `Abilities`, `RangeSelector`, `Filter` | #851 | Merged |
| `toTopPosition` removed: the row status and nature menus portal                                            | #853 | Merged |
| App shell: header, Sidebar → Sheet, game select                                                            | #856 | Merged |
| Shared components: `Type`, `PokemonType`, `Move`, `Moves`, `PokeInfo` and the gender icons                 | #857 | Merged |

With the shared components, no file in `src` imports `semantic-ui-react` and every component module's Sass is gone.

### Phase 3 PRs

The user approved this sequence (2026-10-28). Each PR waits for the previous one's merge.

| PR  | What                                                                                                                                                                                                                                                                                                                                                                                                   | Status        |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- |
| 3a  | Delete the Sass partials (`_index.scss`, `_variables.scss`), the unused `Dropdown.module.scss`, the SCSS injection and `SASS_PATH`; remove `sass`, `semantic-ui-react` and `legacy.inconsistentCjsInterop`. No visual change (ratchet: 0 Sass files).                                                                                                                                                  | Merged (#858) |
| 3b  | Remove the `semantic-ui-css` imports and `index.css`'s dead `.ui` rules, turn on preflight, replace the `@source` list with all of `src`. `cssMinify: 'esbuild'` stays, now for precision (Lightning CSS rounded calibrated values by 1/64px). Every state still matches its baseline (no baseline changes): `legacy-base.css` restores normalize's defaults after preflight. Leave the `!` utilities. | Merged (#867) |
| 3c  | Use Vite 8's default `build.target` (the user's choice: Chrome and Edge 111, Firefox 114, Safari 16.4, which Tailwind v4's CSS already requires) and drop the unused `browserslist`. The built CSS is byte-identical to master's; the only JS change is one class static block in Radix's `OrderedDict` left unlowered.                                                                                | Merged (#869) |

The harness runs on the dev server, so neither `cssMinify` nor `build.target` can change a baseline. 3b checked the production build by comparing every element's computed style between master's and the branch's `vite preview` (see "Compare computed styles" below). 3c compared the built files instead: its CSS came out byte-identical, so the comparison had nothing to find.

**`legacy-base.css` was Phase 5's to remove (gone in 5k).** Preflight is on, but this file, loaded right after it in the base layer, puts back what the UI was calibrated against: normalize's `box-sizing: inherit`, the browser's margins, paddings, borders and list styles, form controls' fonts and colours, inline baseline `svg` and `img` with svg overflow clipped. Calibrating each of the 43 affected files instead would have been a migration of its own. Each rule can go as an intended diff in a Phase 5 PR.

### Phase 4 PRs

The user approved this sequence (2026-10-28). Each PR waits for the previous one's merge, with one bump per commit.

| PR  | What                                                                                                                                                                                                                                                         | Status        |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- |
| 4a  | Drop `@types/react-router-dom` (react-router 7 ships its types); `react` and `react-dom` 19.3.1 in one commit (`react-dom` pins its `react`); `@types/react` and `@types/react-dom` 19.3 (`LegacyRef` → `Ref` in `Image`); ESLint's React version set to 19. | Merged (#875) |
| 4b  | In-range updates of the React packages, one per commit: `@sentry/react` with `@sentry/vite-plugin`, `react-router-dom`, `react-i18next`, `react-toastify`, `react-window`, `zustand`, `lucide-react`.                                                        | Merged (#878) |
| 4c  | Refs as props: drop `forwardRef` from `Button` and `InfoButton`, and pass `Image`'s `forwardedRef` as `ref`. A refactor with no visual change.                                                                                                               | Merged (#879) |

What the inventory found (2026-10-28): every installed package's peer range already accepted React 19, so nothing waited on it; the Testing Library packages and the ESLint React plugins were already on their latest versions. The code had none of 19's removed APIs (`ReactDOM.render`, `findDOMNode`, string refs, `defaultProps` or `propTypes`, legacy context, `react-dom/test-utils`, `useRef()` without an argument, the global `JSX` namespace). The app doesn't use `StrictMode`, so 19's dev-only double render and double effects don't apply. Render errors no longer rethrow from the root on 19; they go to `window.reportError`, which Sentry's global handler catches, and `Sentry.ErrorBoundary` catches as before. `Sentry.reactErrorHandler` stays in Phase 8 and the built-in metadata in Phase 9. TypeScript 7 stays held (`typescript-eslint`).

How 4a was checked: the built CSS is byte-identical to master's, and the bundle grows 3.3% gzipped (React 19 itself; the budget is 5%). A comparison of the production previews (every element's attributes, computed style and box; 5 seeds × desktop and mobile × 12 routes, with transitions off) found only invisible changes:

- `useId` values look like `_r_d_` instead of `:rd:` (they show up in ids, `aria-controls` and the lucide icons' `mask` urls);
- React 19 writes some attributes in another order (`type` and `name` last on inputs);
- on desktop `/calculator`, master's live `main` reports `margin-left: 0px` for its `mx-auto` while it sits at x = 40, the same box as the branch's. A fresh copy of master's element reports 40px, so master's resolved value was stale.

How 4b was checked: each bump got its own commit after typecheck, lint and the unit tests passed. The 22 lucide icons the app uses, and lucide's `Icon`, `createLucideIcon` and default attributes, are identical between 1.61 and 1.64 apart from the version in the license header. The built CSS is byte-identical to master's, the bundle grows 0.4% gzipped, and every visual state matches its baseline. The production preview comparison found one difference: react-window 2.5 writes the tracker list's inline style declarations in another order (the same declarations, the same computed style and box).

How 4c was checked: `npm run verify` and the visual suite pass with the goldens and baselines unchanged. The built CSS is byte-identical to master's and the gzipped JS is 35 bytes smaller. The production preview comparison found no difference in any of its 120 cases.

### Phase 5 PRs

The user approved this sequence (2026-10-29). Each PR waits for the previous one's merge. Phase 5 changes looks on purpose, but each PR still changes only its own areas and logs every diff.

| PR    | What                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Status                         |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------ |
| 5a    | Contrast: the Edit custom statuses button only (the user's choice over darkening `--primary` everywhere). In light mode each state takes the next darker Semantic blue (`#1678c2` at rest, 4.67:1). The settings area.                                                                                                                                                                                                                                                                                                                                                                                                         | Merged (#881)                  |
| 5b    | The page is `inert` while a Radix Select is open, which fixes axe's `aria-hidden-focus`. No pixel change.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Merged (#882)                  |
| 5c    | Names and roles with no visual change, two PRs. (1) Shell and tracker: sidebar items and the tracker row menu get real roles and keyboard access, the mobile `h1` becomes sr-only instead of `display: none`, sprites get alt text. (2) Calculator, Import and Changelog: button names, labels, ARIA attributes, heading order.                                                                                                                                                                                                                                                                                                | Merged (#883, #884)            |
| 5d    | Encounter reordering: Move up and Move down in the tracker row's menu, reusing the Rules page's strings (already in en, es and de), an e2e pin and a new state-golden journey. A row moves past its visible neighbour, so it works while filtering. No store migration.                                                                                                                                                                                                                                                                                                                                                        | Merged (#885)                  |
| 5e–5k | Remove `legacy-base.css` one group per PR, each an intended, logged diff: box-sizing; list styles; replaced elements (`svg` and `img` display, svg overflow); `html` line height and font; form-control fonts and colours; margins, paddings and borders (may split); table, `hr` and the rest.                                                                                                                                                                                                                                                                                                                                | Merged (#886–#890, #894, #901) |
| 5l    | Navigation: the inline nav at every width (it was hidden below 1148px), and a bottom tab bar on mobile. One `nav`: the column from 1148px, a row above the page from 571px, a tab bar below. Pages leave room for it, and the tracker FAB and toasts rise above the bar.                                                                                                                                                                                                                                                                                                                                                       | Merged (#902)                  |
| 5m    | Tracker redesign and density (see the decisions below): the list fills the page, flat rows (64px desktop, 120px phone; compact 40/56px, a new setting), a level stepper in every row, a keyboard ⋮ menu, translated control names, and a Reset confirm.                                                                                                                                                                                                                                                                                                                                                                        | Merged (#903)                  |
| 5n    | 5m follow-up: after Move up or Move down from the keyboard, focus follows the moved row (react-window keys rows by index, so focus stays at the old position, which now holds the neighbour). Builds on #903.                                                                                                                                                                                                                                                                                                                                                                                                                  | Merged (#907)                  |
| 5o    | 5m follow-up: PokéStats' team image logs a duplicate React key (`team-1`) with a team of more than six (`Pokestats/elements/Image/Image.tsx`, ``key={`team-${enc.id}`}``).                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Merged (#904)                  |
| 5p    | 5m follow-up: regenerate `verification/seeds` so they carry master's newer Ultra Sun/Ultra Moon locations. It changes the `import a backup` golden's `before` hash, so the PR needs the `state-change-approved` label (create it if missing) and the user's OK.                                                                                                                                                                                                                                                                                                                                                                | Merged (#905)                  |
| 5q    | The header title sits in the middle of the bar from 1200px (it followed the game controls, off centre). The shell area, desktop baselines only.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Merged (#906)                  |
| 5r    | Encounter editor redesign (Edit details), from the approved mockups below: a header with the sprite tile, captions over every field, move tiles, a stats grid with named steppers, a two-group footer. Opt-in looks for the shared Combobox, ItemSelector and MoveSelector.                                                                                                                                                                                                                                                                                                                                                    | Merged (#908)                  |
| 5s    | Calculator redesign, from the same mockups: a result card at the top (sticky below 750px with a Pokémon 1/2 switch), the Field panel as labelled segmented rows, both sides as captioned cards, one row per move with a result radio. The calculator area; axe now clean there.                                                                                                                                                                                                                                                                                                                                                | Merged (#909)                  |
| 5t    | Builder redesign, from the pages mockups below: member cards with a header button, captioned fields and move tiles, an outlined Delete, segmented tabs, Coverage as type chips. Keeps the specs' anchors (see the decisions).                                                                                                                                                                                                                                                                                                                                                                                                  | Merged (#912)                  |
| 5u    | Rules redesign: a toolbar with the ruleset Select and New ruleset, flat rows in an `<ol>` with fixed action slots (a ⋮ menu on phones), translated names, focus following a moved rule.                                                                                                                                                                                                                                                                                                                                                                                                                                        | Merged (#916)                  |
| 5v    | Stats page chrome: segmented tabs with counts (five columns on phones), outlined Download and Settings. The summary card, the exported image, stays as it is.                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Merged (#917)                  |
| 5w    | Settings: three cards of rows with a hint and a switch, a labelled Language, an outlined Edit for custom statuses.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Merged (#918)                  |
| 5x    | Header polish, last and alone (it moves every page's screenshots): row-look game select, outlined + and ✎ (the ✎ back on phones), a named menu badge, a grouped 260px menu.                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Merged (#920)                  |
| 5y    | No Back button: `Page` renders only the title, and pages are left through the page nav and the header's menu. Settings, About, Report, Changelog, Import, Delete and the badge pages; seven spec clicks on Back go through the sidebar's Tracker item instead.                                                                                                                                                                                                                                                                                                                                                                 | In review (#921)               |
| 7.0.0 | Release 7.0.0, the last step of Phase 5 (the user's request, relayed by another session on 2026-11-08). The change files are in `.changes/` (#911 added everything since 6.1.0). On `version/7.0.0` from an up-to-date master: `npm run release -- major --dry-run`, then `npm run release -- major`. The diff touches only `package.json`, `package-lock.json`, `src/constants/releases.json` and `CHANGELOG.md`, and leaves `.changes/` with only its README. Then `npm run verify` and a commit `feat(7.0.0): <description>`. The merge to master deploys, so the user merges it. Confirm with the user before starting it. | In review (#922)               |

**The user's Phase 5 decisions (2026-10-29):**

- **Order:** small wins first (5a–5d), then `legacy-base.css`, then the redesigns, so they're built on preflight's defaults.
- **Contrast:** fix only the Edit custom statuses button. The other `color-contrast` nodes axe reports stay for now.
- **Navigation** means the inline nav at all widths plus a mobile bottom tab bar. Sidebar items as real links and moving more pages into the inline nav weren't chosen.
- **Tracker density** means: the list fills the viewport (it's a fixed 690px today), tighter rows, and a compact-mode setting. Two columns on wide screens wasn't chosen. The user also wants the tracker redesigned: better looking and more intuitive, while keeping quick access to everything and staying easy to use in desktop browsers and on mobile. Propose that design (mockups) before building it.

**The tracker redesign (5m, 2026-11-05):** the user asked for a council review (the `council` skill: three read-only reviewers, visual design, interaction, and accessibility/buildability, iterating until each scores 9.5). The approved mockups are a private artifact (https://claude.ai/artifact/N8d6pqUacbYJ1BD18Wo1qN). The user added three items the council had left for later: the ⋮ menu as a real keyboard menu, translated screen-reader names for the row's controls, and a confirm before Reset. The user approved the spec edits these need: an OK on the Reset confirm in four places (`Encounters.spec.ts` twice, `CustomGame.spec.ts`, the state journey) and the level item found by its visible name in `Accessibility.spec.ts`.

**The editor and Calculator redesign (5r, 5s, 2026-11-06):** the user asked the council to make Edit details and the Calculator prettier. After five rounds (9.5 from every seat) the user approved the mockups, a private artifact (https://claude.ai/artifact/MhrapF5orEp6574iiQ5SsQ). Out of scope there: Mega Evolution, Hidden Power and Showdown export (Phase 10), the IV `NaN` bug (Phase 6), live announcement of results, an attacker/defender swap, EV counters, and any change to the shared selector dialogs. Changes to shared pieces stay opt-in (a `look` prop), so other areas keep their pixels. Each build also gets a council review of the code before its PR.

**Builder, Rules, Stats, Settings and the header (5t–5x, 2026-11-07):** the user asked for councils on these five areas. After four rounds (9.5 from every seat on every area) the user approved the mockups, a private artifact (https://claude.ai/artifact/5XP6PDuLyvTqGPJfJWCFYi). Each build gets a council code review before its PR. Settled there:

- Order: Builder first (its expand control can't be focused and collapsed fields stay in the tab order), then Rules, Stats, Settings, and the header last and alone.
- Builder keeps the specs' anchors: the nine fields stay the direct children of `team-details-*` in today's order (nature, ability, item, moves 1–4, delete), laid out by a grid on that element with each caption inside its child; every move slot keeps a `<b>` around its name, empty ones included (a Builder-only tile option). Coverage keeps all 18 types in today's order (by count) under today's headings, zeros muted.
- Rules' ⋮ menu (phones) lists exactly the row's actions and hides the rest; default rules never offer Edit or Delete.
- Settings' switches keep the `settings-*` test ids on the switch, are named by the row's title with the hint as their description, and draw a 3:1 border when off; `checkbox`/`expectChecked` gain `[role=switch]`.
- The Back button goes from every page with the shared `Page` header (Settings, About, Report, Changelog, Import, Delete, the badge pages) together, in a PR of its own (the user's choice, 2026-11-10): 5y. The title is the section's first child but not its last, so it keeps the heading's 1rem bottom margin and the content stays where it was (as the wrapper's only child it lost the margin and everything rose 14px).
- The exported summary image gets its two contrast fixes, the yellow ONGOING and black text on the dark type chips (the user's OK, 2026-11-10). It changes the downloaded PNG, so it's its own PR, in a new session.
- Release 7.0.0 comes right after 5x (the user confirmed, 2026-11-10).

## How the user wants the work done

These preferences hold across sessions:

- **One area per PR, sequenced.**
  - Branch from an up-to-date `master` (`feat/ui-<area>`).
  - Commit the treatment first, then the baselines with their `verification/approved-diffs.tsv` rows (glob, the treatment commit's hash, a reason that covers pixels, ARIA and axe).
  - Push, open the PR and watch CI.
  - Commit messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
  - PR bodies end with `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.
- **Wait for the merge, and check it.** Start the next area only after the user says the previous PR is merged. Then confirm it on GitHub (`gh pr view <n> --json state`) and in `origin/master` before branching. Once the user said a PR was merged when it wasn't yet.
- **Parity bar ("contained diffs").**
  - Untouched areas must show zero visual diff.
  - Touched areas may change only where it's explained: usually icon glyphs, because FontAwesome becomes lucide.
  - Calibrate everything else until it matches pixel for pixel: computed styles, Semantic's real cascade, exact rem values.
- **Behaviour stays the same** unless the user decides otherwise. When Radix and Semantic behave differently (Escape, outside clicks, disabled items, selection), keep Semantic's behaviour and pin it with a test.
- **Specs don't change during the migration.** Only the helper bodies in `tests/e2e/helpers.ts` change. Where a spec relies on Semantic markup, make the new component meet it instead:
  - `contained` Select and MultiSelect render their menus inside the test-id element.
  - The Combobox input keeps the `search` class.
- **Document lessons before calling a task done.** Repo and tooling facts, root causes, dead ends and recipes go in `CLAUDE.md` (or the skills). Project state and user decisions go here.
- **Find root causes; don't add retries.** Reproduce CI-only or Docker-only problems in Docker rather than guessing (see the measuring recipe in `CLAUDE.md`).

### Hard rules

- Never update baselines of an untouched area to make a diff pass.
- Never loosen the harness: no `skip` or `only`, no masks, no thresholds.
- Never lower the coverage thresholds.
- Never run `npm audit fix --force`.
- Don't change GitHub repository settings. Those are the user's.
- Don't commit `.claude/settings.local.json`.

### Decisions already made

- **Search dropdowns use manual selection** (#840). Only a click or Enter picks an option. Escape, a click elsewhere or Tab closes the list and keeps the value. Semantic's select-on-blur was dropped on purpose; it's pinned in `combobox.test.tsx`.
- **Escape on dialogs:** a dialog closes on Escape only if its Semantic version had an `onClose`. `tests/e2e/main/Interactions.spec.ts` pins each case.
- **Accessibility:** new accessible names (aria-labels, tab names, button names) are welcome when they need no visual change. New user-facing strings go in all three locales (en, es, de).
- **Known a11y items for Phase 5:**
  - The white-on-#2185d0 Edit custom statuses button has too little contrast.
  - An open Radix Select hides the rest of the page with `aria-hidden` but leaves it focusable, so axe reports `aria-hidden-focus` (3 nodes with a tracker status menu or Settings' language open). Making the hidden page `inert` while a menu is open would fix it.
- **Encounter reordering goes into Phase 5:** Move up and Move down items in the tracker row's menu. It reorders the existing encounter list, so it needs no store migration.

### Backlog decisions (2026-10-28)

The user's answers to the questions in the [backlog review](https://claude.ai/artifact/PbboBKCDJsxkpDQiUH3euc). The work they lead to is in Phases 6–11 below.

- **Storage:** call `navigator.storage.persist()` at startup (`src/lib/storage.ts`), with no reminder to export.
- **Report form:** Netlify's honeypot (`bot-field`) and a required description. The game field stays free text.
- **Natures:** localise their names in de and es only.
- **Yellow, Emerald and Platinum:** version-tagged encounters inside their base games, not separate games.
- **Gen 9:** a later phase (Phase 11), the species first, then a Scarlet/Violet mode.
- **Encounter reordering:** Phase 5 (above).
- **#737** stays closed.

## Waiting on the user

- `docs/agent-tasks.md` holds small tasks for a simpler agent. On the original machine it had uncommitted local edits that Claude didn't make. Check whether they need committing from there.

## Watch for

- **Report states under load:** the visual suite's `report` states can time out in `waitForLoadState('networkidle')` when the machine is busy, because the dev server stops answering module requests. It happens on master too: with `--grep report --repeat-each=3`, master failed 8 of 12 in one run while the React 19 branch passed. The page makes no requests of its own. Rerun on a quiet machine before suspecting a change.
- **Possible flake, `Options › Narrow › Custom Status` (chromium, CI run 41659339824 on #896, a CI-only PR):** the click on `pokemon-0` came 15 ms after picking Sword and Shield in the game Select. Playwright reported the click done and the row showed its hover border, but the selector dialog never painted, so `poke-Scorbunny` timed out. That suggests the closing Select swallowed the click, or the dialog closed as soon as it opened (Select hands focus back to its trigger). It's the first such failure in the last 25 failed CI runs. If it recurs, reproduce it with the delayed `postMessage` init script from `CLAUDE.md` before changing anything.
- **Possible flake, `Navigation › the header and its menu on a phone` (webkit, CI run 43072152552 on #924, which doesn't touch the header):** after Tab reached the menu's Builder item, Enter left the page on `/rules`, so `toHaveURL(/builder$/)` timed out. The job's rerun passed with no change. If it recurs, reproduce it with the delayed `postMessage` init script from `CLAUDE.md`: Enter may land before the item's handler is in place.
- **Stuck CI job:** GitHub has twice left a finished job "in progress", which blocks the PR. Rerunning the job reproduces it. An empty commit (`ci: rerun checks`) gets a clean run.

## Phases 6–11

The user approved this roadmap on 2026-10-28. It comes from the review of all 580 GitHub issues (a private report: https://claude.ai/artifact/PbboBKCDJsxkpDQiUH3euc). The user's answers to the review's questions are recorded with the other decisions. Phases 6, 7 and 8 and the SEO quick wins don't touch the CSS and build files that Phases 3–5 change, so they run alongside them. Everything else waits for its phase.

### Phase 6: fixes for user reports

One small PR per fix, each from `master`. A fix that changes results or saved data needs the user's OK first, then a test that pins the new behaviour.

- **Bugs still on `master`:**
  - the calculator applies one side's field (screens, hazards) to both attack directions (#689);
  - cancelling the encounter editor keeps IV and EV edits, which the next Save writes (#559).
- **Game data:**
  - FireRed/LeafGreen's Koga and Sabrina are swapped between the Marsh and Soul badges (#726, #391);
  - the Ultra Sun/Ultra Moon starters are listed under Iki Town instead of Route 1 (#791, #461);
  - encounter gaps: the Valley Windworks honey tree (#803), Olivine fishing (#818), Exeggcute on HGSS Route 35 (#805) and Farthest Hollow (#771).
- **Version-exclusive encounters:** Yellow, Emerald and Platinum keep one game each; tag their version-exclusive encounters and filter by the chosen version. No new game keys, no persist migration.
  - **In review (2026-11-11).** The user approved the Version menu on the tracker toolbar of every paired game, Brilliant Diamond/Shining Pearl included, stored as the optional `games[key].version` (absent = every version, so no persist bump); custom games never get one. After a first PR (#923) mixed PokéAPI, Bulbapedia and table edits, the user scrapped it (2026-11-11): the tags come from Bulbapedia alone, the tables stay as they are, and every disagreement between Bulbapedia and the tables was listed in the PR (`scripts/version-exclusives.json`'s `unplaced`, `missing` and `unknown`). The user settled them the same day: entries a table already has stay (untagged, even when unreachable in normal play), Pokémon it lacks are added, tagged, when Bulbapedia places them there in some versions only (242), and not when it places them in every version (1,238). swsh-30's `Hatterne` became Hatterene.
- **Saves:** call `navigator.storage.persist()` at startup (five data-loss reports).
- **Report form:** a Netlify honeypot field and a required description, against the form's spam (about 20% of reports).
- **Localisation:** nature names in de and es, not Pokémon names (#518).
- **PKHeX import (#810, #812):** IVs and EVs arrive empty and sub-areas collapse into one route. Waits on a current PKHeX box export from the user.

### Phase 7: automatic issue triage

**Built, waiting on its merge and a first live run.** `.github/workflows/triage.yml` runs `scripts/triage/triage.mjs` on every new issue; `CLAUDE.md` says how it works. The user has set `DISCORD_WEBHOOK_URL`.

- **No model review (the user's decision, 2026-11-04).** The original plan's Claude review of each issue and its approved fixes were dropped. Don't bring them back without asking.
- **What runs:** one Discord alert per issue with its title, link and any spam signals. An empty description or two signals mark an issue as likely spam: it gets one comment and the `invalid` label, and nothing is closed.
- **Spam signals from the backlog review:**
  - an empty description;
  - Type, Device and OS all blank, which the form's UI can't send;
  - injection strings in fields;
  - the same text sent two or three times within minutes.

  Gen 9 and version-split requests are planned work: nothing looks at what a report asks for.

- **Safety:** issue text comes from strangers. The job can read the code and write issues only, never pushes, and reads the issue from `GITHUB_EVENT_PATH`. Its title goes through `neutralize` before Discord shows it.
- **Step 1, its own PR:** a Netlify `submission-created` function replaces the Zapier zap. It turns each Report form submission into a GitHub issue in the same format as today and can apply the spam signals before an issue exists. Details in "Report form → GitHub issue" below. If it sends its own Discord alert for form reports, make `triage.mjs` skip its alert for them (title `User Submitted Issue: # `), or form reports alert twice. The user sets up a fine-grained GitHub token (issues: write on this repository only) and the Discord webhook URL in Netlify's environment variables, and turns the Zapier zap off once the function is live.

#### Report form → GitHub issue (Zapier until step 1)

- **What exists:** the Report page (`src/components/Report/Report.tsx`) posts the Netlify form `contact`. Netlify detects that form at build time from the hidden copy in `index.html`. A **Zapier zap in the user's Zapier account** opens one GitHub issue per submission **under the user's GitHub account** (`diballesteros`). Nothing in this repository configures it; the zap is edited only in Zapier's UI. It has two steps:
  1. Netlify › **New Form Submission** (an instant trigger).
  2. GitHub (app 1.1.0) › **Create Issue** on `diballesteros/nuzlocke`, mapping the submission's fields.
- **Issue format** (the zap's configuration, and #815–#819):
  - title `User Submitted Issue: # ` followed by Netlify's `Submission Number`;
  - body: one `Field: value` line per form field, separated by blank lines, in the order `Type` (`Data Type`), `Device` (`Data Device`), `OS` (`Data Os`), `Browser` (`Data Browser`), `Selected Game` (`Data Selectedgame`), `Description` (`Data Description`). Empty fields stay as `Type: ` with nothing after them;
  - label `netlify`, set in the Create Issue step's Labels field (GitHub shows it added by the user's account about 2 seconds after the issue is created). No assignee.
- **Spam:** submissions that pass Netlify's filter and the `bot-field` honeypot still become issues (#816 and #819 are sales pitches). Each one gets closed by hand.
- **Phase 7, step 1:** replace the zap with a Netlify `submission-created` function (`netlify/functions/submission-created.ts`). Netlify runs it for every submission that passes its spam filter.
  - It calls the GitHub API with a fine-grained token (issues: write on this repository only), kept in Netlify's environment variables, never in the repo.
  - It can apply the spam signals above before an issue exists (drop or label), set labels, and send the first Discord alert. The code is versioned and unit-tested, and Zapier's free-plan task limits go away.
  - Keep the title, label and body format above, so the triage job and earlier issues read the same.
  - **Don't route it through a GitHub Action using `GITHUB_TOKEN`** (for example with `repository_dispatch`): issues created with that token don't trigger other workflows, so the triage workflow on `issues: opened` would never run. Issues created with the user's token, as the zap does now, do trigger it.
  - Turn the zap off in the same step the function goes live, or every report arrives twice.

### Phase 8: usage analytics and Sentry

It comes after the triage loop, so that Sentry's reports can feed the loop, and before SEO, so that SEO's effect can be measured.

- **Analytics: an in-house counter (the user chose it on 2026-10-28 over Cloudflare Web Analytics, GoatCounter and Umami).** Basic counts in the style of Plausible, on Netlify's free resources, with nothing leaving Netlify:
  - **What it counts:**
    - page views per route, counted on route changes inside the app (it's a PWA), not only on page loads;
    - daily unique visitors, without cookies or stored ids: a hash of a daily rotating salt, the IP and the user agent, computed in the function and never stored raw (Plausible's method);
    - referrer host, country (from Netlify's geo header), device class and browser family;
    - custom events: the selected game, and which pages and features are used.

    No personal data, so no consent banner. The About page says what is collected.

  - **Collect:** a Netlify Function (`netlify/functions/`) takes a small JSON beacon sent with `navigator.sendBeacon`.
    - It drops bots by user agent, respects `navigator.globalPrivacyControl` and Do Not Track, skips `localhost` and deploy previews, and rate-limits per visitor hash.
    - It writes to Netlify Blobs.
    - Blobs has no atomic increment, so avoid lost updates: write one small record per event under a daily prefix, and roll each closed day up into a single daily summary blob. Alternatively, use conditional writes on an ETag; check whether the Blobs version in use supports them.
  - **Read:** a private stats page served by a second function and gated by a secret token kept in Netlify's environment variables. Netlify's site password is a paid feature. The page isn't in the app's router and isn't cached by the service worker.
  - **Dashboard, laid out like Plausible's:**
    - a period picker (today, 7 days, 30 days, this month, 12 months, custom) with comparison to the previous period;
    - a row of headline numbers: unique visitors, page views, views per visit, bounce rate and visit duration, each with its change;
    - a line chart of visitors or page views over the period, switched by clicking a headline number;
    - panels of ranked lists, each row with a bar behind it sized by its share:
      - sources: referrer hosts;
      - pages: top, entry and exit;
      - locations: countries, as a list or a map;
      - devices: device class, browser and OS;
      - games and features: the custom events;
    - clicking any row filters the whole dashboard by it, and a live count shows visitors in the last 5 minutes.

    A small Vite entry (`stats.html`) can build it with the app's Tailwind tokens, light and dark, and a light chart library such as uPlot.

    Filtering across dimensions and bounce rate need event-level data, not just daily totals. Keep each day's events as one compact blob (route, referrer, country, device, browser, OS, event, visitor hash, time) for a retention window, and aggregate on read. The site's volume makes that cheap, and older days keep only their summaries.

  - **Limits:** check Netlify's free plan limits on function invocations and Blobs storage when this starts. Keep summaries, delete raw records once rolled up, and cap retention, such as a year of daily summaries.
  - **Tests:** unit tests for the beacon, the filters and the roll-up; an e2e check that a route change sends one beacon; state goldens unchanged (nothing is persisted in the store).

- **Sentry:**
  - Done (`feat/sentry-react19`): `src/lib/sentry.ts` holds v11's defaults with personal data kept off, the root error handlers and the `/diag` tunnel. Plugin and SDK name the same release, `REACT_APP_VERSION`. See `CLAUDE.md`.
  - The user sets `SENTRY_AUTH_TOKEN` in Netlify's environment for the source map upload.
  - Waits for Phase 5, because it changes the UI: Sentry's user feedback widget as a second way to report problems.
- **Into the loop:**
  - A Sentry alert rule opens a GitHub issue for each new error (labelled `sentry`, which already exists).
  - The Phase 7 triage sends the Discord alert for it like any other issue. Sentry's own Discord integration is the fallback.
  - The free Developer plan's error quota is the limit; rate-limit the alerts so a burst can't flood the issues.

### Phase 9: SEO

- **Today:**
  - every route serves the same title, description and canonical link (the home page) and an empty `#root` until the JavaScript runs;
  - there's no preview image for shares;
  - deep links return 200 through `netlify.toml`'s SPA fallback, but with that shared canonical link they still point crawlers at the home page, until per-route metadata lands;
  - an unknown URL also returns 200, with the app's shell and an empty page (a soft 404), because `AppRouter` has no catch-all route. Fix it when routes are pre-rendered: add a not-found route and a real 404 response.
- **Pre-rendering and the fallback:** the fallback isn't forced, so a pre-rendered `dist/rules/index.html` is served ahead of it with no rule change. Check that on a deploy preview.
- **Quick wins (any time; they're more useful once Phase 8 can measure them):**
  - a sitemap of every public route generated at build time, linked from `robots.txt` (done, #873);
  - an Open Graph image;
  - JSON-LD for the app.
- **After Phase 4:**
  - per-route titles and descriptions with React 19's built-in metadata;
  - pre-rendering the public routes to static HTML;
  - splitting the large game-data files out of the main bundle, for load speed;
  - a Lighthouse budget in CI (done: `lighthouserc.cjs`, see `CLAUDE.md`).
- **Biggest lever:** indexable pages per game and route (such as an Emerald encounter list) built from the data in `src/constants/`.
- **The user submits the sitemap in Search Console:** `https://nuzlocke.netlify.app/sitemap.xml`, now that #873 is live, and again after pre-rendering or the per-game pages change which URLs exist. Search Console is the user's account, so an agent can only remind them.
- **The user decides:** a custom domain instead of `nuzlocke.netlify.app`, and whether es and de get their own URLs (needed for `hreflang`).

### Phase 10: features

One PR each, in order of how many users asked:

- Soul Link and Wedlocke pairing;
- Showdown export;
- Mega Evolution and Hidden Power in the calculator;
- Elite Four rematch data;
- fixes for the summary image's Safari and overlap glitches.

Encounter reordering goes into Phase 5 instead: move up and down in the row menu, since encounters are already an ordered array.

### Phase 11: Gen 9

The Gen 9 species come first (the show-all list and the calculator; #814, #817). A Scarlet/Violet game mode follows, modelled on how other Nuzlocke tools handle open-world locations. Check the licence before reusing anyone's data.

## Techniques that worked for calibration

- **Measure Semantic, don't guess.** Launch the app with the control CLI (`node .claude/skills/verify-nuzlocke/control-nuzlocke.mjs launch`, then `seed`, `theme` and `goto`). Connect Playwright over CDP to `http://127.0.0.1:9333` and dump `getComputedStyle` and `getBoundingClientRect` for the elements you're replacing. Do this before you write any classes.
- **Compare every box against master.** Run master from a worktree (`git worktree add ../nz-master origin/master`, symlink `node_modules`, `npx vite --port 3200`; give that server a config with `server.fs.strict: false`, or Vite refuses the symlinked Semantic icon font, master's icons fall back to another font and every icon line moves) and load the same seed in both apps from one Playwright script. Diff the `getBoundingClientRect` of every `[data-testid]`, `label` and `output` on both sides, on desktop and mobile with each popup open. This caught a padding lost to normalize and buttons that no longer wrapped on mobile, which no screenshot state showed.
- **Read diffs at pixel level.** After `npm run verify:visual`, the `-expected`, `-actual` and `-diff` PNGs are in `verification/artifacts/visual/test-results/`. Crop and enlarge the regions side by side to see whether a change is a glyph, an offset or a size.
- **Sub-pixel offsets need the container's fonts.** Measure inside the Playwright image against a master worktree (recipe in `CLAUDE.md`). That's how a 0.094px toolbar offset in #843 was traced to a trailing icon's line box.

- **Compare computed styles.** For a change that should alter nothing (a reset, a build setting), pair every element on both sides by document order and diff `getComputedStyle` plus `getBoundingClientRect`. Run it per visual state (seed, theme, viewport, action) with a Playwright spec kept in the ignored `verification/artifacts/`. Filter out custom properties, `tab-size` and the style or colour of zero-width borders, and ignore values caught mid-transition (500ms background fades, the Builder's expand). 3b used it twice: master against the branch (preflight), and master's production build against the branch's, which showed Lightning CSS rounding calibrated values (so esbuild still minifies CSS). Run each preview from its own checkout; the full run takes about 15 minutes with 4 workers, and a case that times out under load passes on its own. It names the property behind a diff, where a screenshot only shows pixels.

### Gotchas met so far

- **Utilities that never applied.** Semantic's unlayered reset beat some utilities, so they did nothing on master (`appearance-none` on three buttons, `overflow-visible` on `ICON_SLOT`). Once the reset was layered they would have applied, so 3b removed them. When a diff appears in code nobody touched, look for one of these first.
- **`../nz-master` shares `node_modules`.** It's a symlink to this checkout's, so removing a package here removes it for the master server too. 3b reinstalled `semantic-ui-css` with `npm install --no-save` so master kept loading; `npm ci` restores the lockfile's set.
- **Ports held by other sessions.** Other sessions' Vite servers may still be running on 3100, 3110 or 3200. Check with `lsof -nP -iTCP:<port> -sTCP:LISTEN`, leave them alone and pick another port (`VERIFY_PORT` for the control CLI).

- **Transforms and layout offsets rasterize differently.** A menu nudged by a sub-pixel `translate` blends its borders, where Semantic's menu, offset by layout in its field's layer, snapped them to whole pixels. A sub-pixel margin instead snapped the borders but changed the text inside Radix's scrolling viewport. Translating only the viewport (`menuShift="content"`) matched both.
- **A `<button>` centres its content; a `<div>` doesn't.** In dark mode the header bar has no border, so the game select stretches 2px taller than its content. Semantic's div kept the text at the top; the Select's button centred it, 1px lower. Extra bottom padding in dark mode puts it back.
- **Icon-font glyphs sit on the baseline.** Semantic's `<i class="icon">` is an inline-block whose glyph is placed by the icon font's baseline, so FontAwesome's gender marks sat about 0.45em above the baseline whatever the line height. An svg on `align-top` matched the box on one line height but drew the glyph 1.5px high on mobile's smaller font. The gender icon sits on the baseline instead, with its drawing nudged by a translate. Measure the ink (its rows and centre in the Docker PNGs), not just the box: FontAwesome's venus is a small glyph that hangs below its box, unlike the nav icons `ICON_SLOT` scales up.
- **Semantic previews the highlighted option.** With no game chosen, opening Semantic's dropdown showed its first option in the field. Radix keeps the placeholder. It only shows while the menu is open, and no baseline state covers it.
- **Focus under a dialog.** Semantic left focus on the button that opened a Confirm, so the header's delete button showed its grey `:focus` fill under the dimmer. Radix moves focus into the dialog, as in every migrated dialog, so the fill is gone.
- **normalize styles `details` and `summary` unlayered.** It sets `details { display: block }` and `summary { display: list-item }`, so `flex` or `block` on them needs `!`.
- **A `<details>` section's children were content-box.** Chrome renders them in the `::details-content` slot, which normalize's `* { box-sizing: inherit }` can't reach, so they inherited `content-box` and fields there grew by their padding. 5e dropped the inherited rule: preflight sets `border-box` on every element directly, so the editor's `box-border!` workarounds went. An element that needs `content-box` for its own design declares it (`Type`'s icon).
- **Preflight's replaced elements are blocks centred on the middle.** 5g dropped the rule that kept `img` and `svg` inline on the baseline. Inside flex and grid nothing changes; the few icons and images that sit in a line of text declare `inline`/`inline-block` with `align-baseline`. Preflight's `max-width: 100%` on `img` squeezed the mobile badge strip, whose images opt out with `max-w-none`. normalize's `svg:not(:root) { overflow: hidden }` was already Chrome's default. To find what such a rule affects beyond the baselines, list every `img` and `svg` outside a flex or grid parent that computes to `display: block` or `vertical-align: middle` on each route.
- **Preflight's form controls inherit their font and colour on a transparent fill.** 5i dropped the rules that gave every control the browser's fill, colour and corners with normalize's `sans-serif` at 1.15. Designed controls set their own; the native fields the app never designed (Report's form, the calculator's number inputs, the plain textareas) take `NATIVE_FIELD`, which brings the browser's look back with `revert` (an author fill would turn off the native appearance). normalize's `appearance: none` only matched `input[type='text']`, so an input with no `type` kept the native look and takes `NATIVE_FIELD`, not `NATIVE_TEXT_FIELD`. To find what such a rule affects beyond the baselines, inject the removed rules back in a `<style>` (`@layer base { … }` lands after preflight) and diff each control's computed style and box with and without them, per route: it found the tracker's Go to button changing font, which the Docker image renders with the same face either way.

- **Preflight's zero margins, paddings and borders.** 5j dropped the rule that gave every element the browser's. What leaned on it: native fields (`NATIVE_FIELD` now reverts padding and border too), the Calculator's fieldsets (`[margin:revert]`, `[padding:revert]`, `[border:revert]`), the list indents (`pl-[40px]`, not `pl-10`, which came out narrower and moved every line) and two header and tracker buttons' padding. The inject-the-rule audit can't check an element you've already given a utility, because the utility beats the injected base rule, so it only finds what's left untreated; the baselines check the values. It also only sees what's open on each route, so popups and dialogs rely on the baselines too.
- **The last rules changed nothing.** 5k removed `legacy-base.css` with its table, `hr`, monospace and link rules. The app renders no `hr`, `code`, `kbd`, `samp` or `pre`, links had no fill either way, and the nature and ability tables already set `border-collapse` and draw no borders. No baseline shows those tables, so the check was the inject-the-rule audit with each table open: no computed style or box changed. (The audit also reports `main`'s `mx-auto` margin changing while a dialog is open; that is the stale resolved value noted in 4a, not the rule.)
- **The page nav (5l) and overflowing pages.** Pages are sized to `100dvh` less the header and the nav's row or tab bar (`--nav-top`, `--nav-bottom` on `main`; `--tab-bar` on the app). Some pages overflow that box (the empty tracker's block is 1000px tall), and the tab bar comes first in the DOM, so the overflow painted over it and took its taps; the bar is `relative z-1` below 571px. The tab bar's current page uses `--nav-active` (the badge colour darkened to 4.7:1 in light mode), because its small text failed axe's contrast where the column's large text passes. No visual state shows the 571–1147px row; `tests/e2e/main/Navigation.spec.ts` pins all three forms, and e2e runs at 1000px, so the specs see the row. The row moved PokéStats' boxes 50px down, so a Pokémon's details popover found room above the first row and covered the status tabs. It is now bounded by the tab's panel (`collisionBoundary`). A layout change can move any `side="top"` popover onto what's above it.
- **The tracker rows (5m).**
  - react-window renders `rowComponent` as a component, so an inline render function is a new component type on every render and remounts every row. The old tracker did that on every store change, and the editor, Evolve and the nickname field relied on it to copy the encounter afresh. Rows are now a stable component fed through `rowProps`: the editor's form mounts per opening (an opening counter as its key), Evolve resets on open, the nickname field follows its prop, and the tracker's Pokémon selector closes without its exit animation (`DialogContent instant`), as the remount used to make it. Keying the whole row on the encounter instead threw away keyboard focus on every change.
  - The list fills its flex parent, so it's 0px tall while the location list is open in its place. A row picked there is scrolled to once the list has its height back; scrolling at once centred it in a 0px window and left it under the toolbar.
  - Row heights are fixed per form (wide or narrow, normal or compact, nicknames or not), from the list's measured width (wide from 64rem) and the live root font size.
  - The ⋮ menu is a non-modal Radix `DropdownMenu`: a modal one sets `pointer-events: none` on the page, so a second click on ⋮ (how the specs and the old popover close it) can't land. A dialog opened from one of its items records the item as the element to refocus, and the item is gone, so those dialogs hand focus back to ⋮ (`focusBack`), but only if focus is still on the page by then: Radix calls it after the close animation, when the user may already be typing in the search field.
  - Move up and Move down (5n): rows are keyed by their place, so the ⋮ that was open belongs to the neighbour after a move. The menu's `onCloseAutoFocus` focuses the ⋮ one place up or down (found in the list by its test id, the visible index, so it works while filtering) instead of its own trigger.
  - An open Select makes the page `inert` except `[aria-live]` subtrees (toasts), so a live region inside the list kept the list live. The level readout is an `<output>`, which is a polite live region without the attribute.
- **The Calculator's sticky block (5s).** Below 750px the result card and the Pokémon switch stick to the top of the `form` scroller.
  - A sticky element's `top` is measured inside the scroller's padding, so `top-0` left the form's 8px padding as a band where scrolled content showed; it uses `-top-(--spacing-2)` against that padding.
  - The row Combobox's input is `z-2`, so fields painted through a `z-2` sticky block; it is `z-5`, and the Field panel `z-6` (in the page flow there, so it never covers the result).
  - `scroll-padding-top` follows the block's measured height (a ResizeObserver), pinned by `tests/e2e/other/CalculatorSticky.spec.ts`, which fails without it.
  - A tinted fill (`primary/12`) under link-blue text fails contrast in dark mode (4.2:1); checked segments and pressed chips use the foreground colour, with the underline or border marking them.
- **The Builder's cards (5t).**
  - A closed card's fields stay in the page behind `hidden` (preflight makes it `display: none !important`), not unmounted: the state journey deletes a member it never opened, through its `delete-team-N` with `dispatchEvent`. Tab and screen readers still skip them.
  - The header's expand button holds only the name and stretches over the header with `::after`; the type chips are buttons of their own (the type dialog) and sit above it. Its focus ring is drawn on the header with `has-[button[aria-expanded]:focus-visible]`.
  - The "Moves" caption is an `aria-hidden` span in the first move slot, not a grid `::before`: hiding generated content from screen readers (`content: … / ''`) needs Firefox 128 and Safari 17.4, past the build target.
  - Playwright counts an `aria-disabled` element as not enabled, so a spec that clicks a control to check that nothing happens needs `click({ force: true })`. A forced click also skips the wait for the sidebar's slide-out, so wait for `[data-slot="sheet-content"]` to be gone first, or the click lands on the sidebar. The team-less Coverage tab is `aria-disabled` with a hint (the user's choice, 2026-11-08; it changed two clicks in `Builder.spec.ts`).
  - macOS WebKit moves Tab between text fields only; Option+Tab reaches every control. Linux WebKit (CI) tabs to buttons. `BuilderKeyboard.spec.ts` picks the key by platform.
  - MoveSelector's tile hides its slot and type as `sr-only` text in the editor; `text(page, 'NORMAL')` in the move list matched that hidden text first, so the Builder's tile (`boldName`) names its button with `aria-label` instead.
  - Tabs has a `segmented` variant for the redesigned pages; `tab(page, 'secondary', n)` finds it too.
- **The Rules rows (5u).**
  - Rows are keyed by their place, as the tracker's are, so focus after a move or a Delete would stay with the rule that took the place. The page moves it: to the same arrow at the new index (the other one at an end), to the moved rule's ⋮ from the menu, and after Delete to the first visible button of the rule now in that place, else the previous one's, else Add rule. `RulesKeyboard.spec.ts` pins it.
  - Below 640px the row's action slots are `display: none` and the ⋮ menu takes their place, so only one set is in the accessibility tree. The e2e suite runs at 1000px, so the phone menu's code is only covered by the spec's 375px test; function coverage fell below 99% without it.
  - The rule editor is one controlled dialog owned by the page, keyed per opening so its fields start from the rule. Opened from the menu it hands focus back to the row's ⋮ (`focusBack`).
  - macOS WebKit has `navigator.share`, so Rules.spec's three Share tests fail there (the native sheet opens instead of the dialog), on master too. CI's Linux WebKit passes them.
- **The Stats chrome (5v).**
  - The segmented tabs don't wrap (`whitespace-nowrap`), so on phones, where the five tabs are equal grid columns, a long name widened its column and the list scrolled sideways (German "In Ohnmacht gefallen"). The phone tabs wrap and hyphenate; `StatsTabs.spec.ts` checks the fit at 375px in de, es and en. English baselines can't catch a translation that doesn't fit.
  - `TOOLBAR_BUTTON` lowercases a label and capitalises its first letter, for the all-caps strings the old buttons used. That breaks German nouns after the first word ("DIE EINSTELLUNGEN" became "Die einstellungen"), so new toolbar labels take normally cased strings.
  - In German the phone tab bar cut "Taschenrechner" (Calculator) to "Taschenr…". 5x makes the tab names wrap, and the German string carries a soft hyphen (`Taschen\u00adrechner`): `hyphens: auto` alone depends on the engine's hyphenation dictionary, which Linux Chromium may lack.
  - The status lists (Team, Caught, Failed, Fainted) keep their box panels: the user chose the boxes over the mockup notes' flat rows (2026-11-10).
- **The Settings rows (5w).**
  - Each switch row is a `<label htmlFor>` around the title, the hint and the Radix switch, so the whole row toggles it. A click on the switch itself lands on interactive content inside the label, so the label doesn't pass it on again and the switch toggles once. There's no `<form>`, so Radix renders no hidden input. The switch takes `aria-labelledby` (the title), because the label's own text would also include the hint in the name.
  - A `<label for>` click sends a synthetic click to a Radix Select trigger, which opens the menu only while the trigger hasn't seen a mouse press (its pointer type starts as `touch`). So the first label click opened the menu and later ones didn't. The Language label calls `preventDefault` and focuses the trigger instead.
  - Settings was short enough to fit until its hints made it taller. Pages are sized to the viewport, so a page that grows needs its own scroll area (`min-h-0 flex-1 overflow-auto`, as Rules and Builder have), or on phones its end goes under the tab bar.
  - The Language field first shipped with the g of "English" clipped: the `row` look's `leading-none` plus its truncated text, the third time after #908 and the Calculator. The look's default is now 1.4 (`fix/ui-descenders`), and `tests/e2e/main/Descenders.spec.ts` fails on clipped glyphs anywhere it looks; the rule is in the `nuzlocke-ui` skill.
  - An absence check (`toHaveCount(0)`) passes at once. Make it able to fail by showing that the same locator finds something once the state changes (SettingsRows.spec opens the menu after checking that it's closed).
- **The header (5x).**
  - The bar's height is `--header-height` (48px) on the app, used by the bar and by the page's `100dvh` calc, so the two can't drift. Every visual state shows the header, so a change to it moves every area's baselines: compare old and new row by row (each row below the bar is either the old row 8px up or unchanged) to prove the rest of the page didn't move otherwise. Dialogs stay put over the shifted page, so only their shadows' blend changes.
  - The menu's items are buttons. Choosing one from the keyboard puts focus back on the menu button. Radix's own return doesn't do it: its unmount focus runs in a timeout after the content is gone, it's turned off once anything outside the menu had focus (the header's controls, on the way in by Tab), and the trigger has no `aria-controls` once closed. Chrome also blurs an unmounting item with no `relatedTarget`. So `SheetContent` notes keyboard focus (`:focus-visible`) inside it and focuses the trigger through a ref `Sheet` shares. A click on an item also focuses it in Chrome, and moving focus after a click closed the tracker's alert popover (Rules › Over 6 alert), hence `:focus-visible`.
  - The custom game's trash keeps `aria-label="deletegame"` for `CustomGame.spec.ts`, and is named "Delete game" through `aria-labelledby`, which wins over `aria-label`.
  - Left for a follow-up: `select.tsx`'s `inline` look and `menuShift` prop and `--screen-xxs` have no callers since the game select took the row look.
- **Coverage maps drift when a file changes during a run.** Editing a source file while `npm run verify` is in its e2e stage gives the unit and e2e coverage maps different versions of it: the merge then counts each function twice, a line apart, and the thresholds fail. Leave the tree alone until the gate finishes.
- **No `contained` menus in tracker rows.** react-window 2 positions rows with a transform, which makes each row the containing block of a menu's fixed popper. A menu rendered inside a row is painted under the next row, and Radix's `scrollIntoView` on open scrolls the list. The row Status and Nature Selects portal, which let `toTopPosition` go. The interaction pin couldn't catch it: an open Radix Select turns off pointer events on `body`, so `elementFromPoint` sees through the next row (details in `CLAUDE.md`).
- **`contained` Select and margins.** Its trigger gets `w-full` of a wrapper that already includes the trigger's own margin, so a `look="button"` trigger next to other buttons grows by 0.25em. Pass `triggerClassName="w-auto"`.

- **`cn()` drops line heights.** tailwind-merge treats a font-size class as overriding any earlier `leading-*`, so `cn('leading-[1em]!', 'text-[0.786rem]!')` loses the line height and the reset's 1.15 comes back. Restate it after the size (`MINI_BUTTON`).
- **Radix rounds popper positions to whole pixels**, where Semantic's menu hung from a field at a fraction of a pixel. `Select` shifts its menu back by the dropped fraction; `PopoverContent edgeAligned` reproduces the non-pinned click Popup, whose bottom edge was rounded instead. Earlier popovers already matched without it, so it's opt-in.
- **`DialogTitle` is an `<h2>`**, and index.css styles every heading. `DialogHeader` is the title itself, as a div.
- **A trigger needs a ref.** `<PopoverTrigger asChild>` around a component that drops its ref can't position its content (it lands off screen). React 18 dropped refs on function components without `forwardRef`; on React 19 `ref` is an ordinary prop, so a component must pass it on (`Button` and `InfoButton` spread it with their other props).
- **`p` keeps Semantic's margin** (`0 0 1em`, unlayered), so `[&>p]:m-0` needs `!`.
- **Descendant selectors catch new icons.** An SCSS `.header svg` rule became `[&_svg]:size-…`, which also sized the lucide icon in a button inside that header (the Semantic `<i>` it replaced wasn't an svg). Scope such selectors to the original children.

- **Rules that never applied.**
  - **Losing selectors:** some SCSS selectors lost to Semantic's (`.container > button` against `.ui.button`, or a class from another module), so they never took effect. Copy the computed result, not the stylesheet.
  - **Name collisions:** a shared class name can style elements it wasn't meant for. For example, Image's `.team` also matched the stat icons.
- **Semantic's `Label`** drops its margin when it's the first or last child of its parent, and inherits its font.
- **Variant selectors outrank plain utilities.** A primitive's `[&_svg]:inline-block` beats `max-md:[display:none]`, so the hiding utility needs `!`.
- **Dialog titles are matched by `text(page, …)`.** A sr-only `DialogTitle` is real text, so it can be found before a button with the same words. Don't title a dialog with one of its buttons' labels.
- **Disabled items.** Semantic's disabled menu items still took clicks as far as Playwright is concerned. Ignore the change in `onValueChange` instead of passing `disabled`.
- **Remounts reset state.**
  - Semantic's Tab reused one pane, so pane state carried over between tabs. Render one `TabsContent` for the active tab to keep that.
  - A component that's always mounted keeps tab state across opens. Use an uncontrolled `defaultValue` inside dialog content.
- **Assets and URLs.**
  - A `url()` in an arbitrary utility resolves from `src/styles/globals.css`, so import assets instead (`Grass.JPG?url`). Vite's types cover only lowercase `.jpg`.
- **Editing files from scripts.**
  - Several source files use CRLF line endings. Normalize `\r\n` before string replacement in Node scripts.
  - Long heredocs with quotes broke Git Bash. Write the file with the editor tool instead.

## Setting up another machine

- **Node and dependencies.** Use the Node version in `.node-version` (24.22). Run `npm ci`, then `npx playwright install` (add `--with-deps` on Linux) for `npm run verify`'s e2e.
- **Docker** is needed for `npm run verify:visual`. Baselines are only valid when rendered in the pinned `mcr.microsoft.com/playwright:v<version>-noble` image.
  - On macOS, Docker Desktop puts its CLI in `~/.docker/bin` and may not add it to PATH. Without it, `verify:visual` exits 1 after printing only the report path (`scripts/visual.mjs` can't find `docker`). Add `export PATH="$HOME/.docker/bin:$PATH"` to `~/.zshrc`.
- **GitHub CLI:** run `gh auth login`. CI watching and PRs depend on it.
- **Git identity:** set the git user name and email, as on the original machine.
- **Windows-only notes in `CLAUDE.md`:** Git Bash and MSYS path rewriting, `Get-NetTCPConnection`, and Firefox not starting locally. On Linux or macOS, ignore them. Firefox can run locally there.
- **Claude Code permissions.**
  - The shared allowlist is checked in at `.claude/settings.json`. It covers the npm scripts, Playwright, Vitest, the linters, the control CLI and `scripts/`, read-only git plus add and commit, and read-only `gh`.
  - Its deny list blocks `npm audit fix --force`, force pushes, and reading `.env.sentry-build-plugin`.
  - `git push`, `gh pr create`, `docker run` and anything else still ask. Approve them per machine, in `.claude/settings.local.json` (gitignored).
- **Sentry token.** `.env.sentry-build-plugin` holds a Sentry auth token and is gitignored, so a new clone doesn't have it. Builds and `npm run verify` should work without it; only the source map upload in production builds needs it. Copy it over securely only if you need that.
