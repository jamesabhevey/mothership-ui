import type { Preview } from '@storybook/react-vite'
import { mothershipTheme } from './theme'

// Inter, in the four weights the type scale uses (400 body, 500 label/caption,
// 600 heading, 700 display). Without these the metrics are wrong even though
// the sizes are right.
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'

// The global stylesheet. This is the whole token layer — the Tailwind v4
// `@theme` block holding every colour, radius, shadow and type step read from
// the Figma variable collections, plus the `:root` spacing/sizing variables and
// the base layer that sets the page background and font family. Components are
// styled entirely from these tokens, so nothing renders correctly without it.
import '../src/styles/index.css'

const preview: Preview = {
  // Enabled globally rather than per-file, so every story file gets an
  // autodocs page from its meta and prop types without repeating the tag.
  tags: ['autodocs'],

  parameters: {
    // Autodocs pages render inside the preview iframe, so they need the theme
    // handed to them separately from the manager chrome.
    docs: {
      theme: mothershipTheme,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        // Foundations first — the tokens everything else is built from — then
        // the components. Within each group the order is set explicitly rather
        // than alphabetically, matching the Figma library's own ordering.
        order: [
          'Foundations',
          ['Colour', 'Typography', 'Spacing & Sizing', 'Radius, Border & Elevation'],
          'Assets',
          // Inside the Iconography folder: the component's API, then the set
          // of glyphs itself. Named apart so neither is just "Iconography".
          ['Iconography', ['Icon', 'Glyphs']],
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
