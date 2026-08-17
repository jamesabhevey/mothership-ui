# Mothership UI — React

React implementation of the Mothership UI Figma library.

Every colour, space, radius, border width and type step is read from the Figma
variable collections (Semantic / Dimension / Typography) rather than eyeballed,
and the component APIs follow the property names on the Figma component sets.

```bash
npm install
npm run storybook   # component explorer, one page per component
npm run dev         # showcase page with every component and variant
npm run build
```

## Storybook

`npm run storybook` serves on <http://localhost:6006>. 30 story files, 95
stories, one autodocs page per component.

Stories live beside the component they document (`Button.tsx` /
`Button.stories.tsx`) in CSF3 format. Autodocs is enabled globally by
`tags: ['autodocs']` in [.storybook/preview.ts](.storybook/preview.ts) rather
than per file, so every component gets a docs page without repeating the tag.
Those pages are generated from the component's own doc comment and prop types —
the guidance carried over from the Figma descriptions is the documentation.

`preview.ts` imports Inter in the four weights the type scale uses, then
`src/styles/index.css`. That stylesheet is the whole token layer, so without
that import components render unstyled. Storybook reuses the project's
`vite.config.ts`, so the Tailwind v4 plugin that compiles the `@theme` block
runs in the Storybook pipeline too — there is no second Tailwind config to keep
in sync.

Story coverage mirrors the showcase page: one story per variant shown there.
Where the showcase only exercises a single variant (AppBar, PageHeader,
NavShell, CardGrid, EmptyState, FormSection, SettingsRowGroup, Menu, Modal),
the story file has one story. `npm run build-storybook` outputs a static site to
`storybook-static/`.

## What's here

| Group | Components |
| --- | --- |
| Primitives | `Button`, `IconButton`, `Badge`, `Avatar`, `Spinner`, `Divider`, `Tooltip`, `Icon` |
| Forms | `TextField`, `Select`, `Checkbox`, `Radio`, `Switch`, `FieldLabel`, `FieldHelperText`, `FormSection` |
| Collections and surfaces | `Card`, `CardGrid`, `ListItem`, `Menu`, `MenuItem`, `SettingsRowGroup`, `Banner`, `Modal`, `EmptyState` |
| Navigation and layout | `Tabs`, `Tab`, `AppBar`, `PageHeader`, `NavShell` |

`src/App.tsx` renders all of them, which doubles as the visual reference.

## Tokens

`src/styles/index.css` holds the whole token layer in a Tailwind v4 `@theme`
block. The Figma variable name maps straight onto the CSS custom property:

| Figma | CSS | Tailwind |
| --- | --- | --- |
| `color/action/primary/default` | `--color-action-primary-default` | `bg-action-primary-default` |
| `color/text/secondary` | `--color-text-secondary` | `text-text-secondary` |
| `radius/md` | `--radius-md` | `rounded-md` |
| `type/label/md` | `--text-label-md` | `text-label-md` |
| `elevation/md` | `--shadow-elevation-md` | `shadow-elevation-md` |

Spacing is the one deliberate exception. Figma's `space/N` tokens are
pixel-named and every step already lands on Tailwind's 4px grid, so components
use stock utilities — `p-4` *is* `space/16` — and the raw `--space-*` variables
are published in `:root` for anyone cross-checking against the file or
consuming the tokens outside Tailwind.

To retheme, change the values in the `@theme` block. Nothing hard-codes a hex.

## Where the code departs from the Figma file, and why

Figma models everything as variants. Some of those axes are states the browser
already owns, and reproducing them as props would produce components nobody can
actually use. The mapping:

- **Hover and pressed are CSS states, not props.** The `State` axis on Button,
  IconButton, ListItem, Tab, MenuItem, Checkbox, Radio and Switch maps to
  `:hover`, `:active` and `:disabled`. `loading`, `disabled` and `selected`
  remain props, because those are application state.
- **Focus is implemented.** Focus is not a variant in the file, but the
  `focus/ring` effect style and the `color/focus/ring` token are still there —
  the description notes they were kept so it can be reintroduced. Keyboard
  focus has to be visible, so every interactive component uses it
  (`src/lib/focus.ts`).
- **Select uses a native `<select>`.** The Figma `Active` variant draws the open
  list as a Menu instance. In code that is the browser's own popup, which keeps
  keyboard and screen-reader behaviour correct on every platform. `Menu` and
  `MenuItem` are exported separately for custom, non-native pickers.
- **Icons come from `lucide-react`.** The Figma Icon set is Lucide drawn on a
  24px grid with a 2px round stroke, so this is the same artwork from its
  source rather than re-exported SVG. Sizes stay on the 16/20/24/32 scale, and
  colour inherits `currentColor` so the parent slot controls it. Enumerate the
  set with the exported `iconNames` array, never `Object.keys(icons)` — build
  tooling that walks the module appends its own keys to exported objects, and
  Storybook's docgen does exactly that.
- **Fixed widths are dropped.** Figma instances carry a width (Card 320, Banner
  480, TextField 358, ListItem 400). Components are fluid and fill their
  container; `CardGrid` reflows on `minCardWidth`.
- **Tooltip arrows are centred** on the trigger, where Figma gives each
  placement its own arrow geometry pinned near the bubble's leading edge.
- **`display/md` and `display/sm` are missing.** Their tracking variables exist
  in the Typography collection, but no readable node binds their size, so they
  are left out rather than invented. `display/lg` is measured from the cover
  frame. Add them when the values are to hand.

## Accessibility carried over from the file

The component descriptions in Figma carry real accessibility constraints, and
the code enforces the ones it can:

- `IconButton` requires `label`; it becomes the accessible name.
- `Checkbox`, `Radio` and `Switch` put the label inside the control and pad the
  row to the 44px minimum touch target — the boxes themselves are 20px and 24px.
- `ListItem` is 48px minimum and marks the selected row with `aria-current`, so
  selection does not rely on background colour alone.
- `FieldHelperText` pairs its error message with an alert glyph, so an error is
  never colour alone, and `TextField`/`Select` wire it up with
  `aria-describedby` and `aria-invalid`.
- `Banner` is a live region, and `danger` uses `role="alert"`.
- `Modal` moves focus into the dialog, traps Tab inside it, restores focus to
  the trigger on close, and closes on Escape.
- `Spinner` renders visually-hidden text, because a spinner alone tells a
  screen-reader user nothing.
- Sizes below the touch target are flagged in each component's doc comment
  (`Button` `sm`, `IconButton` `sm`/`md`, `TextField` `sm`).

## Not built

`Booking / 1–4` on the Examples page are composed screens rather than library
components, so they are not included. `src/App.tsx` composes a similar screen
from `NavShell`, `AppBar`, `ListItem` and `Button` to show the pieces fit.
