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

/**
 * How long the fade runs, taken from the stylesheet rather than repeated here.
 *
 * The CSS declares --theme-switch; this only needs to know when the fade is
 * over so it can take the flag back off. Reading it means the two cannot drift
 * apart — a number smaller here than there would cut the fade off part-way,
 * which looks like a bug in the fade rather than in the timing.
 *
 * The small margin on top is so the flag outlives the last frame rather than
 * landing on it.
 */
const durationOf = (root: HTMLElement) => {
  const view = root.ownerDocument.defaultView ?? window
  const declared = view.getComputedStyle(root).getPropertyValue('--theme-switch').trim()
  const ms = /^([\d.]+)(ms|s)$/.exec(declared)
  if (!ms) return 160
  return (ms[2] === 's' ? +ms[1] * 1000 : +ms[1]) + 40
}

/**
 * Per document, not one shared handle. The manager applies the mode to its own
 * document and to the preview's in the same breath, and a single timer would be
 * overwritten by the second call — leaving the first document's flag on, and
 * with it a transition on every element for the rest of the session.
 */
const clearing = new WeakMap<HTMLElement, ReturnType<typeof setTimeout>>()

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

    clearTimeout(clearing.get(root))
    clearing.set(
      root,
      setTimeout(() => root.removeAttribute(FLAG), durationOf(root)),
    )
  }

  root.setAttribute('data-theme', theme)
}

/** Whatever a globals payload says, narrowed to a mode. */
export const themeOf = (globals?: Record<string, unknown>): 'light' | 'dark' =>
  globals?.theme === 'dark' ? 'dark' : 'light'
