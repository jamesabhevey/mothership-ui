import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../lib/cn'

export type PageHeaderProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  /** Should be the only top-level heading on the page. */
  title: ReactNode
  subtitle?: ReactNode
  /** A Button, or a row of Buttons for pages with more than one action. */
  actions?: ReactNode
  /** A Tabs element. It carries its own group label. */
  tabs?: ReactNode
}

/**
 * The heading region at the top of a scrolling page: page name, optional
 * description, a primary action and optional tabs.
 *
 * Use once per page, at the top of the scroll area. The fixed bar at the top
 * of a mobile screen is AppBar — PageHeader scrolls away, AppBar does not.
 */
export function PageHeader({
  className,
  title,
  subtitle,
  actions,
  tabs,
  ...props
}: PageHeaderProps) {
  return (
    <header className={cn('flex w-full flex-col gap-4 bg-bg-default', className)} {...props}>
      <div className="flex w-full flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="text-heading-lg text-text-primary">{title}</h1>
          {subtitle ? <p className="text-body-sm text-text-secondary">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
      {tabs}
    </header>
  )
}
