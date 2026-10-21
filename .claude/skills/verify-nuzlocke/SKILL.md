---
name: verify-nuzlocke
description: Drive the Nuzlocke Tracker web app (React/Vite PWA) like a user and capture proof. Use to verify any UI or behaviour change, reproduce a bug, check a page in light/dark or mobile/desktop, or get the persisted store after a journey. Covers launch, health check, seeds, the control CLI, the feature map, and the pins (state goldens, visual + ARIA baselines, e2e) that guard UI migrations.
---

# Verify the Nuzlocke Tracker

The app is a client-side PWA. All user data lives in one Zustand store persisted to
`localStorage["pokemon-tracker"]`, so "what the app did" is always visible as that JSON plus the
screen. Prove behaviour on the running app, never by reading code or "it compiles".

## Launch

```bash
node .claude/skills/verify-nuzlocke/control-nuzlocke.mjs launch          # Vite dev on 127.0.0.1:3100
node .claude/skills/verify-nuzlocke/control-nuzlocke.mjs launch --prod   # vite build + preview
```

Ready means the app shell (`[data-testid="app"]`) rendered, not just that the port answers. Launch
starts a detached host that owns Vite and a Chromium with CDP on :9333. The app starts with empty
storage, so pick a seed next. Ports 3100/9333 never collide with Playwright tests (3001) or Cypress
(3000). If the port is taken, launch refuses; don't drive someone else's server.

## Doctor

```bash
node .claude/skills/verify-nuzlocke/control-nuzlocke.mjs doctor
```

Run it before the first drive, after any failed drive, and whenever something looks off. It checks
the host and Vite pids, both ports, that the app rendered, and that the persisted store version
matches `version` in `src/store.ts`. `consoleErrors` counts errors since launch; read them with
`console`. Expected noise while Semantic UI is still in use: React's `findDOMNode` and
`defaultProps` warnings.

## Drive

Run `node .claude/skills/verify-nuzlocke/control-nuzlocke.mjs help` for the full list. Each command
prints one JSON object; `ok: false` comes with a `hint`.

```bash
CLI=.claude/skills/verify-nuzlocke/control-nuzlocke.mjs
node $CLI seed mid-run                       # see "Seeds" below
node $CLI goto rules                         # leading / optional (Git Bash rewrites "/rules")
node $CLI click --testid add-rule            # or --role button --name "Save", or --text Save
node $CLI type add-rule-input "No items in battle"
node $CLI click --text Save
node $CLI pick status-0 Fainted              # dropdown option by text or 0-based index
node $CLI toggle settings-darkmode
node $CLI theme light | dark
node $CLI viewport mobile | desktop
node $CLI state --out verification/artifacts/after.json
```

Prefer `data-testid` handles (listed per feature in the map), then roles and accessible names.
Never coordinates.

## Seeds

`verification/seeds/*.json` are persisted stores produced by driving the real app
(`npm run seeds`, source `tests/seeds/generate.spec.ts`):

| Seed            | State                                                                                                                                                                                                                  |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `empty`         | First visit, no game selected (dark)                                                                                                                                                                                   |
| `game-selected` | FireRed and LeafGreen selected, nothing tracked (dark)                                                                                                                                                                 |
| `light-mode`    | Same as `game-selected` with dark mode off                                                                                                                                                                             |
| `mid-run`       | Sword and Shield run from `Team.json`: team, boxed, failed and fainted Pokémon; 2 badges; an extra rule; custom status "Traded"; a Builder team member; calculator level 42. Light mode, because the import carried it |
| `custom-game`   | Custom game "Emerald Kaizo" (template encounters), a level cap 12, an extra encounter                                                                                                                                  |

`src/verification.seeds.test.ts` fails when a seed no longer loads at the current persist version.
Regenerate the seeds after any store-shape change.

## Evidence

Everything goes to `verification/artifacts/` (gitignored), named with `--name`:

- `snapshot --name <n>`: ARIA snapshot (YAML) of the page
- `screenshot --name <n> [--full]`
- `state --out <file>`: the persisted store
- `console`: errors and warnings since launch

Proof standards:

- Exercise the real user path, not store setters or test-only hooks.
- Capture the action and the resulting state: the screenshot or ARIA snapshot, and the stored JSON
  for anything that mutates data.
- Name which feature-map entry and entry point you drove. A path you could not reach is reported
  with its unmet precondition, never as verified through a different path.

## Cleanup

```bash
node .claude/skills/verify-nuzlocke/control-nuzlocke.mjs cleanup
```

Stops only the host and Vite pids that launch recorded (tree kill), never by process name.
Evidence stays. After a failed iteration, run cleanup before relaunching.

## Feature map

[features/README.md](features/README.md) indexes every user-facing feature: what it does, how a
user reaches it, the handles to drive it, and gotchas. Read the matching file before driving a
feature. When you change a feature's behaviour or handles, update its file in the same change.

## Pins (what CI holds every UI change to)

| Pin                                                          | Where                            | Run                                             |
| ------------------------------------------------------------ | -------------------------------- | ----------------------------------------------- |
| e2e journeys (chromium, firefox, webkit)                     | `tests/e2e/**`                   | `npm run pw:e2e` / `npm run pw:e2e:all`         |
| Persisted-store goldens: must not change in a UI-only change | `tests/state/**`, `__goldens__/` | `npx playwright test --project=state`           |
| Seeds load at the current store version                      | `src/verification.seeds.test.ts` | `npx vitest run src/verification.seeds.test.ts` |

All UI-library-specific selectors live in `tests/e2e/helpers.ts`. When a widget moves to a new UI
library, change the helper body and leave the specs alone.

## Gotchas

- Cypress-style `force` clicks are ported as `dispatchEvent('click')` (Cypress dispatches to the
  element; Playwright's `force` still clicks at coordinates and hits whatever covers it).
- Type with keystrokes (`typeInto`) where intermediate values matter: e.g. the ruleset-name input
  warns while the partial name matches an existing ruleset.
- The first tracker row's nature menu opens upward under the badge strip, so its top options are
  covered (a real UI bug, left until the redesign; helpers pick them with `{ covered: true }`).
- Hovering a badge also clears its grayscale filter: move the pointer away before asserting.
- Text uppercased by CSS (PokéStats card headings) is title case in the DOM.
- Playwright's own Firefox build fails to start on the maintainer's Windows machine ("side-by-side
  configuration is incorrect"). Run Firefox in CI or in the `mcr.microsoft.com/playwright` image.
