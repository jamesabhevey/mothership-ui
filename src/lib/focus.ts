/**
 * The focus ring.
 *
 * Focus is not a variant in the Figma component sets, but the library keeps
 * the focus/ring effect style and the color/focus/ring token precisely so it
 * can be applied in code. Keyboard focus has to be visible, so every
 * interactive component uses this.
 */
export const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring'
