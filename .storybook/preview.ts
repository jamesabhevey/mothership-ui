import { createElement } from 'react'
import type { Preview } from '@storybook/react-vite'
import { mothershipTheme } from './theme'
import { applyTheme, themeOf } from './apply-theme'

// Inter, in the three weights the type scale uses (400 body, 500 label and
// caption, 600 display and heading). Without these the metrics are wrong even
// though the sizes are right. There is no 700: Display moved to SemiBold, which
// was the only thing that used Bold.
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'

// The global stylesheet. This is the whole token layer, the Tailwind v4
// `@theme` block holding every colour, radius, shadow and type step read from
// the Figma variable collections, plus the `:root` spacing/sizing variables and
// the base layer that sets the page background and font family. Components are
// styled entirely from these tokens, so nothing renders correctly without it.
import '../src/styles/index.css'

const preview: Preview = {
  // Enabled globally rather than per-file, so every story file gets an
  // autodocs page from its meta and prop types without repeating the tag.
  tags: ['autodocs'],

  // Light / Dark, in the toolbar above the canvas.
  //
  // Colour is the only Figma collection with modes, and every colour token
  // carries both values, so switching is a single attribute on <html>: the
  // custom properties are redeclared under [data-theme='dark'] and every
  // Tailwind colour utility, which compiles to var(--color-…), follows.
  //
  // Nothing in the components knows about this. There is not one `dark:`
  // variant in the library, a component asks for surface/default and gets
  // whichever value the current mode defines.
  globalTypes: {
    theme: {
      description: 'Colour mode',
      toolbar: {
        title: 'Theme',
        icon: 'contrast',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: { theme: 'light' },

  decorators: [
    (Story, context) => {
      // Set on the iframe's root element rather than a wrapper, so the page
      // background, the docs chrome and anything portalled to <body>, modals,
      // tooltips, menus, are all inside the same mode.
      //
      // Always set, never removed. tokens.css declares a light block as well as
      // a dark one, so an explicit value means a subtree can be pinned to the
      // other mode, which is how the Colour page shows both values at once.
      //
      // This runs on every render, so applyTheme returns early when the mode
      // has not actually changed, otherwise every story render would flash the
      // switching transition on.
      applyTheme(document.documentElement, themeOf(context.globals))
      // createElement rather than Story(): calling it would run the story
      // function here, in the decorator, and a story whose render is a
      // component using hooks would then call them outside a React render.
      // Storybook's own renderer happens to run decorators inside one, so this
      // works in the browser either way; the Vitest run composes stories
      // differently and it does not. As an element it is a component in both.
      return createElement(Story)
    },
  ],

  parameters: {
    // Autodocs pages render inside the preview iframe, so they need the theme
    // handed to them separately from the manager chrome.
    docs: {
      theme: mothershipTheme,
    },

    // axe, over every story, in the a11y panel and in `npm test`.
    //
    // `test: 'error'` is the whole point of this block. The addon ships with
    // 'todo', which records violations as warnings and lets the run pass, a
    // reasonable default for a library retrofitting accessibility, and exactly
    // wrong for one that has already done the work. Left at 'todo' the suite
    // reports a clean 224 passes while quietly holding a list of failures.
    //
    // Restricted to the WCAG A and AA rule tags, which is the bar this library
    // actually claims. axe's remaining rules are best practice rather than
    // conformance; mixing them in means a failing build cannot be read as
    // "this does not meet AA", which is the one thing it needs to mean.
    a11y: {
      test: 'error',
      options: {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        // Foundations first, the tokens everything else is built from, then
        // the components. Within each group the order is set explicitly rather
        // than alphabetically, matching the Figma library's own ordering.
        order: [
          // The flat entries first, then the reference sections. Each is a
          // single-story file with autodocs off, which is what makes them
          // render as plain links rather than collapsible groups.
          'Welcome',
          'Get started',
          'Catalog',
          'Changelog',
          'Skills',
          'Foundations',
          ['Colour', 'Typography', 'Spacing & Sizing', 'Radius, Border & Elevation', 'Motion'],
          'Assets',
          // Inside the Iconography folder: the component's API, then the set
          // of glyphs itself. Named apart so neither is just "Iconography".
          ['Iconography', ['Icon', 'Glyphs'], 'Illustration'],
          'Components',
          [
            'Form Elements',
            [
              'Button',
              'Icon Button',
              // The Figma "Field Text" page holds both, label before helper.
              'Field Text',
              ['Field Label', 'Field Helper Text'],
              'Text Field',
              'Checkbox',
              'Select',
              'Radio',
              'Switch',
            ],
            'Content Presentation',
            ['Badge', 'Avatar', 'Card', 'List Item', 'Banner', 'Tooltip', 'Modal', 'Divider', 'Spinner'],
            'Navigation',
            [
              // Container first, then the item it holds.
              'Tabs',
              ['Tabs', 'Tab'],
              'App Bar',
              'Menu',
              ['Menu', 'Menu Item'],
            ],
            'Blocks',
            ['Page Header', 'Form Section', 'Settings Row Group', 'Empty State', 'Card Grid', 'Nav Shell'],
          ],
        ],
      },
    },
  },
}

export default preview
