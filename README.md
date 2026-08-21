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

The sidebar opens with three flat pages, then three sections.

- **Welcome** — what the system is, where to go next, and what it is opinionated
  about.
- **Get started** — how to install it, the font setup, and the conventions that
  catch people out.
- **Catalog** — every component with a live preview, searchable, each linking to
  its page.

All three are single-story files with autodocs off, which is what makes them
render as plain links rather than collapsible groups.

Links between pages go through `storyHref` in [src/docs/parts.tsx](src/docs/parts.tsx),
which builds a **relative** URL. A root-absolute `/?path=…` appears to work in
development at the domain root and 404s on the deployed site, which is served
from a subdirectory.

The three sections:

- **Foundations** — Colour, Typography, Spacing & Sizing, and Radius, Border &
  Elevation. Reference pages for the token layer.
- **Assets** — Iconography, holding `Icon` (the component and its controls) and
  Glyphs (the full set). Named apart so neither page is just "Iconography".
- **Components** — Form Elements, Content Presentation, Navigation and Blocks,
  one page per component with a story per variant. Order within each group is
  set explicitly in `preview.ts`, matching the Figma library rather than falling
  back to alphabetical.

The sidebar brand is the logo mark plus the title at 18px, 12px apart, styled in
[.storybook/manager-head.html](.storybook/manager-head.html). The mark is a
`background-image` rather than an `<img>`, so a missing file leaves the title
readable instead of showing a broken-image icon. It declares two layers —
`mothership-logo.svg` then `mothership-logo.png` — so whichever of the two sits
in `public/` is the one that paints. The same file is the browser tab icon.

Storybook's own controls use neutral hover and pressed colours rather than its
defaults, which are the brand at 14% opacity for hover and a hardcoded `#dbecff`
for pressed. Both are replaced with `color/border/subtle` and
`color/border/default`, one step apart, so the section collapse buttons, the
settings cog, the toolbar icons, Show code, Copy code and the args-table
controls all behave the same. The manager rules live in `manager-head.html`; the
docs pages render in the preview iframe, which the manager theme cannot reach,
so [.storybook/preview-head.html](.storybook/preview-head.html) covers those
separately. Both are scoped tightly enough to leave the library's own
components alone: on a Button docs page the rules match 29 chrome controls and
none of the 13 Buttons.

Foundations and Assets pages use the same layout and type as the generated
Component docs pages — 64px vertical and 40px horizontal padding, content capped
at 1000px and centred, `h1` at 32/36/700 — measured off a docs page rather than
guessed, so every section reads as one document. Those are Storybook's docs
typography, not Mothership type tokens; the nearest tokens are `type/heading/lg`
(28/36) and `type/body/sm` (14/20).

These pages **resolve their values live** from the CSS custom properties
via `getComputedStyle` rather than restating them ([src/docs/parts.tsx](src/docs/parts.tsx)).
Change a token and those pages follow — they document
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
`src/styles/index.css`, which pulls in the generated token layer. Without that
import components render unstyled. Storybook reuses the project's
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
| Content Presentation | `Badge`, `Avatar`, `Card`, `ListItem`, `Banner`, `Tooltip`, `Modal`, `Divider`, `Spinner` |
| Navigation | `Tabs`, `Tab`, `AppBar`, `Menu`, `MenuItem` |
| Blocks | `PageHeader`, `FormSection`, `SettingsRowGroup`, `EmptyState`, `CardGrid`, `NavShell` |

`Icon` sits under the top-level **Assets** root alongside Iconography, not under
Components.

`FieldLabel` and `FieldHelperText` sit under a **Field Text** folder, and `Tab`
and `MenuItem` under their parent, mirroring the Figma pages that hold them.
**Blocks** covers the composed components — the ones built out of the others —
and takes its name from the Figma page of the same name.

`src/App.tsx` renders all of them, which doubles as the visual reference.

## Tokens

The token layer lives in `tokens/tokens.json` and is generated into
`src/styles/tokens.css` as a Tailwind v4 `@theme` block. The Figma variable name
maps straight onto the CSS custom property:

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

To retheme, change the values in `tokens/tokens.json` and run `npm run tokens`.
Nothing in the library hard-codes a hex.

## Keeping in sync with Figma

### Design tokens

`tokens/tokens.json` is the source of truth. Its keys are the Figma variable
paths, so `action/primary/default` in the colour section is Figma's
`color/action/primary/default`.

```bash
npm run tokens        # regenerate src/styles/tokens.css from tokens.json
npm run tokens:sync   # read Figma, report drift (needs credentials, see below)
```

`src/styles/tokens.css` is generated. Never edit it by hand — change
`tokens.json` and regenerate. When this was introduced the compiled CSS was
checked byte for byte against the previous hand-written stylesheet: identical,
so the change carried no visual risk.

There are two mechanisms, because Figma's plan tiers force the issue.

### Drift check — active, runs weekly

[.github/workflows/token-drift.yml](.github/workflows/token-drift.yml) runs every
Monday and on demand. It reads the ordinary file endpoint, which works on any
Figma plan, and compares the colours the components actually paint against
`tokens.json`. On a change it updates the token, regenerates the stylesheet,
type-checks, builds and opens a pull request. Nothing lands unreviewed.

`tokens/figma-probes.json` records where each colour is observable, as
`nodeId#property`. It is generated, not hand-written — run the workflow in
**calibrate** mode and commit the result. Do that again after restructuring the
Figma file, since probes are tied to node IDs.

Current coverage: 25 probes over 52 of the 53 colour tokens. 13 map to a single
token and apply automatically. The rest are groups — seven tokens are `#ffffff`,
so a change there cannot be attributed to one of them, and the check reports the
group and asks rather than guessing. `color/shadow/default` is invisible to this
method, being a shadow rather than a fill.

**Colours only, deliberately.** An earlier version probed numbers too and
produced nonsense: it paired `radius/sm` with a 4px auto-layout gap and
`size/control/min-target` with an unrelated 44px gap, because small integers
recur everywhere. Either would have raised a false alarm the moment a gap
changed. Hex values are distinctive enough for the technique to hold; numbers
are not.

The workflow also has a **diagnose** mode, which prints HTTP status codes and
secret lengths — never values — for when credentials misbehave.

### Variables sync — dormant, needs Enterprise

[.github/workflows/token-sync.yml](.github/workflows/token-sync.yml) reads the
variables REST API, which returns the variable definitions rather than inferring
values from usage. That is the better source: it would cover spacing, sizing and
typography as well as colour, with no probes and no ambiguity.

It is limited to Enterprise plans and this organisation is on Org, so the
endpoint returns 403. Confirmed by running it against a valid token: the file
endpoints return 200 while `/variables/local` returns 403. The schedule is
commented out so it does not collect a weekly failure; uncomment it if the plan
ever changes, and everything else is already in place.

One caveat that applies to that path too: typography variables are reported
rather than written, because Figma stores size, line height and tracking
separately while the code pairs them into one step — not a one-to-one mapping,
so it stays a human decision.

### Code Connect

All 29 components and all 26 icons are mapped, so inspecting a component in
Figma's Dev Mode shows the real code component and links to its source.
[code-connect/mappings.json](code-connect/mappings.json) records what is mapped
to what; the live mapping lives in Figma. Mapping a component set propagates to
every variant underneath it automatically.

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
