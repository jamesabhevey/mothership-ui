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
    <div className="flex max-w-4xl flex-col gap-10 p-2">
      <header className="flex flex-col gap-2">
        <h1 className="text-heading-lg text-text-primary">{title}</h1>
        {intro ? <p className="max-w-prose text-body-md text-text-secondary">{intro}</p> : null}
      </header>
      {children}
    </div>
  )
}

export function Group({ name, children }: { name: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-heading-sm text-text-primary">{name}</h2>
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

export function SwatchGrid({ children }: { children: ReactNode }) {
  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3">{children}</ul>
  )
}
