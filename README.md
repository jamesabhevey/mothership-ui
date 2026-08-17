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

`npm run storybook` serves on <http://localhost:6006>. Published on every push
to `main`: <https://jamesabhevey.github.io/mothership-ui/>

The sidebar has two roots:

- **Foundations** — Colour, Typography, Spacing & Sizing, Radius/Border/
  Elevation, and Iconography. Reference pages for the token layer.
- **Components** — Form Elements, Content Presentation, Navigation and Blocks,
  one page per component with a story per variant. Order within each group is
  set explicitly in `preview.ts`, matching the Figma library rather than falling
  back to alphabetical.

Foundations pages use the same layout and type as the generated Component docs
pages — 64px vertical and 40px horizontal padding, content capped at 1000px and
left aligned, `h1` at 32/36/700 — measured off a docs page rather than guessed,
so the two sections read as one document. Those are Storybook's docs
typography, not Mothership type tokens; the nearest tokens are `type/heading/lg`
(28/36) and `type/body/sm` (14/20).

Foundations pages **resolve their values live** from the CSS custom properties
via `getComputedStyle` rather than restating them ([src/foundations/parts.tsx](src/foundations/parts.tsx)).
Change a token in `styles/index.css` and those pages follow — they document
what the tokens are right now and cannot drift out of date.

Stories live beside the component they document (`Button.tsx` /
`Button.stories.tsx`) in CSF3 format. Autodocs is enabled globally by
`tags: ['autodocs']` in [.storybook/preview.ts](.storybook/preview.ts) rather
than per file, so every component gets a docs page without repeating the tag.
Those pages are generated from the component's own doc comment and prop types —
the guidance carried over from the Figma descriptions is the documentation.
Foundations pages opt out with `tags: ['!autodocs']`, since the page is the doc.

### Theming Storybook itself

Storybook's own chrome uses the library's tokens: brand purple for selection
and controls, the grey ramp for surfaces and text, Inter throughout.

The manager is a separate React app from the preview iframe, so it cannot read
the `@theme` block — [.storybook/theme.ts](.storybook/theme.ts) hands the same
values over as literals, annotated with the token each one comes from. That
theme is applied in two places: `manager.ts` for the chrome, and
`parameters.docs.theme` in `preview.ts` for the autodocs pages, which render
inside the preview iframe.

Inter is loaded twice for the same reason — through `@fontsource` imports in
`preview.ts` for stories, and via `@font-face` in
[.storybook/manager-head.html](.storybook/manager-head.html) for the chrome.
The four weights live in `public/fonts` (96KB) rather than mapping the whole
`@fontsource` package (4.4MB across 252 files), and are referenced relatively
so the built site works under the `/mothership-ui/` path Pages serves it from.

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

Grouped as the Figma library groups them:

| Group | Components |
| --- | --- |
| Form Elements | `Button`, `IconButton`, `FieldLabel`, `FieldHelperText`, `TextField`, `Checkbox`, `Select`, `Radio`, `Switch` |
| Content Presentation | `Badge`, `Avatar`, `Card`, `ListItem`, `Banner`, `Tooltip`, `Modal`, `Divider`, `Spinner`, `Icon` |
| Navigation | `Tabs`, `Tab`, `AppBar`, `Menu`, `MenuItem` |
| Blocks | `PageHeader`, `FormSection`, `SettingsRowGroup`, `EmptyState`, `CardGrid`, `NavShell` |

`FieldLabel` and `FieldHelperText` sit under a **Field Text** folder, and `Tab`
and `MenuItem` under their parent, mirroring the Figma pages that hold them.
**Blocks** covers the composed components — the ones built out of the others —
and takes its name from the Figma page of the same name.

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
