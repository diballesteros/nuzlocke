# Roadmap

Where the project stands, what the user decided, and how they want the work done, so every session (on any machine) starts with them. Read it together with `CLAUDE.md` (commands, harness, change protocol, CI debugging) and the `nuzlocke-ui` and `verify-nuzlocke` skills in `.claude/skills/`, which stay the source of truth for how things work.

Last updated 2026-11-16.

## Where it stands

| Phase | What                                                                                             | Status                                                                          |
| ----- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| V–5   | The UI migration: Semantic UI and Sass → Tailwind v4 and shadcn/ui, React 19, the redesign       | Done, released in 7.0.0 (#922); summary below                                   |
| 6     | Fixes for user reports from the issue backlog review (bugs, game data, storage, Report form)     | Done except the PKHeX import, the IV `NaN` bug and the summary image's contrast |
| 7     | Report form issues via a Netlify function, then triage: an Action flags spam, Discord alerts     | Live since 2026-11-16 (#899, #927)                                              |
| 8     | Usage analytics on free resources, and modern Sentry reporting errors into the triage loop       | Sentry done (#891); analytics (#893) and the feedback widget (#929) open        |
| 9     | SEO: full sitemap, metadata per route, pre-rendering, structured data, indexable encounter pages | Quick wins done (#873, #874, #896); metadata (#928) and data split (#930) open  |
| 10    | Features users asked for, ranked by how many asked, one PR each                                  | Not started                                                                     |
| 11    | Gen 9: the species first, then a Scarlet/Violet game mode                                        | Not started                                                                     |

Also open: #866 (shard the visual check in CI).

### The UI migration (Phases V–5)

Parity first, redesign later: each area kept its looks and behaviour until Phase 5. Git history and the PRs hold the detail.

| Phase | What                                                                                                                                                                                                              | PRs                    |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| V     | Playwright harness replaces Cypress: state goldens, visual + ARIA + axe baselines, blast-radius CI                                                                                                                | #821                   |
| 0     | Remove Auth and Supabase                                                                                                                                                                                          | #822                   |
| 1     | Tailwind v4 + shadcn foundation, coexisting with Semantic                                                                                                                                                         | #823                   |
| 2     | Shared primitives, then one area per PR                                                                                                                                                                           | #825–#857              |
| 3     | Remove `semantic-ui-*` and `sass`, turn on preflight, Vite 8's default `build.target`                                                                                                                             | #858, #867, #869       |
| 4     | React 19 and the packages it unblocked, one bump per commit; refs as props                                                                                                                                        | #875, #878, #879       |
| 5     | Contrast and a11y fixes, encounter reordering, `legacy-base.css` removed, page nav and tab bar, and the redesigns: tracker, encounter editor, Calculator, Builder, Rules, Stats, Settings, header; no Back button | #881–#921, 7.0.0: #922 |

The approved mockups are private artifacts: the tracker (https://claude.ai/artifact/N8d6pqUacbYJ1BD18Wo1qN), the editor and Calculator (https://claude.ai/artifact/MhrapF5orEp6574iiQ5SsQ), and Builder, Rules, Stats, Settings and the header (https://claude.ai/artifact/5XP6PDuLyvTqGPJfJWCFYi). Redesigns went through a council review (the `council` skill: three read-only reviewers, iterating until each scores 9.5) of the mockups and then of the code before each PR.

## How the user wants the work done

These preferences hold across sessions:

- **One change per PR, sequenced.**
  - Branch from an up-to-date `master` (`feat/<area>`, `fix/…`).
  - For a UI change, commit the treatment first, then the baselines with their `verification/approved-diffs.tsv` rows (glob, the treatment commit's hash, a reason that covers pixels, ARIA and axe).
  - Push, open the PR and watch CI until it's green. The user merges.
  - Commit messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
  - PR bodies end with `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.
  - A PR users can notice adds a change file to `.changes/` (see `CLAUDE.md`).
- **Wait for the merge, and check it.** Start a PR that builds on another only after the user says it's merged. Then confirm it on GitHub (`gh pr view <n> --json state`) and in `origin/master` before branching. Once the user said a PR was merged when it wasn't yet.
- **Contained diffs.** Areas a PR doesn't touch show zero visual diff. Touched areas change only where the PR says so, and every changed baseline is logged.
- **Behaviour stays the same** unless the user decides otherwise. A change the user approves gets a test that pins it.
- **Existing specs change only with the user's OK.** Helper bodies in `tests/e2e/helpers.ts` may change with the markup; a spec's steps and assertions stay. New specs and new state journeys are welcome. When a change needs a spec edit (the Reset confirm in 5m, the Back button in 5y), list each edit in the PR and get the user's OK first.
- **A fix that changes results or saved data** needs the user's OK first, then a test that pins the new behaviour.
- **Document lessons before calling a task done.** Repo and tooling facts, root causes, dead ends and recipes go in `CLAUDE.md` (or the skills). Project state and user decisions go here.
- **Find root causes; don't add retries.** Reproduce CI-only or Docker-only problems in Docker rather than guessing (see the measuring recipe in `CLAUDE.md`).
- **New work goes to a fresh session**, not a long-running one.

### Hard rules

- Never update baselines of an untouched area to make a diff pass.
- Never loosen the harness: no `skip` or `only`, no masks, no thresholds.
- Never lower the coverage thresholds or any other ratchet (Lighthouse, hex colours).
- Never run `npm audit fix --force`.
- Don't change GitHub repository settings. Those are the user's.
- Don't commit `.claude/settings.local.json`.
- In GitHub text, never write a bare at-sign before a word (`@tracker` pings a real user); write "the tracker area" or use backticks.

### Decisions already made

- **Search dropdowns use manual selection** (#840). Only a click or Enter picks an option. Escape, a click elsewhere or Tab closes the list and keeps the value. Pinned in `combobox.test.tsx`.
- **Escape on dialogs:** a dialog closes on Escape only if it has an `onClose` (it did before the migration). `tests/e2e/main/Interactions.spec.ts` pins each case.
- **Accessibility:** new accessible names (aria-labels, tab names, button names) are welcome. New user-facing strings go in all three locales (en, es, de).
- **Contrast (5a):** only the Edit custom statuses button was fixed. The other `color-contrast` nodes axe reports stay for now.
- **Navigation (5l)** is the inline nav at every width plus a mobile bottom tab bar. Sidebar items as real links and more pages in the inline nav weren't chosen.
- **Tracker density (5m):** the list fills the viewport, flat rows and a compact-mode setting. Two columns on wide screens wasn't chosen.
- **The summary image** (PokéStats' export) gets two contrast fixes, the yellow ONGOING and black text on the dark type chips (approved 2026-11-10). It changes the downloaded PNG, so it's its own PR.
- **Shared pieces stay opt-in when restyled** (a `look` prop), so other areas keep their pixels.
- **Out of scope for the redesigns, kept for later:** Mega Evolution, Hidden Power and Showdown export (Phase 10), live announcement of calculator results, an attacker/defender swap, EV counters, and changes to the shared selector dialogs.

### Backlog decisions (2026-10-28)

The user's answers to the questions in the [backlog review](https://claude.ai/artifact/PbboBKCDJsxkpDQiUH3euc), a private report on all 580 GitHub issues. The work they lead to is in Phases 6–11 below.

- **Storage:** call `navigator.storage.persist()` at startup (`src/lib/storage.ts`), with no reminder to export.
- **Report form:** Netlify's honeypot (`bot-field`) and a required description. The game field stays free text.
- **Natures:** localise their names in de and es only.
- **Yellow, Emerald and Platinum:** version-tagged encounters inside their base games, not separate games.
- **Gen 9:** a later phase (Phase 11), the species first, then a Scarlet/Violet mode.
- **Analytics:** an in-house counter on Netlify (chosen over Cloudflare Web Analytics, GoatCounter and Umami). Plausible's script was removed (#915).
- **No model review in the issue triage** (2026-11-04). Don't bring it back without asking.
- **#737** stays closed.

## Waiting on the user

- `docs/agent-tasks.md` holds small tasks for a simpler agent. On the original machine it had uncommitted local edits that Claude didn't make. Check whether they need committing from there.
- **Analytics (#893):** the hosting choice. On Netlify's credit-based free plan, running out of credits pauses every site on the account.
- **Sentry:** `SENTRY_AUTH_TOKEN` in Netlify's environment for the source map upload.
- **Search Console:** submit `https://nuzlocke.netlify.app/sitemap.xml`, and again after pre-rendering or per-game pages change which URLs exist.
- **PKHeX import (#810, #812):** a current PKHeX box export.

## Watch for

- **Report states under load:** the visual suite's `report` states can time out in `waitForLoadState('networkidle')` when the machine is busy, because the dev server stops answering module requests. It happens on master too. The page makes no requests of its own. Rerun on a quiet machine before suspecting a change.
- **Possible flakes.** Each passed on a rerun; if one recurs, reproduce it with the delayed `postMessage` init script from `CLAUDE.md` before changing anything.
  - `Options › Narrow › Custom Status` (chromium, CI run 41659339824 on #896): the click on `pokemon-0` came 15 ms after picking Sword and Shield in the game Select, and the selector dialog never painted. The closing Select may have swallowed the click, or the dialog closed as soon as it opened (Select hands focus back to its trigger).
  - `Navigation › the header and its menu on a phone` (webkit, CI run 43072152552 on #924): after Tab reached the menu's Builder item, Enter left the page on `/rules`. Enter may land before the item's handler is in place.
  - `Tracker rows › Wide compact rows keep the level, status and Team inline` (webkit, CI run 43900826487 on #927): after a click on the ⋮ menu's Nature item, `menu-nature-back-0` never took focus.
- **Stuck CI job:** GitHub has twice left a finished job "in progress", which blocks the PR. Rerunning the job reproduces it. An empty commit (`ci: rerun checks`) gets a clean run.

## Phases 6–11

The user approved this roadmap on 2026-10-28, from the backlog review.

### Phase 6: fixes for user reports

One small PR per fix, each from `master`.

- **Done:** the calculator's field per side and the editor's cancel discarding IV and EV edits (#863); FRLG's gym order and the USUM, Platinum, GSC and HGSS encounter tables (#861); nature names in de and es (#864); persistent storage and the Report form's spam guards (#865).
- **Version-exclusive encounters (#924, #925).** A Version menu on the tracker toolbar of every paired game, stored as the optional `games[key].version` (absent = every version, so no persist bump); custom games never get one.
  - The tags come from Bulbapedia alone and the tables stay as they were (the user scrapped a first PR, #923, that mixed sources). Entries a table already has stay, untagged. Pokémon a table lacks were added, tagged, where Bulbapedia places them in some versions only.
  - Encounter-method labels (gifts, trades, headbutt trees, swarms, special encounters, Bug-Catching Contest, National Dex) come from Bulbapedia's location pages. Surfing and fishing count as wild and get no label.
  - #925 added 461 every-version gaps from the 1,238 listed in `scripts/version-exclusives.json`'s `missing`, after each was scored against its location's page. The other 777 stay unadded: radio and DexNav-hidden Pokémon, trades and events, false place-name matches, and entries a neighbouring location already lists.
- **Left:**
  - the IV `NaN` bug (an empty IV field; see `CLAUDE.md`'s known issues);
  - the summary image's two contrast fixes (see the decisions);
  - **PKHeX import (#810, #812):** IVs and EVs arrive empty and sub-areas collapse into one route. Waits on a current PKHeX box export from the user.

### Phase 7: automatic issue triage

`.github/workflows/triage.yml` (#899) runs `scripts/triage/triage.mjs` on every new issue, and the Report form's `submission-created` function (#927) turns each submission into an issue; `CLAUDE.md` says how both work. The user has set `DISCORD_WEBHOOK_URL`.

- **What runs:** one Discord alert per issue with its title, link and any spam signals. An empty description or two signals mark an issue as likely spam: it gets one comment and the `invalid` label, and nothing is closed. A form submission that is likely spam never becomes an issue; the function sends the only alert about it.
- **Spam signals from the backlog review:** an empty description; Type, Device and OS all blank, which the form's UI can't send; injection strings in fields; the same text sent two or three times within minutes. Nothing looks at what a report asks for.
- **Live since 2026-11-16.** The user set `GITHUB_ISSUES_TOKEN` and `DISCORD_WEBHOOK_URL` in Netlify for Production only (All scopes, marked secret; deploy previews, branch deploys and local development stay empty, so a report sent from a preview opens no issue) and turned off the Zapier zap that created these issues before, in the same format. The first live run, submission 719, became #931 and `triage.yml` sent its one Discord alert. The function's log is under the site's Logs & metrics › Functions, one `Report form submission <n>: <status>` line per submission.

### Phase 8: usage analytics and Sentry

It comes after the triage loop, so Sentry's reports can feed the loop, and before SEO, so SEO's effect can be measured.

- **Analytics: an in-house counter**, in the style of Plausible, on Netlify's free resources, with nothing leaving Netlify.
  - **8a, the collector (#893, open):** one `sendBeacon` per route change plus the selected game and first use of each feature (`src/lib/analytics.ts`); a function (`netlify/functions/event.ts`) that drops bots, Global Privacy Control, Do Not Track, other origins and non-production deploys, and rate-limits per visitor; a daily-salted visitor hash with no cookies or stored ids; Netlify Blobs with an hourly roll-up (events kept 90 days, summaries 400). No personal data, so no consent banner; the About page says what is collected.
  - **8b, the dashboard (not started):** a private stats page served by a second function and gated by a secret token in Netlify's environment (the site password is a paid feature), outside the app's router and the service worker's cache. Laid out like Plausible's:
    - a period picker (today, 7 days, 30 days, this month, 12 months, custom) with comparison to the previous period;
    - headline numbers: unique visitors, page views, views per visit, bounce rate and visit duration, each with its change;
    - a line chart of visitors or page views, switched by clicking a headline number;
    - ranked lists with share bars: referrer hosts; top, entry and exit pages; countries; device class, browser and OS; games and features;
    - clicking any row filters the whole dashboard, and a live count shows visitors in the last 5 minutes.

    A small Vite entry (`stats.html`) can build it with the app's Tailwind tokens, light and dark, and a light chart library such as uPlot. Filtering and bounce rate need event-level data, which 8a keeps for its retention window.

- **Sentry:** `src/lib/sentry.ts` holds v11's defaults with personal data kept off, the root error handlers and the `/diag` tunnel (#891; see `CLAUDE.md`). Sentry's user feedback widget, a second way to report problems, is #929 (open).
- **Into the loop (not started):** a Sentry alert rule opens a GitHub issue for each new error (labelled `sentry`, which exists), and the triage sends its Discord alert like any other issue. Sentry's own Discord integration is the fallback. The free Developer plan's error quota is the limit; rate-limit the alerts so a burst can't flood the issues.

### Phase 9: SEO

- **Done:** a build-time sitemap linked from `robots.txt` (#873), the Open Graph image and JSON-LD (#874), the Lighthouse budget in CI (#896).
- **Open:** per-route titles, descriptions, canonical and share tags (#928); each page in its own chunk with the game data out of the main bundle (#930).
- **Next:** pre-render the public routes to static HTML. The SPA fallback isn't forced, so a pre-rendered `dist/rules/index.html` is served ahead of it with no rule change; check that on a deploy preview. An unknown URL returns 200 with an empty page (a soft 404), because `AppRouter` has no catch-all route: add a not-found route and a real 404 response with the pre-rendering.
- **Biggest lever:** indexable pages per game and route (such as an Emerald encounter list) built from the data in `src/constants/`.
- **The user decides:** a custom domain instead of `nuzlocke.netlify.app`, and whether es and de get their own URLs (needed for `hreflang`).

### Phase 10: features

One PR each, in order of how many users asked:

- Soul Link and Wedlocke pairing;
- Showdown export;
- Mega Evolution and Hidden Power in the calculator;
- Elite Four rematch data;
- fixes for the summary image's Safari and overlap glitches.

### Phase 11: Gen 9

The Gen 9 species come first (the show-all list and the calculator; #814, #817). A Scarlet/Violet game mode follows, modelled on how other Nuzlocke tools handle open-world locations. Check the licence before reusing anyone's data.

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
- **Sentry token.** `.env.sentry-build-plugin` holds a Sentry auth token and is gitignored, so a new clone doesn't have it. Builds and `npm run verify` work without it; only the source map upload in production builds needs it. Copy it over securely only if you need that.
