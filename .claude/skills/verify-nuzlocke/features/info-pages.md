# Info pages

Static and form pages: the changelog, about, bug/suggestion report, and account deletion.

## Sub-features

- `info-changelog`: `/changelog` lists the latest three releases (`changelog-list`) and more
  (`see-more`). Opening it clears the "!" new-version marker.
- `info-about`: `/about` credits, store badges and a Ko-fi link.
- `info-report`: `/report` form with type, device, OS, browser, game and description
  (`report-type`, `report-device`, `report-os`, `report-browser`, `report-selectedgame`,
  `report-description`). It posts to Netlify Forms.
- `info-delete`: `/delete` ("Account Deletion") says accounts were discontinued and their data deleted.

## How to get to it (user POV)

- Sidebar → Changelog (`changelog`), About (`about`), Report (`report`); `/delete` by URL only.
- Each page has a Back button.

## Driving it with control-nuzlocke

Preconditions:

- Seed `empty` (its stored version differs from the app's, so "!" shows).

- **Changelog.** Run `CLI goto changelog`. Three release headings show; `CLI click --testid see-more`
  shows more. Going back, the "!" marker is gone.
- **Report.** Run `CLI goto report`, then fill the selects with Playwright's `selectOption` (the CLI
  `pick` drives the app's Select and Combobox menus; these are native `<select>`s).

## Gotchas

- Don't submit the report form: it posts to the live Netlify form.
- `/delete` is kept for outside links: accounts and Supabase were removed, so it only explains that.
