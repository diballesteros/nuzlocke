---
name: nuzlocke-ui
description: Conventions for building or migrating UI in the Nuzlocke Tracker with Tailwind v4 and shadcn/ui (Radix). Use when moving a component off Semantic UI React or Sass, adding a shadcn primitive, choosing colours, icons or breakpoints, writing locators for migrated widgets, or adding user-facing strings.
---

# Nuzlocke Tracker UI conventions

The app moved from Semantic UI React + Sass modules to Tailwind v4 + shadcn/ui, one area per PR, with **parity first**: a change should look and behave the same unless the PR says otherwise. Semantic's markup, CSS and Sass are gone; the primitives below reproduce them. Use the `verify-nuzlocke` skill to prove each change, and follow the change protocol in `CLAUDE.md`.

## Where things live

- `src/styles/globals.css`: Tailwind (theme, preflight, utilities), the design tokens, the `dark` variant and `@source`.
- `src/styles/legacy-base.css`: loaded in the base layer right after preflight. It restores the element defaults the UI was calibrated against under Semantic's reset (normalize.css v7, `box-sizing: inherit`, the browser's margins, borders, list styles, form-control fonts and colours, inline baseline `svg`/`img`). Each rule is a parity debt for Phase 5 to remove as an intended diff.
- `src/components/ui/`: shadcn primitives, generated with `npx shadcn@4.22.1 add <name>` (config in `components.json`). They're our code after generation, so edit them freely, but keep the file names. After every `add`, check the result: the CLI has written `import { cn } from "cn"` and installed an unrelated npm package called `cn`. Fix the import to `@/lib/utils`, `npm uninstall cn`, and review any other dependency it added (`radix-ui` is expected). Then run Prettier, since it writes double quotes.
- `src/lib/utils.ts`: `cn()` for class merging.
- The `@/` import alias maps to `src/` (Vite and `tsconfig.json`). The bare aliases (`components`, `common`, `store`…) still work.

## Rules

1. **Utilities come from all of `src`** except test files (`@source '..'` in `globals.css`). Files are scanned whole, so words in code, comments and game data emit utilities too (`.filter(` emits `.filter`). That's harmless as long as no markup uses a bare utility name as a plain class name, so don't add classes like `container` or `hidden` for anything but their utility.
2. **The cascade.** Tailwind's preflight and `legacy-base.css` sit in the base layer, so any utility overrides them. Unlayered CSS still wins over every utility, whatever its specificity; only an important utility (`mt-0!`) beats it. What's left unlayered:
   - `index.css`: `body`, `h1`–`h5` (margins, sizes, font), `p` (margin `0 0 1em`), `a` (colour) and the scrollbars. So `[&>p]:m-0` needs `!`, and a link styled as a button needs `text-…!` (see the Source link in `components/About`).
   - `assets/styles/pokemon.css` and `item.css`: the sprite classes.

   The many `!` utilities written against Semantic's unlayered reset (fonts, margins and `display` on form controls and sectioning elements, `box-sizing`, fieldset padding) still work, so leave them; new code doesn't need them. Two defaults from `legacy-base.css` still shape new code:
   - Borders are the browser's (`none`, `medium`): `border-solid` plus `border-t` draws 3px on the other three sides. Set every side (`border-0 border-t border-solid`).
   - `box-sizing` is inherited from `html`'s `border-box`, except inside `<details>` (its `::details-content` doesn't inherit it). An element that sets `content-box` makes its whole subtree content-box.

   Removing Semantic's reset showed utilities that had never applied, because the reset beat them (`appearance-none` on buttons, `overflow-visible` on `ICON_SLOT`). With everything layered they would suddenly apply, so the PR removed them. When a diff appears in code nobody touched, look for a utility like that first.

3. **Colours come from tokens, never hex.** Use the semantic utilities:
   - `bg-background`, `text-foreground`
   - `bg-card`, `text-card-foreground`
   - `bg-muted`, `border-border`
   - `bg-primary`, `text-primary-foreground`
   - `text-destructive`, `ring-ring`

   App-specific ones are `bg-header`, `text-badge` and `text-placeholder`. Each maps to the app's CSS variables (`--bgprimary`, `--contrast`, `--card`…), which switch with the `dark` class on `<html>`. Need a new colour? Add a token to both `:root` and `:root.dark` in `globals.css`, plus an `@theme inline` entry. The migration ratchet counts hex colours in every other file and fails if the count goes up.

4. **Dark mode uses the `dark:` variant**, driven by the store's `darkMode` (`App.tsx` toggles the class). Never read `prefers-color-scheme` in components.
5. **Breakpoints are the app's, not Tailwind's defaults**: `xxs` 22.857rem, `xs` 35.714rem, `sm` 39.286rem, `md` 53.751rem, `lg` 85.714rem. They're the same values as the old Sass `$screen-*` variables. Media queries use the browser's 16px rem, not the app's 14px root, so `xs` is 571px.
6. **Spacing and type sizes:** for parity, use the existing scale with Tailwind's variable shorthand, e.g. `p-(--spacing-2)`, `gap-(--spacing-1)`, `text-(length:--font-size-3)`. Tailwind's numeric scale (`p-2` = 0.5rem = 7px at the 14px root) doesn't match the app's 4/8/12px steps.
7. **Radius:** `rounded-md` is Semantic's 0.2857rem (4px). `sm`, `lg` and `xl` are derived from it.
8. **Icons:** use `lucide-react` or the one-path glyphs in `ui/icons.tsx`. Keep Semantic's 1em size where an icon replaces one. An icon-only button needs an `aria-label`.
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
   - `button` forwards its ref (it can be a Radix `asChild` trigger). `TOGGLE_BUTTON` is Semantic's active `toggle` (green; set `aria-pressed`), `MINI_BUTTON` its `mini` size.
   - `fab-button`: the tracker FAB's round buttons (`colour` blue, green, red, yellow, or `toggle` for the FAB's own, the badge colour and green while `active`); `FAB_ICON` places the glyph.
   - `dialog` also has `DialogHeader`, Semantic's visible modal header; it is the dialog's title.
   - `button` also has `primary` (Semantic's `primary`) and `grey` (`color="grey"`), the same in both themes; `blue`, `green` and `red` (`color="…" inverted={darkMode}`: outlined in dark mode); `solid-green` (`color="green"` without `inverted`; for `color="blue"` without it use `primary`); and `basic` (`basic inverted={darkMode}`). Size `compact-icon` is Semantic's `compact icon`.
   - `tabs`: Semantic's Tab on Radix Tabs. `variant="tabular"` (default) is the attached tabular look in the app's colours (the active tab and the panel on the secondary background); `variant="menu"` is the plain `ui menu` bar (BadgePage); `variant="secondary"` is the `secondary` menu (Builder). The `tab` helper finds a Tabs list by variant (`tab(page, 'secondary', 2)`). A Semantic disabled tab still took clicks for Playwright, so don't pass `disabled` (Playwright would wait on it): ignore the change in `onValueChange` and set `data-disabled` for the cursor, as Builder's Coverage tab does. Semantic rendered only the active pane, in the same place, so a pane's state carried over between tabs; to keep that, render one `TabsContent` with `value` set to the active tab.
   - `badge`: Semantic's `Label` (bold grey tag, the parent's font, no margin at its parent's edges). In a menu item or a stat row, pass Semantic's darker look as classes (see Pokestats).
   - `popover`: Semantic's `Popup on="click" pinned position="top center" inverted={darkMode}`, on Radix Popover. Make its trigger a `<button>` (with Semantic's reset undone, as in Pokestats), not a `div`: Radix puts `aria-expanded` on it.
   - `combobox`: Semantic's `inline search selection` Dropdown (ItemSelector, Builder's nature and ability), on cmdk and Radix Popover; its menu is portalled and carries the test id plus `-options`. Its input keeps Semantic's `search` class, which specs use. Selection is manual, as in the ARIA combobox pattern: only a click or Enter picks an option, and Escape, a click elsewhere or Tab close it, keeping the value. Semantic picked the highlighted option on blur (`selectOnBlur`); that was dropped on purpose (pinned in `combobox.test.tsx`), so don't bring it back for parity.
   - `multi-select`: Semantic's `multiple selection` Dropdown without search (labels in the field, a menu that stays open while picking). Values may be strings or numbers. Its menu renders inside the element carrying `data-testid`, like Semantic's.
   - `checkbox`: `Checkbox` (Semantic's box and check) and `CheckboxOption` (a box plus its `<label htmlFor>`; `data-testid` on the row, so `toggle` and a click on the row both work).
   - `select`: Semantic's `selection` Dropdown without search (white field, caret, attached menu), on Radix Select. Takes `options` (`{ text, value }`), `value`, `onChange(value)` and an optional `placeholder`. `look="inline"` is Semantic's `inline selection` look (page font, bold value); `look="text"` is the plain `inline` Dropdown (bold value and caret, no field; PokéStats' status); `look="button"` is the `button` Dropdown (a grey button whose text is the placeholder, with `value` kept empty, for menus that run an action). The menu is portalled and carries the test id plus `-options`, which the `options` helper reads; `contained` renders it inside a wrapper that carries `data-testid` instead, for specs that look for options inside the dropdown (Rules). Never use `contained` inside a virtualized tracker row: react-window 2 positions rows with a transform, so the next row would paint over the menu. A long list's menu (the games, Add game's template) takes `menuClassName={SELECTION_MENU}`: Semantic's max height counted the menu's bottom border and its first item kept the rule above it. A portalled menu inherits the body's font, so pass `font-control` when Semantic's was in Lato. `menuShift="content"` moves only the menu's content by the sub-pixel Radix dropped, keeping its borders on whole pixels (the header's game select, whose Semantic menu hung from the field in the same layer). `caret="font"` is the icon font's wider caret; nudge it with `caretShift`, since the SVG itself snaps to whole pixels.
   - `select` also takes `icon` (a glyph in place of the caret), `align="end"` (`direction="left"`), `scrolling` (Semantic's `scrolling` menu), `triggerClassName` (with `contained`, `className` goes to the wrapper), `menuClassName` and `menuOffset`. Options may carry an `icon`, drawn before the text in the menu only. The menu is shifted to the field's exact sub-pixel position, as Semantic's was.
   - `popover`: `edgeAligned` places a `side="top" align="end"` bubble where Semantic's non-pinned click Popup put it.
   - `input`: Semantic's white `<Input>`; `label` attaches the grey `.ui.labeled.input` label as a real `<label>`, `fluid` stretches it. Put `data-testid` on it: it goes to the `<input>`, which the `field` helper finds.
   - A dialog's sr-only `DialogTitle` is real text, so `text(page, …)` can match it before a button with the same words: don't title a dialog with one of its buttons' labels.
   - `dialog`'s `DialogContent` takes `size="small"` for Semantic's small modal (`Confirm`).
   - `icons`: one-path lucide glyphs for translucent button text (see below): plus, minus, arrow up, down and right, trash, pencil, x, question, chevron right, download, share, settings, refresh, check, eye and eye off, repeat, shuffle, search and filter (FontAwesome's solid funnel). `TRAILING_ICON` places a glyph after a button's text without growing the line (the button stays exactly 1em + padding tall). `BUTTON_ICON` sizes a glyph alone in an icon button, and `TOOLBAR_ICON` is a trailing icon set exactly `--spacing-1` after the text (the tracker and Rules toolbars). The shell added menu, map, book, chart pie, gavel, calculator, wrench, upload, bug and clipboard, merged into one path each from lucide's elements. `ICON_SLOT` keeps Semantic's exact 1.18em × 1em icon box and scales only the drawing to 1.16em, so a glyph in running text, a flex row or a float moves nothing around it (the header, nav and sidebar). `MarsIcon` and `VenusIcon` are the gender marks (`getGenderIcon` in `components/PokeInfo`): unscaled, on the baseline and nudged down 0.1em, where FontAwesome drew them.
   - `sheet`: Semantic's overlay `Sidebar` (the app's menu) on a non-modal Radix Dialog. Like Semantic's, it leaves focus where it was, ignores Escape, and a click outside closes it and still reaches its target. `SheetContent` isn't portalled: it slides in over the page inside the element that dims (App's Pushable and Pusher, kept as plain divs for their scroll container and stacking). `SheetItem` is a vertical menu item with the rule under it; `SHEET_ICON` floats its glyph right. It is `role="dialog"` and stays mounted for its 500ms slide-out, so `modalDialog` excludes it.
   - `radio-group`: `RadioGroup` (the root; it can wrap other content, as on Import), `RadioGroupItem` (Semantic's ring and bullet) and `RadioGroupOption` (an item plus its `<label htmlFor>`, laid out like `<Radio label>`; `data-testid` goes on the wrapper, so the `toggle` helper's `label` click still works).
   - `common/SelectorRow`: the Pokémon row shared by the selector dialogs.
   - `switch`: Semantic's `fitted toggle` Checkbox on Radix Switch (role="switch", test id on the switch itself; the `toggle` helper clicks it). Name it with `aria-labelledby`.
   - `popover` also exports `HoverPopover`: Semantic's default Popup (hover opens after 50 ms, leaving closes after 70 ms, a click toggles, position "top left", focus stays put). `Calculator/elements/Help` wraps it with the `question circle` icon (`QuestionCircleIcon` in `ui/icons`). `inverted={false}` keeps the white bubble in dark mode, for Popups that had no `inverted={darkMode}` (the Filter inside dialogs).
   - `dialog` exports `DialogTrigger`; `input` takes `inputClassName` for the `<input>` itself (the Detail level fields' transparent look); `button` has `basic-plain`, Semantic's `basic` without `inverted` (the same in both themes).
   - `components/Filter`: the search field with its corner help icon and the toggle filter button. Its help icon comes before the search icon in the DOM, because the `helpIcon` helper takes the field's first svg. `components/Natures` exports `InfoButton` (the `icon="question"` button) and the table classes Abilities shares.
   - `select` also has `look="contrast"` (a transparent field with a faint important border, which keeps its hover border while open; the Calculator's gender), `clearable`, `disabled` and `text` (fixed text in place of the value). `select` and `combobox` take `caret="font"`, the icon font's caret as the Calculator drew it; the default caret stays as calibrated for the other areas.
   - Semantic's `toggle` Button is `variant={active ? 'solid-green' : 'secondary'}` with `aria-pressed`. A grey button that Semantic showed focused after a click needs `focus:bg-grey-focus` (the primitive uses `focus-visible`).
   - An icon-font glyph sits on its line box, not in the middle of its 1em slot. Where the line height isn't 1em, move the SVG by `translate-y-[calc((1lh-1em)/2)]` (Calculator's help icons and chevron). A flex item icon shrinks to its glyph's width when space runs out (`min-w-…` instead of `shrink-0`).
   - Chrome snaps an absolutely positioned SVG to whole pixels, so sub-pixel `right`/`left` changes do nothing; shift the drawing inside its `viewBox` instead (`FONT_CARET_BOX` in `ui/select`).
   - Inside a button the text colour is translucent (`--button-foreground` is `rgba(0,0,0,0.6)`), so a lucide icon made of several paths paints their overlap darker. Use the one-path glyphs in `ui/icons.tsx`, or lucide's `Icon` with a one-path `iconNode` for a new one. Lucide has no brand logos; draw those as an inline SVG (the GitHub mark in `components/About`).
   - Lucide glyphs draw smaller than FontAwesome's inside the same box. To match an icon, enlarge the SVG and give it negative margins, so it still takes Semantic's 1em × 1.18em slot and the button or line keeps its height (see `common/Back` and `common/PokemonSelector`).
   - Anything inside PokéStats' `Image` is exported by `html-to-image`, which copies each element's computed style inline but clones an `<svg>` whole, without its children's styles; the page's stylesheets don't reach the PNG. So classes on an SVG's children (`<circle>`, `<path>`, `<text>`) are lost in the download (the completion ring came out as a black disc). Put the classes on the `<svg>` and let the children inherit `fill`, `stroke` and the font, or use presentation attributes and `currentColor`. `PokéStats › Download Image keeps the completion ring` samples the PNG.

10. **Locators:** keep every existing `data-testid` on the element the tests act on. Specs don't change during the migration. Only the helper bodies in `tests/e2e/helpers.ts` change (`pickOption`, `checkbox`, `modalDialog`…), and they're switched in the same PR as the widget. Radix renders `role="option"`, `role="dialog"` and so on, so prefer roles in new helpers.
11. **Behaviour changes are explicit.** Radix dialogs close on Escape and on an outside click by default. Today only dialogs with an `onClose` do (pinned in `tests/e2e/main/Interactions.spec.ts`). Keep the old behaviour unless the PR says otherwise, and update that pin in the same PR when it does. A Radix dialog makes everything outside it inert (`pointer-events: none` on `body`, `aria-hidden` on the rest), so any Semantic modal or popup that a migrated dialog opens, portalled to `body`, can't be clicked. Migrate those in the same PR (the selectors brought `Effectiveness` along: clicking a type inside a selector opens it).
12. **Strings:** every new user-facing string goes in `src/locale/{en,es,de}/<namespace>.json`.

## Checklist for an area PR

1. List the area's files and consumers (`node scripts/affected-areas.mjs <files>`).
2. Swap the components and update the helpers.
3. Lower the ratchet with `node scripts/migration-ratchet.mjs --update`.
4. Run `npm run verify`. State goldens must not change.
5. Run `npm run verify:visual`. Untouched areas must show zero diff. Review the touched diffs, update them with `--grep @<area> --update-snapshots`, and log them in `verification/approved-diffs.tsv`.
