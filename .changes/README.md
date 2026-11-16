# Change files

Each pull request that changes something users can notice adds one file here, named after the
change (`encounter-reordering.md`). `npm run release -- <major|minor|patch>` gathers them into the
next release: the in-app changelog (`src/constants/releases.json`) and `CHANGELOG.md`. It then
deletes them.

```md
---
type: fix
---

Fixed Kyurem's type from Dragon/Flying to Dragon/Ice
```

- **`type`** is `feature`, `update` or `fix`, shown as the note's tag in the app. `internal` (tooling,
  CI, refactors) goes into `CHANGELOG.md` only.
- **The note** is one paragraph, written for players: what changed for them, not how. For several
  notes of the same type, write a list of `- ` items instead; each item becomes a note.
- No change file for changes nobody would notice in the app. The PR review warns when `src/` changes
  without one; ignore the warning when that's on purpose.
