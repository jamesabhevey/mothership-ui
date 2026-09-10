/**
 * Put a colour mode on a document, and animate the change.
 *
 * Shared by the preview and the manager, which are separate bundles running in
 * separate documents but have to agree on both the attribute and the timing —
 * otherwise the canvas and the chrome cross-fade at different speeds and the
 * switch looks broken rather than smooth.
 *
 * The transition itself lives in CSS, gated on `data-theme-switching`, and is
 * only present for the length of the change. A permanent transition on every
 * element would also catch every hover, and would leave the browser watching
 * thousands of nodes on pages like Glyphs and Catalog for a change that happens
 * once in a while.
 */
const FLAG = 'data-theme-switching'
const DURATION = 240

let clear: ReturnType<typeof setTimeout> | undefined

export function applyTheme(root: HTMLElement, theme: 'light' | 'dark') {
  const current = root.getAttribute('data-theme')
  if (current === theme) return

  // Only animate a change, never the first paint: there is nothing to move from
  // on the way in, and a page that fades up on load reads as a slow page.
  if (current) {
    root.setAttribute(FLAG, '')
    // Force a style resolution so the transition is in effect *before* the
    // colours change. Without this the browser sees both in one recalculation,
    // finds no transition on the before-change style, and jumps.
    void root.offsetWidth

    clearTimeout(clear)
    clear = setTimeout(() => root.removeAttribute(FLAG), DURATION)
  }

  root.setAttribute('data-theme', theme)
}

/** Whatever a globals payload says, narrowed to a mode. */
export const themeOf = (globals?: Record<string, unknown>): 'light' | 'dark' =>
  globals?.theme === 'dark' ? 'dark' : 'light'
