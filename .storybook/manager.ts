import { addons } from 'storybook/manager-api'
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events'
import { mothershipTheme } from './theme'

addons.setConfig({
  theme: mothershipTheme,
  sidebar: {
    // Foundations and Components are the two roots; showing them expanded by
    // default makes the shape of the library obvious on first load.
    showRoots: true,
  },
})

/**
 * Carry the Light / Dark choice from the toolbar into Storybook's own chrome.
 *
 * The toolbar sets a global, which lives in the preview. The manager — sidebar,
 * toolbar, the frame around everything — is a separate React app with its own
 * document, and the theme above is handed over once at startup, so it cannot
 * follow a global on its own.
 *
 * This listens on the channel the two already talk over and mirrors the choice
 * onto the manager's <html> as the same data-theme attribute the preview uses.
 * public/manager-tokens.css defines the colour tokens for both modes, and
 * manager-head.html paints the chrome from them, so the sidebar changes with
 * the canvas rather than staying light around a dark page.
 *
 * Both events matter: SET_GLOBALS fires once on load, which is what makes a
 * reload or a shared ?globals=theme:dark URL come up in the right mode, and
 * GLOBALS_UPDATED fires on every change after that.
 */
addons.register('mothership/theme-sync', (api) => {
  const apply = ({ globals }: { globals?: Record<string, unknown> } = {}) => {
    const theme = globals?.theme === 'dark' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme)
  }

  // Light until told otherwise, so the chrome is never unpainted.
  apply()

  api.on(SET_GLOBALS, apply)
  api.on(GLOBALS_UPDATED, apply)
})
