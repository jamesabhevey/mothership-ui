import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../lib/cn'

export type AppBarProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  /** Names the screen, not the application. */
  title: ReactNode
  /** Usually a back control. Pass an IconButton — its label is required. */
  leadingAction?: ReactNode
  trailingAction?: ReactNode
  /** Centred on iOS, default (leading) on Android, to match platform convention. */
  centred?: boolean
}

/**
 * The persistent bar at the top of a screen carrying the screen title and up
 * to two actions.
 *
 * Use on every screen in an application shell, to anchor where the user is
 * and give them a way back. Page headings inside a scrolling page need
 * PageHeader instead — an app bar stays fixed while content scrolls beneath.
 */
export function AppBar({
  className,
  title,
  leadingAction,
  trailingAction,
  centred = false,
  ...props
}: AppBarProps) {
  return (
    <header
      className={cn(
        'flex h-16 w-full items-center gap-2 px-2',
        'bg-surface-default border-b border-border-subtle',
        className,
      )}
      {...props}
    >
      <div className="flex size-10 shrink-0 items-center justify-start">{leadingAction}</div>

      <h1
        className={cn(
          'min-w-0 flex-1 truncate text-heading-sm text-text-primary',
          centred && 'text-center',
        )}
      >
        {title}
      </h1>

      <div className="flex size-10 shrink-0 items-center justify-end">{trailingAction}</div>
    </header>
  )
}
