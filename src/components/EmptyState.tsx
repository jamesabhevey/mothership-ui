import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../lib/cn'

export type EmptyStateProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  title: ReactNode
  /** Say what to do next, not just that nothing is here. */
  description?: ReactNode
  /** 32px glyph. */
  icon?: ReactNode
  /**
   * Omit when the user genuinely cannot act — for example when a filter
   * returned nothing — and tell them to adjust the filter instead.
   */
  action?: ReactNode
}

/**
 * Explains why a region has no content and offers a way forward.
 *
 * Use when a list, table or search result is legitimately empty, whether
 * because the user has not created anything yet or because a filter excluded
 * everything. Loading needs Spinner; errors need Banner. An empty state is
 * not a failure.
 */
export function EmptyState({
  className,
  title,
  description,
  icon,
  action,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn('flex w-full flex-col items-center gap-4 px-4 py-12 text-center', className)}
      {...props}
    >
      {icon ? (
        <span className="grid size-8 place-items-center text-icon-muted" aria-hidden>
          {icon}
        </span>
      ) : null}

      <div className="flex max-w-prose flex-col gap-2">
        <h3 className="text-heading-sm text-text-primary">{title}</h3>
        {description ? <p className="text-body-sm text-text-secondary">{description}</p> : null}
      </div>

      {action}
    </div>
  )
}
