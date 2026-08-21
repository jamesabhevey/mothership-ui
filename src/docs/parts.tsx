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

/** Same, but re-reads after mount so the first paint has the stylesheet applied. */
export function useToken(name: string): string {
  const [value, setValue] = useState('')
  useEffect(() => setValue(readToken(name)), [name])
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
 *   h1                32px / 36px / 700
 *   section heading   24px / 32px / 700
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
 * Weight stays at 700 throughout. The scale sets heading/md at 600, but these
 * are page furniture rather than component type, and 700 keeps them level with
 * the h1 above. Dense token metadata below uses the caption tokens outright,
 * since it is data rather than prose.
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
          <h1 className="text-[32px]/9 font-bold tracking-[var(--text-display-sm--letter-spacing)] text-text-primary">
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
      <h2 className="text-[24px]/8 font-bold tracking-[var(--text-heading-md--letter-spacing)] text-text-primary">
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

export function Swatch({ figma, css }: { figma: string; css: string }) {
  return (
    <li className="flex items-center gap-3 rounded-md border border-border-subtle p-3">
      <span
        className="size-12 shrink-0 rounded-sm border border-border-subtle"
        style={{ background: `var(${css})` }}
        aria-hidden
      />
      <Meta figma={figma} css={css} />
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
export const storyHref = (id: string, view: 'story' | 'docs' = 'docs') =>
  `./?path=/${view}/${id}`

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
