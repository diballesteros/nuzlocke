---
name: nuzlocke-ui
description: Conventions for building UI in the Nuzlocke Tracker with Tailwind v4 and shadcn/ui (Radix). Use when writing or restyling a component, adding a shadcn primitive, choosing colours, icons, spacing or breakpoints, writing e2e locators and helpers, or adding user-facing strings.
---

# Nuzlocke Tracker UI conventions

Components use Tailwind v4 utilities and shadcn/ui primitives (Radix, lucide). Use the `verify-nuzlocke` skill to prove each change, and follow the change protocol in `CLAUDE.md`: areas a PR doesn't touch keep their pixels, and every baseline it changes is logged.

## Where things live

- `src/styles/globals.css`: Tailwind (theme, preflight, utilities), the design tokens, the `dark` variant and the breakpoints.
- `src/index.css`: the root font size (14px), the `--spacing-*` and `--font-size-*` scales, and base rules for `body`, headings, `p`, `a` and the scrollbars.
- `src/components/ui/`: shadcn primitives, generated with `npx shadcn@4.22.1 add <name>` (config in `components.json`). They're our code after generation, so edit them freely, but keep the file names.
- `src/lib/utils.ts`: `cn()` for class merging.
- The `@/` import alias maps to `src/` (Vite and `tsconfig.json`). The bare aliases (`components`, `common`, `store`…) work too.

## Adding a primitive

- Add it in the PR that first uses it, so unused code never ships or dilutes coverage.
- **Check what the CLI wrote.** shadcn 4.22.1 has written `import { cn } from "cn"` and installed an unrelated npm package called `cn`. Fix the import to `@/lib/utils`, `npm uninstall cn`, and review any other dependency it added (`radix-ui` is expected). Then run Prettier, since it writes double quotes.

## Rules

1. **Utilities come from all of `src`** except test files (`@source '..'` and `@source not '../**/*.test.{ts,tsx}'` in `globals.css`). Files are scanned whole, so words in code, comments and game data emit utilities too (`.filter(` emits `.filter`). Don't use a bare utility name (`container`, `hidden`) as a plain class name for anything but its utility.
2. **The cascade.** Tailwind sits in cascade layers with preflight in `base`, so any utility beats preflight. Unlayered CSS beats every utility whatever its specificity, and only an important utility (`mt-0!`) wins over it. What's unlayered:
   - `index.css`: `body`, `h1`–`h5` (margins, sizes, font), `p` (margin `0 0 1em`), `a` (colour) and the scrollbars. So `[&>p]:m-0` needs `!`, and a link styled as a button needs `text-…!` (the Source link in `components/About`).
   - `assets/styles/pokemon.css` and `item.css`: the sprite classes.

   Older components carry `!` utilities that are no longer needed; leave them unless you're restyling that component. Preflight's defaults shape new code:
   - Every element starts with no margin, no padding and a `0 solid` border, so `border-t` alone draws a 1px top border. Lists, fieldsets, buttons and fields have none of the browser's spacing: declare it (`my-[1em] pl-[40px]` for a list; the root font isn't 16px, so `pl-10` isn't 40px), or use `[padding:revert]`, `[margin:revert]` or `[border:revert]` for the browser's exact value (the Calculator's fieldsets).
   - Every element is `border-box`. Lists have no markers (declare `list-disc`/`list-decimal`).
   - `img` and `svg` are blocks on the middle, with `img` at `max-width: 100%`. An icon in a line of text needs `inline-block align-baseline`; an image that must not shrink takes `max-w-none`.
   - Form controls inherit their font and colour on a transparent fill. A native field with no design of its own takes `NATIVE_FIELD` (`components/ui/input.tsx`) for the browser's look, or `NATIVE_TEXT_FIELD` for a `type="text"` input.

3. **Colours come from tokens, never hex.** Use the token utilities: `bg-background`, `text-foreground`, `bg-card`, `bg-muted`, `border-border`, `bg-primary`, `text-primary-foreground`, `text-destructive`, `ring-ring`, and the app's own (`bg-header`, `text-badge`, `text-placeholder`, `text-row-muted`…). Each maps to a CSS variable that switches with the `dark` class on `<html>`. Need a new colour? Add the variable to both `:root` and `:root.dark` in `globals.css`, plus an `@theme inline` entry. `scripts/hex-colours.mjs` counts hex colours in every other file under `src` (sprite sheets aside) and fails CI if the count goes up; when you replace one with a token, lower the recorded count with `node scripts/hex-colours.mjs --update`.
4. **Dark mode uses the `dark:` variant**, driven by the store's `darkMode` (`App.tsx` toggles the class). Never read `prefers-color-scheme` in components.
5. **Breakpoints are the app's, not Tailwind's defaults**: `xxs` 22.857rem, `xs` 35.714rem, `sm` 39.286rem, `md` 53.751rem, `lg` 85.714rem. Media queries use the browser's 16px rem, not the app's 14px root, so `xs` is 571px. The page nav in `App.tsx` changes form at 571px and 1148px (`max-[35.643rem]`, `min-[35.714rem]:max-[71.714rem]`, `min-[71.786rem]`): a fixed-height page sized below the header leaves room for `--nav-top` and `--nav-bottom`, and anything fixed near the bottom of a phone screen sits above `--nav-bottom` (the tracker FAB, the toasts).
6. **Spacing and type sizes:** use the app's scale with Tailwind's variable shorthand, e.g. `p-(--spacing-2)`, `gap-(--spacing-1)`, `text-(length:--font-size-3)`. Tailwind's numeric scale (`p-2` = 0.5rem = 7px at the 14px root) doesn't match the app's 4/8/12px steps.
7. **Radius:** `rounded-md` is 0.2857rem (4px). `sm`, `lg` and `xl` are derived from it.
8. **Icons:** use the one-path glyphs in `ui/icons.tsx`, or `lucide-react`. An icon-only button needs an `aria-label`.
   - Inside a grey button the text colour is translucent (`--button-foreground` is `rgba(0,0,0,0.6)`), so a lucide icon made of several paths paints its overlaps darker. That's why `ui/icons.tsx` redraws lucide glyphs as one path each; for a new one, use lucide's `Icon` with a one-path `iconNode`. Lucide has no brand logos; draw those as an inline SVG (the GitHub mark in `components/About`).
   - `BUTTON_ICON` sizes a glyph alone in an icon button, `TRAILING_ICON` places one after a button's text without growing the line, `TOOLBAR_ICON` sets one `--spacing-1` after the text, and `ICON_SLOT` (the header and nav) keeps a 1.18em × 1em box with the drawing scaled to 1.16em. `MarsIcon` and `VenusIcon` are the gender marks (`getGenderIcon` in `components/PokeInfo`).
   - Chrome snaps an absolutely positioned SVG to whole pixels, so sub-pixel `right`/`left` changes do nothing; shift the drawing inside its `viewBox` instead (`FONT_CARET_BOX` in `ui/select`).
   - Anything inside PokéStats' `Image` is exported by `html-to-image`, which copies each element's computed style inline but clones an `<svg>` whole, without its children's styles. Classes on an SVG's children (`<circle>`, `<path>`, `<text>`) are lost in the download (the completion ring came out as a black disc). Put the classes on the `<svg>` and let the children inherit `fill`, `stroke` and the font, or use presentation attributes and `currentColor`. `PokéStats › Download Image keeps the completion ring` samples the PNG.
9. **Locators:** keep every existing `data-testid` on the element the tests act on, and select by test id or role in new code. Anything that depends on a primitive's markup lives in `tests/e2e/helpers.ts` (`pickOption`, `options`, `dropdownText`, `checkbox`, `toggle`, `tab`, `modalDialog`, `pressEscape`, `clickOutside`, `typeInto`, `importFile`…), so a primitive change updates a helper body, not the specs. Changing an existing spec's steps or assertions needs the user's OK.
10. **Behaviour changes are explicit.** Radix dialogs close on Escape and on an outside click by default; here only dialogs with an `onClose` do (`dismissible={false}` keeps the others open, pinned in `tests/e2e/main/Interactions.spec.ts`). Update that pin in the same PR when a dialog's behaviour changes on purpose. A modal Radix layer makes everything outside it inert (`pointer-events: none` on `body`, `aria-hidden` on the rest), so a popup a dialog opens must be a Radix layer too.
11. **Strings:** every new user-facing string goes in `src/locale/{en,es,de}/<namespace>.json`, in all three locales.
12. **`cn()` drops line heights.** tailwind-merge treats a font-size class as overriding an earlier `leading-*`, so `cn('leading-[1em]!', 'text-[0.786rem]!')` loses the line height. Restate it after the size (`MINI_BUTTON`).

## Primitives

- `button`: variants `default` (grey, outlined white in dark mode), `secondary` (grey in both themes), `primary`, `grey`, `blue`, `green`, `red` (solid, outlined in dark mode), `solid-green`, `solid-red` (destructive confirms), `basic` (a thin outline, inverted in dark mode) and `basic-plain`; sizes `default`, `icon` and `compact-icon`. `TOGGLE_BUTTON` is the green active toggle (set `aria-pressed`); `MINI_BUTTON` the small size. `ref` is an ordinary prop, so it works as a Radix `asChild` trigger.
- `fab-button`: the tracker FAB's round buttons (`colour` blue, green, red, yellow, or `toggle`); `FAB_ICON` places the glyph.
- `dialog`: `DialogContent` (`size="small"` for confirms, `dismissible={false}` for dialogs with no `onClose`, `instant` to skip the exit animation), `DialogHeader` (a visible title; it is the dialog's title, as a div, since `DialogTitle` is an `<h2>` that `index.css` styles), `DialogTitle` (required by Radix; `className="sr-only"` when the design has no visible title), `DialogBody` (`scrolling` caps its height), `DialogFooter` and `DialogTrigger`. A sr-only `DialogTitle` is real text, so `text(page, …)` can match it before a button with the same words: don't title a dialog with one of its buttons' labels.
- `select`: a Radix Select taking `options` (`{ text, value, icon? }`), `value`, `onChange(value)`, `placeholder`, `aria-label` or `id` for a visible `<label htmlFor>`. Looks: `field` (default, a white field), `row` (the tracker's one-line field, with a `leading` slot before the text), `button` (a grey button whose text is the placeholder and `value` stays empty, for action menus), `text` (bold value and caret, no field), plus `inline` and `contrast`. Also `clearable`, `disabled`, `text` (fixed text in place of the value), `icon` (a glyph in place of the caret), `align="end"`, `scrolling`, `caret="font"` with `caretShift`, `menuClassName` (`SELECTION_MENU` for long lists), `menuOffset`, `menuShift`, `triggerClassName`. The menu is portalled and carries the test id plus `-options`, which the `options` helper reads; `contained` renders it inside a wrapper that carries `data-testid` instead (Rules' specs look for options inside the dropdown). With `contained`, `className` goes to the wrapper; a `look="button"` trigger next to other buttons takes `triggerClassName="w-auto"`. An open Select makes the rest of the page `inert`, except `[aria-live]` subtrees.
- `combobox`: a searchable select on cmdk and Radix Popover (ItemSelector, Builder's nature and ability), with `look="row"` for the tracker and editor fields. Its menu is portalled with the `-options` test id; its input keeps the `search` class the specs use. Selection is manual: only a click or Enter picks an option, and Escape, a click elsewhere or Tab close it keeping the value (pinned in `combobox.test.tsx`).
- `multi-select`: a multiple selection without search (labels in the field, a menu that stays open while picking). Values may be strings or numbers; the menu renders inside the element carrying `data-testid`.
- `dropdown-menu`: the tracker row's and Rules' ⋮ menus. Keep it non-modal (`modal={false}`): a modal one sets `pointer-events: none` on the page, so a second click on the trigger can't land.
- `tabs`: `variant="tabular"` (default, attached tabs on the secondary background), `"menu"`, `"secondary"` and `"segmented"`. The `tab` helper finds a list by variant (`tab(page, 'secondary', 2)`). To keep pane state across tabs, render one `TabsContent` with `value` set to the active tab. Don't pass Radix's `disabled` to a tab (Playwright would wait on it, and it leaves the arrow keys): set `aria-disabled` and ignore the change in `onValueChange` (Builder's Coverage tab).
- `popover`: `Popover`/`PopoverContent`/`PopoverTrigger` (a click bubble, inverted in dark mode) and `HoverPopover` (opens on hover after 50 ms, closes 70 ms after leaving, a click toggles; `inverted={false}` keeps it white in dark mode). Make a trigger a `<button>`, and pass it a ref: Radix can't position content from a trigger that drops its ref. `Calculator/elements/Help` wraps `HoverPopover` with `QuestionCircleIcon`. A `side="top"` popover may move onto what's above it when a layout changes; bound it with `collisionBoundary` (PokéStats' details).
- `badge`: a bold grey tag in the parent's font, with no margin at its parent's edges.
- `checkbox`: `Checkbox` and `CheckboxOption` (a box plus its `<label htmlFor>`; `data-testid` on the row, so `toggle` and a click on the row both work).
- `radio-group`: `RadioGroup` (it can wrap other content, as on Import), `RadioGroupItem` and `RadioGroupOption` (an item plus its label; `data-testid` on the wrapper).
- `switch`: Radix Switch, `look="toggle"` (default) or `"row"` (Settings' rows). The test id is on the switch itself; name it with `aria-labelledby`.
- `input`: a white field; `label` attaches a grey label as a real `<label>`, `fluid` stretches it, `inputClassName` styles the `<input>` itself. `data-testid` goes to the `<input>`, which the `field` helper finds.
- `sheet`: the app's menu, a non-modal Radix Dialog that isn't portalled. It leaves focus where it was, ignores Escape, and a click outside closes it and still reaches its target. `SheetGroup` and `SheetItem` (`current` sets `aria-current="page"`). It is `role="dialog"` and stays mounted for its 500ms slide-out, so `modalDialog` excludes it.
- Shared pieces outside `ui/`: `common/SelectorRow` (the Pokémon row of the selector dialogs), `components/Filter` (the search field, its corner help icon before the search icon, since the `helpIcon` helper takes the field's first svg, and the toggle filter button), `components/Natures`' `InfoButton`, `common/ItemSelector` (`look="row"`) and `components/MoveSelector` (`look="tile"`, the editor's move tiles). A restyle of a shared piece stays opt-in (a `look` prop), so other areas keep their pixels.

## The tracker's rows

- Row controls share the classes in `components/Tracker/elements/buttons.ts`: `ROW_CONTROL` (outlined, 32px), `ROW_ICON_CONTROL`, `ROW_GHOST` (borderless icon), `TALL` (40px on phones), and `TOOLBAR_BUTTON`/`TOOLBAR_DANGER` for Share, Add and Reset. Focus shows `outline-row-ring`, offset 2px.
- **Row menus portal.** react-window 2 positions rows with a transform, which makes each row the containing block of a menu's fixed popper: a menu rendered inside a row is painted under the next row, and Radix's `scrollIntoView` on open scrolls the list. Never use `contained` inside a row.
- **Truncated text clips descenders at `leading-none`.** `truncate` (or any `overflow` other than `visible`) cuts ink outside its box, and `leading-none` makes the line box smaller than its glyphs, so the tails of g, y and p go. The `row` look of `Select` sets `leading-[1.4]` on its truncated span; don't pass line heights to it. Any other element that truncates its own text does the same, on the element that clips. Dialogs set `leading-none` on everything inside, so a truncated caption in one takes `leading-[1.4]`. `tests/e2e/main/Descenders.spec.ts` enforces it on every page and its main menus and dialogs; add a state there when you add a menu or dialog it doesn't open. Its `ALLOWED` list is empty; an entry needs a reason.
- Each action keeps a fixed slot (an empty span when hidden), so the columns line up; change a slot's width in both the control and the empty span.
- The row heights live in `HEIGHTS` in `Encounters.tsx`; a control that makes a row taller needs its height there too.
- Rows are a stable `rowComponent` fed through `rowProps`. An inline render function would be a new component type on every render and remount every row, losing keyboard focus. So nothing relies on a remount: the editor's form mounts per opening (an opening counter as its key), Evolve resets on open, and the nickname field follows its prop.
- The list fills its flex parent, so it's 0px tall while the location list is open in its place. A row picked there is scrolled to once the list has its height back.
- The ⋮ menu is a non-modal `DropdownMenu`. A dialog opened from one of its items would refocus the item, which is gone, so those dialogs hand focus back to ⋮ (`focusBack`), but only if focus is still on the page by then (Radix calls it after the close animation). Rows are keyed by their place, so after Move up or Move down the menu's `onCloseAutoFocus` focuses the ⋮ one place up or down, found by its test id.
- An open Select makes the page `inert` except `[aria-live]` subtrees, so a live region inside the list would keep the list live. The level readout is an `<output>`, a polite live region without the attribute.

## The page nav

Pages are sized to `100dvh` less the header and the nav's row or tab bar (`--nav-top`, `--nav-bottom` on `main`; `--tab-bar` on the app). A page that overflows that box would paint over the tab bar, which comes first in the DOM, so the bar is `relative z-1` below 571px. No visual state shows the 571–1147px row; `tests/e2e/main/Navigation.spec.ts` pins all three forms, and e2e runs at 1000px.

## Checklist for a UI PR

1. List the files and their consumers (`node scripts/affected-areas.mjs <files>`).
2. Make the change; update helper bodies, not specs.
3. Run `npm run verify`. State goldens must not change for a UI-only change.
4. Run `npm run verify:visual`. Untouched areas must show zero diff. Review the touched diffs, update them with `--grep @<area> --update-snapshots` (`--update-snapshots=all` when the change adds accessible names), and log them in `verification/approved-diffs.tsv`.
