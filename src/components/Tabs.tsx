import { type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../lib/cn'
import { focusRing } from '../lib/focus'

export type TabsProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Names what the tabs switch between. The container is the tab list, so it
   * needs a group label.
   */
  label: string
}

/**
 * The container holding a row of Tab items with a shared baseline rule.
 *
 * Use beneath a page header or at the top of a card, to switch between peer
 * views. Not for primary app navigation across unrelated destinations, which
 * belongs in AppBar or a nav shell.
 *
 * Keep exactly one Tab active — never zero, never more than one.
 */
export function Tabs({ className, label, children, ...props }: TabsProps) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn('flex w-full items-end border-b border-border-subtle', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export type TabProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  children: ReactNode
  active?: boolean
}

/**
 * One item in a horizontal tab bar, switching between sibling views of the
 * same object.
 *
 * Use when content divides into two to five peer sections the user moves
 * between without losing their place. Sequential steps need a stepper.
 *
 * Active shows the 2px indicator and the link colour together, so it never
 * depends on colour alone. The row is 44px high with the indicator, meeting
 * the minimum touch target.
 */
export function Tab({ className, children, active = false, disabled, ...props }: TabProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      disabled={disabled}
      className={cn(
        'flex flex-col items-center transition-colors',
        !disabled && !active && 'hover:bg-bg-subtle',
        disabled && 'cursor-not-allowed',
        focusRing,
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          'flex items-center px-4 py-3 text-label-md',
          disabled ? 'text-text-muted' : active ? 'text-text-link' : 'text-text-secondary',
        )}
      >
        {children}
      </span>
      <span
        aria-hidden
        className={cn('h-0.5 w-full', active ? 'bg-action-primary-default' : 'bg-bg-transparent')}
      />
    </button>
  )
}
