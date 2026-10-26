---
name: nuzlocke-ui
description: Conventions for building or migrating UI in the Nuzlocke Tracker with Tailwind v4 and shadcn/ui (Radix). Use when moving a component off Semantic UI React or Sass, adding a shadcn primitive, choosing colours, icons or breakpoints, writing locators for migrated widgets, or adding user-facing strings.
---

# Nuzlocke Tracker UI conventions

The app is moving from Semantic UI React + Sass modules to Tailwind v4 + shadcn/ui, one area per PR, with **parity first**: a migrated area should look and behave the same unless the PR says otherwise. Use the `verify-nuzlocke` skill to prove each change, and follow the change protocol in `CLAUDE.md`.

## Where things live

- `src/styles/globals.css`: Tailwind (theme and utilities only, **no preflight** until Phase 3), the design tokens, the `dark` variant, and the `@source` list.
- `src/components/ui/`: shadcn primitives, generated with `npx shadcn@4.22.1 add <name>` (config in `components.json`). They're our code after generation, so edit them freely, but keep the file names. After every `add`, check the result: the CLI has written `import { cn } from "cn"` and installed an unrelated npm package called `cn`. Fix the import to `@/lib/utils`, `npm uninstall cn`, and review any other dependency it added (`radix-ui` is expected). Then run Prettier, since it writes double quotes.
- `src/lib/utils.ts`: `cn()` for class merging.
- The `@/` import alias maps to `src/` (Vite and `tsconfig.json`). The bare aliases (`components`, `common`, `store`…) still work.

## Rules

1. **Utilities exist only for sources in the `@source` list.** Automatic detection is off, because it would read class-like words in unmigrated code (`container`, `hidden`, `visible`) and restyle Semantic markup. When you migrate an area, add its directory to the list in `globals.css`, e.g. `@source '../components/Rules';`. A class that "does nothing" usually means its directory isn't listed. Listed files are scanned whole, code and comments included: `.filter(` emits `.filter`, and a comment saying "white outline" once emitted `.outline`, which restyled Semantic's `square outline` icons in every area. Names that are both utilities and Semantic class names are blocked with `@source not inline(...)` in `globals.css`; when a diff shows up outside your area, build and list the generated utilities, then add any new collision to that list. Blocked names (`hidden`, `container`…) can't be used as utilities until Phase 3; use an equivalent (`max-sm:sr-only`, `w-full`).
2. **Unlayered CSS beats Tailwind.** Semantic CSS, `index.css` and SCSS modules aren't in cascade layers, so they win over any utility. A migrated component must drop its `*.module.scss` and every Semantic class (`ui …`). A leftover global rule still applies whatever a utility's specificity is; only an important utility (`mt-0!`) beats it. The known ones:
   - Semantic's `reset.min.css` sets `font-family`, `font-size`, `line-height` and `margin` on every `button`, `input`, `select` and `textarea`. Primitives that render those elements mark these four with `!` (see `ui/button.tsx`). It also sets `display: block` on `article`, `aside`, `footer`, `header`, `nav` and `section`, so `flex`/`grid` on those needs `!` (see `common/Page`).
   - `index.css` styles `h1`–`h5` (margins, sizes, font).
   - `.ui` overrides in `index.css`.

   - With no preflight, a border's width defaults to `medium` (3px): `border-solid` plus `border-t` draws 3px on the other three sides. Set every side (`border-0 border-t border-solid`).
   - Semantic sets `*, *::before, *::after { box-sizing: inherit }`, so `box-border` and `[box-sizing:…]` utilities lose; mark them `!`. An SCSS module that set `box-sizing: unset` made its whole subtree content-box, so padded children grew past their `width`/`min-width` (see `components/Import`).
   - `index.css` and Semantic colour every `a`, so a link styled as a button needs `text-…!` (see the Source link in `components/About`).

   Use `!` only for properties a global rule actually sets, and leave the rest for Phase 3.

3. **Colours come from tokens, never hex.** Use the semantic utilities:
   - `bg-background`, `text-foreground`
   - `bg-card`, `text-card-foreground`
   - `bg-muted`, `border-border`
   - `bg-primary`, `text-primary-foreground`
   - `text-destructive`, `ring-ring`

   App-specific ones are `bg-header`, `text-badge` and `text-placeholder`. Each maps to the app's CSS variables (`--bgprimary`, `--contrast`, `--card`…), which switch with the `dark` class on `<html>`. Need a new colour? Add a token to both `:root` and `:root.dark` in `globals.css`, plus an `@theme inline` entry. The migration ratchet counts hex colours in every other file and fails if the count goes up.

4. **Dark mode uses the `dark:` variant**, driven by the store's `darkMode` (`App.tsx` toggles the class). Never read `prefers-color-scheme` in components.
5. **Breakpoints are the app's, not Tailwind's defaults**: `xxs` 22.857rem, `xs` 35.714rem, `sm` 39.286rem, `md` 53.751rem, `lg` 85.714rem. They're the same values as `$screen-*` in `src/assets/styles/_variables.scss`. Media queries use the browser's 16px rem, not the app's 14px root, so `xs` is 571px.
6. **Spacing and type sizes:** for parity, use the existing scale with Tailwind's variable shorthand, e.g. `p-(--spacing-2)`, `gap-(--spacing-1)`, `text-(length:--font-size-3)`. Tailwind's numeric scale (`p-2` = 0.5rem = 7px at the 14px root) doesn't match the app's 4/8/12px steps.
7. **Radius:** `rounded-md` is Semantic's 0.2857rem (4px). `sm`, `lg` and `xl` are derived from it.
8. **Icons:** use `lucide-react`. Semantic `<Icon name="…">` icons are swapped area by area. Pick the closest lucide glyph and keep the size (Semantic icons are 1em). An icon-only button needs an `aria-label`.
9. **Primitives arrive with their first user.** Run `npx shadcn@4.22.1 add dialog` (or whichever) in the PR that first uses it, so unused code never ships or dilutes coverage. Replacement map:

   | Semantic UI                   | shadcn                                                                       |
   | ----------------------------- | ---------------------------------------------------------------------------- |
   | Button                        | button                                                                       |
   | Modal                         | dialog                                                                       |
   | Confirm                       | alert-dialog                                                                 |
   | Popup                         | popover, tooltip                                                             |
   | Tab                           | tabs                                                                         |
   | Checkbox (toggle)             | checkbox, switch                                                             |
   | Radio                         | radio-group                                                                  |
   | Input                         | input                                                                        |
   | Label                         | badge                                                                        |
   | Sidebar                       | sheet                                                                        |
   | Dropdown (no search)          | select                                                                       |
   | Dropdown (search or multiple) | command + popover (a shared `Combobox` wrapper, written with its first user) |
   | Dropdown (button) or Menu     | dropdown-menu                                                                |

   Shipped so far:
   - `button`: variants `default` (grey, inverted in dark mode, like `inverted={darkMode}`) and `secondary` (grey in both themes); sizes `default` and `icon`.
   - `dialog`: `DialogContent` (Semantic modal sizes, centred, focus moves to the dialog itself), `DialogBody` (Semantic's modal content; `scrolling` caps it at Semantic's scrolling height), `DialogFooter` (the actions bar), `DialogTitle` (required by Radix; use `className="sr-only"` when the design has no visible title). `dismissible={false}` keeps a dialog open on Escape and outside clicks, for dialogs that had no `onClose`.
   - `button` also has `primary` (Semantic's `primary`) and `grey` (`color="grey"`), the same in both themes; `blue`, `green` and `red` (`color="…" inverted={darkMode}`: outlined in dark mode); and `basic` (`basic inverted={darkMode}`). Size `compact-icon` is Semantic's `compact icon`.
   - `tabs`: Semantic's Tab on Radix Tabs. `variant="tabular"` (default) is the attached tabular look in the app's colours (the active tab and the panel on the secondary background); `variant="menu"` is the plain `ui menu` bar (BadgePage); `variant="secondary"` is the `secondary` menu (Builder). The `tab` helper finds a Tabs list by variant (`tab(page, 'secondary', 2)`). A Semantic disabled tab still took clicks for Playwright, so don't pass `disabled` (Playwright would wait on it): ignore the change in `onValueChange` and set `data-disabled` for the cursor, as Builder's Coverage tab does. Semantic rendered only the active pane, in the same place, so a pane's state carried over between tabs; to keep that, render one `TabsContent` with `value` set to the active tab.
   - `combobox`: Semantic's `inline search selection` Dropdown (ItemSelector, Builder's nature and ability), on cmdk and Radix Popover; its menu is portalled and carries the test id plus `-options`. Its input keeps Semantic's `search` class, which specs use. Selection is manual, as in the ARIA combobox pattern: only a click or Enter picks an option, and Escape, a click elsewhere or Tab close it, keeping the value. Semantic picked the highlighted option on blur (`selectOnBlur`); that was dropped on purpose (pinned in `combobox.test.tsx`), so don't bring it back for parity.
   - `multi-select`: Semantic's `multiple selection` Dropdown without search (labels in the field, a menu that stays open while picking). Values may be strings or numbers. Its menu renders inside the element carrying `data-testid`, like Semantic's.
   - `checkbox`: `Checkbox` (Semantic's box and check) and `CheckboxOption` (a box plus its `<label htmlFor>`; `data-testid` on the row, so `toggle` and a click on the row both work).
   - `select`: Semantic's `selection` Dropdown without search (white field, caret, attached menu), on Radix Select. Takes `options` (`{ text, value }`), `value`, `onChange(value)` and an optional `placeholder`. `look="inline"` is Semantic's `inline selection` look (page font, bold value); `look="button"` is the `button` Dropdown (a grey button whose text is the placeholder, with `value` kept empty, for menus that run an action). The menu is portalled; `contained` renders it inside a wrapper that carries `data-testid` instead, for specs that look for options inside the dropdown (Rules).
   - `input`: Semantic's white `<Input>`; `label` attaches the grey `.ui.labeled.input` label as a real `<label>`, `fluid` stretches it. Put `data-testid` on it: it goes to the `<input>`, which the `field` helper finds.
   - A dialog's sr-only `DialogTitle` is real text, so `text(page, …)` can match it before a button with the same words: don't title a dialog with one of its buttons' labels.
   - `dialog`'s `DialogContent` takes `size="small"` for Semantic's small modal (`Confirm`).
   - `icons`: one-path lucide glyphs for translucent button text (see below): plus, minus, arrow up and down, trash, pencil, x, question, chevron right. `BUTTON_ICON` sizes a glyph alone in an icon button.
   - `radio-group`: `RadioGroup` (the root; it can wrap other content, as on Import), `RadioGroupItem` (Semantic's ring and bullet) and `RadioGroupOption` (an item plus its `<label htmlFor>`, laid out like `<Radio label>`; `data-testid` goes on the wrapper, so the `toggle` helper's `label` click still works).
   - `common/SelectorRow`: the Pokémon row shared by the selector dialogs.
   - Inside a button the text colour is translucent (`--button-foreground` is `rgba(0,0,0,0.6)`), so a lucide icon made of several paths paints their overlap darker. Use the one-path glyphs in `ui/icons.tsx`, or lucide's `Icon` with a one-path `iconNode` for a new one. Lucide has no brand logos; draw those as an inline SVG (the GitHub mark in `components/About`).
   - Lucide glyphs draw smaller than FontAwesome's inside the same box. To match an icon, enlarge the SVG and give it negative margins, so it still takes Semantic's 1em × 1.18em slot and the button or line keeps its height (see `common/Back` and `common/PokemonSelector`).

10. **Locators:** keep every existing `data-testid` on the element the tests act on. Specs don't change during the migration. Only the helper bodies in `tests/e2e/helpers.ts` change (`pickOption`, `checkbox`, `modalDialog`…), and they're switched in the same PR as the widget. Radix renders `role="option"`, `role="dialog"` and so on, so prefer roles in new helpers.
11. **Behaviour changes are explicit.** Radix dialogs close on Escape and on an outside click by default. Today only dialogs with an `onClose` do (pinned in `tests/e2e/main/Interactions.spec.ts`). Keep the old behaviour unless the PR says otherwise, and update that pin in the same PR when it does. A Radix dialog makes everything outside it inert (`pointer-events: none` on `body`, `aria-hidden` on the rest), so any Semantic modal or popup that a migrated dialog opens, portalled to `body`, can't be clicked. Migrate those in the same PR (the selectors brought `Effectiveness` along: clicking a type inside a selector opens it).
12. **Strings:** every new user-facing string goes in `src/locale/{en,es,de}/<namespace>.json`.

## Checklist for an area PR

1. List the area's files and consumers (`node scripts/affected-areas.mjs <files>`).
2. Add the directory to `@source`, swap the components, delete the SCSS module, and update the helpers.
3. Lower the ratchet with `node scripts/migration-ratchet.mjs --update`.
4. Run `npm run verify`. State goldens must not change.
5. Run `npm run verify:visual`. Untouched areas must show zero diff. Review the touched diffs, update them with `--grep @<area> --update-snapshots`, and log them in `verification/approved-diffs.tsv`.
