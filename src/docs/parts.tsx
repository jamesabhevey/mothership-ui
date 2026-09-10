import { useEffect, useState, type ReactNode } from 'react'

/**
 * Read a custom property off :root.
 *
 * The Foundations pages resolve every value this way rather than restating it,
 * so they document what the tokens *are* right now. Change a token in
 * styles/index.css and these pages follow; they cannot drift.
 */
export function readToken(name: string): string {
  if (typeof document === 'undefined') return ''
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

/**
 * Same, but re-reads after mount so the first paint has the stylesheet applied,
 * and again whenever the colour mode changes.
 *
 * The mode is an attribute on <html>, and switching it does not necessarily
 * remount anything, so without watching for it these pages would go on
 * reporting the values they read when they first rendered. A page that claims
 * to read the tokens live has to actually do so.
 */
export function useToken(name: string): string {
  const [value, setValue] = useState('')
  useEffect(() => {
    const read = () => setValue(readToken(name))
    read()
    const observer = new MutationObserver(read)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [name])
  return value
}

/**
 * Both values of a colour token at once, whichever mode the page is in.
 *
 * Two throwaway probes, each pinned to a mode with the same data-theme
 * attribute the toolbar sets. Custom properties inherit, and tokens.css
 * declares light and dark blocks, so a probe marked light reports light values
 * even inside a dark page.
 *
 * Read out of the CSS rather than imported from tokens.json on purpose: it
 * keeps the promise the rest of these pages make, which is that they show what
 * the stylesheet actually says rather than a second copy of it.
 */
export function useTokenModes(name: string): { light: string; dark: string } {
  const [value, setValue] = useState({ light: '', dark: '' })
  useEffect(() => {
    const probe = (mode: 'light' | 'dark') => {
      const el = document.createElement('div')
      el.setAttribute('data-theme', mode)
      el.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden'
      document.body.appendChild(el)
      const read = getComputedStyle(el).getPropertyValue(name).trim()
      el.remove()
      return read
    }
    setValue({ light: probe('light'), dark: probe('dark') })
  }, [name])
  return value
}

/**
 * Layout and type to match the Component pages.
 *
 * These values are measured from a generated autodocs page rather than
 * guessed, so Foundations and Components read as one document:
 *
 *   wrapper padding   64px top and bottom, 40px left and right
 *   content width     max 960px, centred within the padding
 *   h1                32px / 36px / 600
 *   section heading   24px / 32px / 600
 *   body              14px / 24px / 400
 *
 * Three deliberate departures from those measurements. The content column is
 * 960px rather than the 1000px the docs pages use, and Storybook's own docs
 * container is narrowed to match in preview-head.html so the two still line up.
 *
 * The section heading is 24/32 rather than the 20/30 the docs pages use for a
 * story name, which is type/heading/md exactly. Storybook's own docs headings
 * are moved to match in preview-head.html, so a section heading is one size
 * wherever it appears and story names sit a step below it.
 *
 * The third is letter spacing, which Storybook's docs set to `normal`. Sizes on
 * our scale carry their own tracking, so the 32px heading takes display/sm's
 * -0.6px and the 24px section heading takes heading/md's -0.3px, read from the
 * tokens rather than restated so they follow any change to the scale.
 *
 * Weight is 600 throughout, matching the scale: heading/md is 600, and since
 * Display moved to SemiBold there is no weight above it to be level with.
 * Storybook's docs headings are moved to 600 in preview-head.html to match.
 * Dense token metadata below uses the caption tokens outright, since it is data
 * rather than prose.
 */
const shell = 'px-10 py-16'
const content = 'mx-auto w-full max-w-[960px]'

export function Page({
  title,
  intro,
  children,
}: {
  title: string
  intro?: ReactNode
  children: ReactNode
}) {
  return (
    <div className={shell}>
      <div className={`${content} flex flex-col gap-12`}>
        <header className="flex flex-col gap-4">
          <h1 className="text-[32px]/9 font-semibold tracking-[var(--text-display-sm--letter-spacing)] text-text-primary">
            {title}
          </h1>
          {intro ? <div className="max-w-[80ch] text-[14px]/6 text-text-primary">{intro}</div> : null}
        </header>
        {children}
      </div>
    </div>
  )
}

export function Group({ name, children }: { name: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-[24px]/8 font-semibold tracking-[var(--text-heading-md--letter-spacing)] text-text-primary">
        {name}
      </h2>
      {children}
    </section>
  )
}

/** Figma token name → CSS variable → resolved value, in a monospace column. */
export function Meta({ figma, css }: { figma: string; css: string }) {
  const value = useToken(css)
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className="text-label-md text-text-primary">{figma}</span>
      <span className="font-mono text-caption-md text-text-secondary">{css}</span>
      <span className="font-mono text-caption-md text-text-muted">{value || '—'}</span>
    </div>
  )
}

/**
 * One colour token: a chip in the mode currently being viewed, then the name,
 * the custom property, and both mode values side by side.
 *
 * Both are shown rather than only the active one because the question a
 * designer brings to this page is usually what a token does across modes, and
 * flipping the toolbar to find out loses the comparison. The chip still follows
 * the toolbar, so what you see and what is labelled agree.
 */
export function Swatch({ figma, css }: { figma: string; css: string }) {
  const modes = useTokenModes(css)
  return (
    <li className="flex items-center gap-3 rounded-md border border-border-subtle p-3">
      <span
        className="size-12 shrink-0 rounded-sm border border-border-subtle"
        style={{ background: `var(${css})` }}
        aria-hidden
      />
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-label-md text-text-primary">{figma}</span>
        <span className="font-mono text-caption-md text-text-secondary">{css}</span>
        <span className="flex flex-wrap gap-x-4 font-mono text-caption-md text-text-muted">
          <span>Light {modes.light || '—'}</span>
          <span>Dark {modes.dark || '—'}</span>
        </span>
      </div>
    </li>
  )
}

/**
 * Storybook derives a story id from a title by lower-casing and replacing runs
 * of non-alphanumerics with a dash. Deriving it rather than hardcoding means
 * renaming a title cannot leave a dead link behind.
 */
export const toStoryId = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

/**
 * A link to another page of this Storybook, from inside the preview iframe.
 *
 * Relative, deliberately. The built site is served from a subdirectory on
 * GitHub Pages, so a root-absolute `/?path=…` leaves the Storybook altogether
 * and 404s — it only appears to work when developing at the domain root.
 *
 * Pair with target="_top" so the click navigates the whole Storybook, sidebar
 * included, rather than replacing the canvas with a nested copy.
 */
export const storyHref = (id: string, view: 'story' | 'docs' = 'docs') => {
  // Carry the colour mode across. Storybook keeps it as a global in the query
  // string, and these links are full page loads, so a plain ?path= lands in
  // whatever mode the manager works out for itself. It does remember the last
  // choice, but that restore happens after the manager bundle has loaded and
  // depends on storage being writable; naming the mode in the link means the
  // page opens in it regardless, and a link someone copies out of here carries
  // the mode they were reading in.
  const mode = typeof document === 'undefined' ? null : document.documentElement.getAttribute('data-theme')
  return `./?path=/${view}/${id}${mode ? `&globals=theme:${mode}` : ''}`
}

/** A code sample. Wide lines scroll inside the block, never the page. */
export function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-md border border-border-subtle bg-bg-subtle p-4">
      <code className="whitespace-pre font-mono text-caption-lg text-text-primary">{children}</code>
    </pre>
  )
}

/** A body paragraph at the docs measure. */
export function P({ children }: { children: ReactNode }) {
  return <p className="max-w-[80ch] text-[14px]/6 text-text-primary">{children}</p>
}

/** One swatch per row, full width of the content column. */
export function SwatchGrid({ children }: { children: ReactNode }) {
  return <ul className="flex flex-col gap-2">{children}</ul>
}
