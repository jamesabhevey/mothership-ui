import { type ElementType, type ReactNode } from 'react'
import { cn } from '../lib/cn'
import { focusRing } from '../lib/focus'

export type ListItemProps = {
  title: ReactNode
  subtitle?: ReactNode
  /** 24px glyph, or an Avatar. */
  leadingIcon?: ReactNode
  /**
   * 16px glyph. Show the trailing chevron only when the row actually
   * navigates — an unfulfilled affordance is worse than none.
   */
  trailingIcon?: ReactNode
  /**
   * Free-form trailing content — a Switch on a settings row, a Badge, a
   * value. Unlike `trailingIcon` it is not constrained to a 16px slot.
   */
  trailing?: ReactNode
  /** Marks the current row in a navigation list. Not the same as checked. */
  selected?: boolean
  disabled?: boolean
  className?: string
  /** Render as `button` or `a` when the row is interactive. */
  as?: ElementType
} & Record<string, unknown>

/**
 * One row in a list, representing a record the user can read or open.
 *
 * Use for navigation lists, settings rows, search results, or any repeating
 * collection of records. Tabular data needing aligned columns needs a table
 * row; a single call to action needs Button.
 *
 * Minimum height is 48px, which clears the 44px touch target. Selected state
 * pairs its tint with the row's own content, and must not rely on background
 * colour alone — mark it with `aria-current` as this does.
 */
export function ListItem({
  title,
  subtitle,
  leadingIcon,
  trailingIcon,
  trailing,
  selected = false,
  disabled = false,
  className,
  as,
  ...props
}: ListItemProps) {
  const interactive = Boolean(as) || Boolean(props.onClick) || Boolean(props.href)
  const Component: ElementType = as ?? (interactive ? 'button' : 'div')

  return (
    <Component
      className={cn(
        'flex min-h-12 w-full items-center gap-3 px-4 py-3 text-left transition-colors',
        selected ? 'bg-bg-selected' : 'bg-surface-default',
        interactive && !disabled && !selected && 'hover:bg-bg-subtle',
        interactive && !disabled && selected && 'hover:bg-bg-selected',
        interactive && !disabled && 'cursor-pointer',
        disabled && 'cursor-not-allowed',
        interactive && focusRing,
        className,
      )}
      aria-current={selected ? 'true' : undefined}
      aria-disabled={disabled || undefined}
      disabled={Component === 'button' ? disabled : undefined}
      {...props}
    >
      {leadingIcon ? (
        <span
          className={cn(
            'grid size-6 shrink-0 place-items-center',
            disabled ? 'text-icon-muted' : 'text-icon-default',
          )}
          aria-hidden
        >
          {leadingIcon}
        </span>
      ) : null}

      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className={cn('text-label-md', disabled ? 'text-text-muted' : 'text-text-primary')}>
          {title}
        </span>
        {subtitle ? (
          <span
            className={cn('text-caption-md', disabled ? 'text-text-muted' : 'text-text-secondary')}
          >
            {subtitle}
          </span>
        ) : null}
      </span>

      {trailingIcon ? (
        <span className="grid size-4 shrink-0 place-items-center text-icon-muted" aria-hidden>
          {trailingIcon}
        </span>
      ) : null}

      {trailing ? <span className="shrink-0">{trailing}</span> : null}
    </Component>
  )
}
