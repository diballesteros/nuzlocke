# UI migration handoff

This is what an agent continuing the UI migration needs. Until now, it lived in one machine's Claude memory and plan files.

Read it together with `CLAUDE.md` (commands, harness, change protocol, CI debugging) and the `nuzlocke-ui` and `verify-nuzlocke` skills in `.claude/skills/`. Those stay the source of truth for how things work. This file covers where the migration stands, what the user decided, and how they want the work done.

Last updated 2026-10-26.

## Where it stands

The goal: replace Semantic UI React and Sass with Tailwind v4 and shadcn/ui (Radix, lucide), then move to React 19, then improve the UI. The order is **parity first, redesign later**. Each area keeps its looks and behaviour until Phase 5.

| Phase | What                                                                                                  | Status                 |
| ----- | ----------------------------------------------------------------------------------------------------- | ---------------------- |
| V     | Playwright harness replaces Cypress: state goldens, visual + ARIA + axe baselines, blast-radius CI    | Done (#821)            |
| 0     | Remove Auth/Supabase                                                                                  | Done (#822)            |
| 1     | Tailwind v4 + shadcn foundation, coexisting with Semantic                                             | Done (#823)            |
| 2     | Migrate shared primitives, then one area per PR                                                       | In progress, see below |
| 3     | Remove `semantic-ui-*` and `sass`, turn on preflight, drop the Vite shims, raise `build.target`       | Not started            |
| 4     | React 19 and the packages it unblocks, one bump per commit                                            | Not started            |
| 5     | UI improvements (contrast, a11y, navigation, tracker density), each a separate PR with intended diffs | Not started            |

### Phase 2 areas

| Area                                                         | PR   | Status                                                                                                                                      |
| ------------------------------------------------------------ | ---- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `common/` Page and Back                                      | #825 | Merged                                                                                                                                      |
| Selector dialogs, Effectiveness on a Radix Dialog            | #830 | Merged                                                                                                                                      |
| ItemSelector on the Combobox                                 | #831 | Merged                                                                                                                                      |
| @misc (About, Changelog, Delete, Import, Report)             | #833 | Merged                                                                                                                                      |
| @settings (Settings, CustomStatuses)                         | #837 | Merged                                                                                                                                      |
| @rules                                                       | #838 | Merged                                                                                                                                      |
| @badges (strip, BadgePage, BadgeDetail, editor dialogs)      | #839 | Merged                                                                                                                                      |
| @builder (Builder, Coverage, Member, Effectiveness tabs)     | #840 | Merged                                                                                                                                      |
| @pokestats (Pokestats, Summary, Image, DisplaySettings, Tip) | #843 | Open, CI green, waiting for the user to merge                                                                                               |
| @calculator                                                  | —    | Next                                                                                                                                        |
| @tracker                                                     | —    | After Calculator. Keep `toTopPosition` until the interaction pin proves Radix portals make it unnecessary, then remove it in its own commit |
| App shell: header, Sidebar → Sheet, game select              | —    | Last                                                                                                                                        |

Several pieces are still Semantic because they belong to areas not migrated yet:

- **Header pencil and FAB buttons.** `BadgeEditor` and `CustomBadgeEditor` keep their trigger buttons (the header pencil and the tracker FAB's round yellow ones). The header one carries its old overrides as important utilities (`HEADER_BUTTON`).
- **Shared button style.** `assets/styles/Button.module.scss` (`iconButton`) is shared by the FAB, Share and those triggers.
- **Shared components:** `Share`, `MoveSelector`, `Natures`, `PokemonType`, `PokeInfo`, `Moves`, `Type`, `Filter`, `AddGame`, `Export`, and the tracker's `Detail`.

Migrate each one with the area that owns it. `node scripts/affected-areas.mjs <files>` shows which area that is.

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
- **Known a11y item for Phase 5:** the white-on-#2185d0 Edit custom statuses button has too little contrast.

## Waiting on the user

- Merge #843 (Pokéstats).
- Delete the hosted Supabase data and the Netlify `REACT_APP_SUPABASE_*` variables. Accounts were removed in Phase 0, and `/delete` now says the data was deleted.
- Dependabot alert 227 (sprintf-js, medium) sits in the `vite-plugin-istanbul` test-tooling chain. It's left on purpose, like the other istanbul moderates (see `CLAUDE.md`).
- `docs/agent-tasks.md` holds small tasks for a simpler agent. On the original machine it had uncommitted local edits that Claude didn't make. Check whether they need committing from there.

## Watch for

- **Possible flake:** `Builder › Coverage` failed once in about 60 local runs under parallel load. The Coverage tab click didn't take, and it never reproduced. If CI hits it, read the trace before changing anything.
- **Stuck CI job:** GitHub has twice left a finished job "in progress", which blocks the PR. Rerunning the job reproduces it. An empty commit (`ci: rerun checks`) gets a clean run.

## Techniques that worked for calibration

- **Measure Semantic, don't guess.** Launch the app with the control CLI (`node .claude/skills/verify-nuzlocke/control-nuzlocke.mjs launch`, then `seed`, `theme` and `goto`). Connect Playwright over CDP to `http://127.0.0.1:9333` and dump `getComputedStyle` and `getBoundingClientRect` for the elements you're replacing. Do this before you write any classes.
- **Read diffs at pixel level.** After `npm run verify:visual`, the `-expected`, `-actual` and `-diff` PNGs are in `verification/artifacts/visual/test-results/`. Crop and enlarge the regions side by side to see whether a change is a glyph, an offset or a size.
- **Sub-pixel offsets need the container's fonts.** Measure inside the Playwright image against a master worktree (recipe in `CLAUDE.md`). That's how a 0.094px toolbar offset in #843 was traced to a trailing icon's line box.

### Gotchas met so far

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
- **GitHub CLI:** run `gh auth login`. CI watching and PRs depend on it.
- **Git identity:** set the git user name and email, as on the original machine.
- **Windows-only notes in `CLAUDE.md`:** Git Bash and MSYS path rewriting, `Get-NetTCPConnection`, and Firefox not starting locally. On Linux or macOS, ignore them. Firefox can run locally there.
- **Claude Code permissions.**
  - The shared allowlist is checked in at `.claude/settings.json`. It covers the npm scripts, Playwright, Vitest, the linters, the control CLI and `scripts/`, read-only git plus add and commit, and read-only `gh`.
  - Its deny list blocks `npm audit fix --force`, force pushes, and reading `.env.sentry-build-plugin`.
  - `git push`, `gh pr create`, `docker run` and anything else still ask. Approve them per machine, in `.claude/settings.local.json` (gitignored).
- **Sentry token.** `.env.sentry-build-plugin` holds a Sentry auth token and is gitignored, so a new clone doesn't have it. Builds and `npm run verify` should work without it; only the source map upload in production builds needs it. Copy it over securely only if you need that.
