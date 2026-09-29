import { defineConfig } from 'vitest/config'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import tailwindcss from '@tailwindcss/vite'

/**
 * Runs axe over every story, in both colour modes.
 *
 * There are no hand-written test files. Every component already has a story per
 * variant and per state, so the stories are the test corpus — a new component
 * with stories is covered the moment it is written, and nobody has to remember
 * to add a test.
 *
 * Two projects rather than one. Contrast is the failure this catches most
 * often, and contrast is exactly the thing that differs between light and dark:
 * a pairing that passes on white can fail on near-black and vice versa. Running
 * one mode would check half the library. `initialGlobals` pins the toolbar
 * global the preview decorator reads, so each project renders every story with
 * `data-theme` set to its own mode.
 *
 * Note there is deliberately no `.storybook/vitest.setup.ts`. Since Storybook
 * 10.3 the addon wires the preview *and* addon annotations itself — but it
 * backs off silently if it finds a setup file in the config directory calling
 * `setProjectAnnotations`, on the assumption you are doing it by hand. Older
 * guides still tell you to write that file with the preview annotations only,
 * which drops the addon annotations, and axe's `afterEach` is one of them. The
 * suite then passes having checked nothing. Leaving the file out is what keeps
 * the checks wired.
 */

/**
 * A fresh object per project. Vitest resolves browser instances in place, so a
 * shared config object gets mutated by the first project and the second one
 * inherits its name.
 */
const browser = (theme: 'light' | 'dark') => ({
  enabled: true,
  headless: true,
  provider: playwright(),
  instances: [{ browser: 'chromium' as const, name: `a11y:${theme}` }],
})

const project = async (theme: 'light' | 'dark') => ({
  // Tailwind explicitly. The Vitest projects build their own Vite config and
  // do not pick up the root vite.config.ts, so without this the token
  // stylesheet is handed to plain PostCSS, which cannot read `@source` or
  // `@theme` and silently produces nothing. Every story then renders unstyled,
  // and axe's colour-contrast rule — the main reason for running both modes —
  // has no colours to check while the suite still reports a pass.
  plugins: [
    tailwindcss(),
    await storybookTest({ configDir: '.storybook', initialGlobals: { theme } }),
  ],
  test: { browser: browser(theme) },
})

export default defineConfig({
  test: {
    projects: [await project('light'), await project('dark')],
  },
})
