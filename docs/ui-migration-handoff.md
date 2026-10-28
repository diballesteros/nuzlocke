# UI migration handoff

This is what an agent continuing the UI migration needs. Until now, it lived in one machine's Claude memory and plan files.

Read it together with `CLAUDE.md` (commands, harness, change protocol, CI debugging) and the `nuzlocke-ui` and `verify-nuzlocke` skills in `.claude/skills/`. Those stay the source of truth for how things work. This file covers where the migration stands, what the user decided, and how they want the work done.

Last updated 2026-10-28 (Phase 3 done, #858, #867 and #869; Phase 4 in progress, 4a open; backlog decisions recorded).

## Where it stands

The goal: replace Semantic UI React and Sass with Tailwind v4 and shadcn/ui (Radix, lucide), then move to React 19, then improve the UI. The order is **parity first, redesign later**. Each area keeps its looks and behaviour until Phase 5.

| Phase | What                                                                                               | Status                  |
| ----- | -------------------------------------------------------------------------------------------------- | ----------------------- |
| V     | Playwright harness replaces Cypress: state goldens, visual + ARIA + axe baselines, blast-radius CI | Done (#821)             |
| 0     | Remove Auth/Supabase                                                                               | Done (#822)             |
| 1     | Tailwind v4 + shadcn foundation, coexisting with Semantic                                          | Done (#823)             |
| 2     | Migrate shared primitives, then one area per PR                                                    | Done (#825–#857)        |
| 3     | Remove `semantic-ui-*` and `sass`, turn on preflight, drop the Vite shims, raise `build.target`    | Done (#858, #867, #869) |
| 4     | React 19 and the packages it unblocks, one bump per commit                                         | In progress, see below  |
| 5     | UI improvements (contrast, a11y, navigation, tracker density, encounter reordering), one PR each   | Not started             |
| 6     | Fixes for user reports from the issue backlog review (bugs, game data, storage, Report form)       | In progress, see below  |
| 7     | Automatic issue triage: a GitHub Action reviews each new issue and Discord alerts the owner        | Not started             |
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

**`legacy-base.css` is Phase 5's to remove.** Preflight is on, but this file, loaded right after it in the base layer, puts back what the UI was calibrated against: normalize's `box-sizing: inherit`, the browser's margins, paddings, borders and list styles, form controls' fonts and colours, inline baseline `svg` and `img` with svg overflow clipped. Calibrating each of the 43 affected files instead would have been a migration of its own. Each rule can go as an intended diff in a Phase 5 PR.

### Phase 4 PRs

The user approved this sequence (2026-10-28). Each PR waits for the previous one's merge, with one bump per commit.

| PR  | What                                                                                                                                                                                                                                                         | Status      |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| 4a  | Drop `@types/react-router-dom` (react-router 7 ships its types); `react` and `react-dom` 19.3.1 in one commit (`react-dom` pins its `react`); `@types/react` and `@types/react-dom` 19.3 (`LegacyRef` → `Ref` in `Image`); ESLint's React version set to 19. | Open        |
| 4b  | In-range updates of the React packages, one per commit: `@sentry/react` with `@sentry/vite-plugin`, `react-router-dom`, `react-i18next`, `react-toastify`, `react-window`, `zustand`, `lucide-react`.                                                        | Not started |
| 4c  | Refs as props: drop `forwardRef` from `Button` and `InfoButton`, and pass `Image`'s `forwardedRef` as `ref`. A refactor with no visual change.                                                                                                               | Not started |

What the inventory found (2026-10-28): every installed package's peer range already accepted React 19, so nothing waited on it; the Testing Library packages and the ESLint React plugins were already on their latest versions. The code had none of 19's removed APIs (`ReactDOM.render`, `findDOMNode`, string refs, `defaultProps` or `propTypes`, legacy context, `react-dom/test-utils`, `useRef()` without an argument, the global `JSX` namespace). The app doesn't use `StrictMode`, so 19's dev-only double render and double effects don't apply. Render errors no longer rethrow from the root on 19; they go to `window.reportError`, which Sentry's global handler catches, and `Sentry.ErrorBoundary` catches as before. `Sentry.reactErrorHandler` stays in Phase 8 and the built-in metadata in Phase 9. TypeScript 7 stays held (`typescript-eslint`).

How 4a was checked: the built CSS is byte-identical to master's, and the bundle grows 3.3% gzipped (React 19 itself; the budget is 5%). A comparison of the production previews (every element's attributes, computed style and box; 5 seeds × desktop and mobile × 12 routes, with transitions off) found only invisible changes:

- `useId` values look like `_r_d_` instead of `:rd:` (they show up in ids, `aria-controls` and the lucide icons' `mask` urls);
- React 19 writes some attributes in another order (`type` and `name` last on inputs);
- on desktop `/calculator`, master's live `main` reports `margin-left: 0px` for its `mx-auto` while it sits at x = 40, the same box as the branch's. A fresh copy of master's element reports 40px, so master's resolved value was stale.

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

- Dependabot alert 227 (sprintf-js, medium) sits in the `vite-plugin-istanbul` test-tooling chain. It's left on purpose, like the other istanbul moderates (see `CLAUDE.md`).
- `docs/agent-tasks.md` holds small tasks for a simpler agent. On the original machine it had uncommitted local edits that Claude didn't make. Check whether they need committing from there.

## Watch for

- **Report states under load:** the visual suite's `report` states can time out in `waitForLoadState('networkidle')` when the machine is busy, because the dev server stops answering module requests. It happens on master too: with `--grep report --repeat-each=3`, master failed 8 of 12 in one run while the React 19 branch passed. The page makes no requests of its own. Rerun on a quiet machine before suspecting a change.
- **Possible flake:** `Builder › Coverage` failed once in about 60 local runs under parallel load. The Coverage tab click didn't take, and it never reproduced. If CI hits it, read the trace before changing anything.
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
- **Saves:** call `navigator.storage.persist()` at startup (five data-loss reports).
- **Report form:** a Netlify honeypot field and a required description, against the form's spam (about 20% of reports).
- **Localisation:** nature names in de and es, not Pokémon names (#518).
- **PKHeX import (#810, #812):** IVs and EVs arrive empty and sub-areas collapse into one route. Waits on a current PKHeX box export from the user.

### Phase 7: automatic issue triage

- **Flow:**
  1. A GitHub Action runs on each new issue.
  2. Claude reads the issue and checks it against the code and earlier issues.
  3. It posts one triage comment and adds labels. The comment gives the type, the affected area (`scripts/affected-areas.mjs`), duplicates, the likely cause, a planned fix and its cost.
  4. A Discord webhook alerts the user twice: once when the issue arrives, and again with the planned review.
  5. A fix starts only after the user approves it (for example with a label). Claude then opens a PR, which goes through the same gates as any other PR.
- **Safety:** issue text comes from strangers. The triage job gets read access to the code and write access to issues only, never pushes code, and never acts on instructions inside an issue.
- **Spam signals from the review:**
  - an empty description;
  - Type, Device and OS all blank, which the form's UI can't send;
  - injection strings in fields;
  - the same text sent two or three times within minutes.

  Gen 9 and version-split requests are planned work, not declined.

- **The user sets up:**
  - the repository secrets: an Anthropic API key and the Discord webhook URL;
  - how Report form submissions become GitHub issues. They are created under the user's account, by something outside this repository.

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
  - The app already runs `@sentry/react` 11, but `Sentry.init` in `src/index.tsx` sets options back to v10's data collection. Move it to v11's defaults where they don't collect personal data.
  - After Phase 4, add React 19's root error hooks (`Sentry.reactErrorHandler`).
  - Upload source maps from the Netlify build (the token lives in Netlify's environment, never in the repo).
  - Tag releases with `REACT_APP_VERSION`.
  - Consider a tunnel route through a Netlify redirect, so ad blockers don't drop reports.
  - Consider Sentry's user feedback widget as a second way to report problems.
- **Into the loop:**
  - A Sentry alert rule opens a GitHub issue for each new error (labelled `sentry`, which already exists).
  - The Phase 7 triage reviews it like any other issue and sends the Discord alert. Sentry's own Discord integration is the fallback.
  - The free Developer plan's error quota is the limit; rate-limit the alerts so a burst can't flood the issues.

### Phase 9: SEO

- **Today:**
  - every route serves the same title, description and canonical link (the home page) and an empty `#root` until the JavaScript runs;
  - `public/sitemap.xml` lists only `/`, dated 2021, and `robots.txt` doesn't point to it;
  - there's no preview image for shares.
- **Quick wins (any time; they're more useful once Phase 8 can measure them):**
  - a sitemap of every public route generated at build time, linked from `robots.txt`;
  - an Open Graph image;
  - JSON-LD for the app;
  - resubmitting the site in Search Console.
- **After Phase 4:**
  - per-route titles and descriptions with React 19's built-in metadata;
  - pre-rendering the public routes to static HTML;
  - splitting the large game-data files out of the main bundle, for load speed;
  - a Lighthouse budget in CI.
- **Biggest lever:** indexable pages per game and route (such as an Emerald encounter list) built from the data in `src/constants/`.
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
- **A `<details>` section's children are content-box.** Chrome renders them in the `::details-content` slot, which Semantic's `* { box-sizing: inherit }` can't reach, so they inherit `content-box`. Fields that are border-box elsewhere grow by their padding there (the Detail gender Select needs `box-border!`; Semantic's search inputs there were forced border-box).
- **No `contained` menus in tracker rows.** react-window 2 positions rows with a transform, which makes each row the containing block of a menu's fixed popper. A menu rendered inside a row is painted under the next row, and Radix's `scrollIntoView` on open scrolls the list. The row Status and Nature Selects portal, which let `toTopPosition` go. The interaction pin couldn't catch it: an open Radix Select turns off pointer events on `body`, so `elementFromPoint` sees through the next row (details in `CLAUDE.md`).
- **`contained` Select and margins.** Its trigger gets `w-full` of a wrapper that already includes the trigger's own margin, so a `look="button"` trigger next to other buttons grows by 0.25em. Pass `triggerClassName="w-auto"`.

- **`cn()` drops line heights.** tailwind-merge treats a font-size class as overriding any earlier `leading-*`, so `cn('leading-[1em]!', 'text-[0.786rem]!')` loses the line height and the reset's 1.15 comes back. Restate it after the size (`MINI_BUTTON`).
- **Radix rounds popper positions to whole pixels**, where Semantic's menu hung from a field at a fraction of a pixel. `Select` shifts its menu back by the dropped fraction; `PopoverContent edgeAligned` reproduces the non-pinned click Popup, whose bottom edge was rounded instead. Earlier popovers already matched without it, so it's opt-in.
- **`DialogTitle` is an `<h2>`**, and index.css styles every heading. `DialogHeader` is the title itself, as a div.
- **A trigger needs a ref.** `<PopoverTrigger asChild>` around a component without `forwardRef` can't position its content on React 18 (it lands off screen). `Button` forwards its ref now.
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
