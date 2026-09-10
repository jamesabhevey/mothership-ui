import { addons } from 'storybook/manager-api'
import { GLOBALS_UPDATED, SET_GLOBALS, UPDATE_GLOBALS } from 'storybook/internal/core-events'
import { mothershipTheme } from './theme'
import { applyTheme, themeOf } from './apply-theme'

addons.setConfig({
  theme: mothershipTheme,
  sidebar: {
    // Foundations and Components are the two roots; showing them expanded by
    // default makes the shape of the library obvious on first load.
    showRoots: true,
  },
})

/** Where the choice is kept between visits. */
const STORE = 'mothership-ui:theme'

const read = (): 'light' | 'dark' | null => {
  try {
    const value = localStorage.getItem(STORE)
    return value === 'dark' || value === 'light' ? value : null
  } catch {
    // Private windows and blocked site data. Not remembering is fine; throwing
    // on the way in is not.
    return null
  }
}

const write = (theme: 'light' | 'dark') => {
  try {
    localStorage.setItem(STORE, theme)
  } catch {
    /* see above */
  }
}

/**
 * The preview's document, when it is there and reachable.
 *
 * Same origin, so the manager can set the mode on it directly. This is the
 * whole point: left to itself the preview only learns about a change when the
 * message reaches it and React re-renders the story, which is a postMessage hop
 * and a render later than the chrome. At a 120ms fade that reads as the sidebar
 * and toolbar changing first and the canvas catching up — two transitions
 * instead of one. Setting both in the same task starts them in the same frame.
 *
 * The decorator in preview.ts still applies it too. That covers the first
 * render, a reload, and the case where this returns null because the iframe is
 * between documents; applyTheme is a no-op when the mode is already right, so
 * whichever arrives second changes nothing and cannot start a second fade.
 */
const previewRoot = (): HTMLElement | null => {
  try {
    const frame = document.querySelector<HTMLIFrameElement>('#storybook-preview-iframe')
    return frame?.contentDocument?.documentElement ?? null
  } catch {
    // Nothing should make this cross-origin, but a null here only costs the
    // synchronisation, and the decorator still applies the mode.
    return null
  }
}

/**
 * Does the address bar name a mode? Storybook encodes globals as
 * `globals=theme:dark`, possibly alongside others.
 *
 * This matters for precedence: a link somebody sent, with a mode in it, should
 * open in that mode rather than in whatever mode the person opening it last
 * used.
 */
const urlDeclaresTheme = /[?&]globals=[^&]*\btheme:/.test(window.location.search)

/**
 * Carry the Light / Dark choice from the toolbar into Storybook's own chrome,
 * and keep it across navigation.
 *
 * The toolbar sets a global, which lives in the preview. The manager — sidebar,
 * toolbar, the frame around everything — is a separate React app with its own
 * document, and the theme above is handed over once at startup, so it cannot
 * follow a global on its own.
 *
 * Storybook keeps globals in the URL, which means the mode survives a toolbar
 * click but not a link. Every link on the Catalog and Welcome pages is a plain
 * `?path=…`, so following one used to drop the reader back into light halfway
 * through a dark session. The choice is now also written down, and restored on
 * load when the URL does not name one — so it holds across links, reloads, and
 * coming back tomorrow.
 */
addons.register('mothership/theme-sync', (api) => {
  const root = document.documentElement
  const remembered = read()

  // Paint before the preview has said anything, so a remembered dark session
  // does not open on a white flash.
  if (!urlDeclaresTheme && remembered) root.setAttribute('data-theme', remembered)
  else root.setAttribute('data-theme', 'light')

  // Fires once on load with the globals Storybook resolved, which is where a
  // mode named in the URL arrives.
  api.on(SET_GLOBALS, (payload: { globals?: Record<string, unknown> }) => {
    const fromStorybook = themeOf(payload?.globals)
    applyTheme(root, fromStorybook)
    const preview = previewRoot()
    if (preview) applyTheme(preview, fromStorybook)

    // Nothing in the URL, but something remembered, and they disagree: tell
    // Storybook about the remembered one. That updates the preview and the
    // toolbar with it, so all three agree rather than the chrome alone.
    if (!urlDeclaresTheme && remembered && remembered !== fromStorybook) {
      api.emit(UPDATE_GLOBALS, { globals: { theme: remembered } })
    }
  })

  // Fires on every change after that — the toolbar, or the line above.
  api.on(GLOBALS_UPDATED, (payload: { globals?: Record<string, unknown> }) => {
    const theme = themeOf(payload?.globals)
    // Both documents, one task, so the two fades run as one.
    applyTheme(root, theme)
    const preview = previewRoot()
    if (preview) applyTheme(preview, theme)
    write(theme)
  })
})
