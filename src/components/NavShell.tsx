import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../lib/cn'

export type NavShellProps = HTMLAttributes<HTMLDivElement> & {
  /** An AppBar. Stays fixed while the content scrolls beneath it. */
  appBar?: ReactNode
  children: ReactNode
  /**
   * Constrain to the 390x844 iPhone reference frame the Figma component uses.
   * Off by default so the shell fills whatever viewport it is given.
   */
  device?: boolean
}

/**
 * The outer frame of a mobile screen: a fixed app bar with a scrolling
 * content region beneath it.
 *
 * Use when starting any new mobile screen, so every screen shares the same
 * chrome and the same content bounds. Desktop layouts need a different shell;
 * modal content sits above the shell rather than inside it.
 */
export function NavShell({ className, appBar, children, device = false, ...props }: NavShellProps) {
  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden bg-bg-default',
        device ? 'h-[844px] w-[390px] rounded-xl border border-border-subtle' : 'h-full w-full',
        className,
      )}
      {...props}
    >
      {appBar ? <div className="shrink-0">{appBar}</div> : null}
      <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
