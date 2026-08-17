import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../lib/cn'
import { focusRing } from '../lib/focus'
import { Check } from './icons'

export type MenuProps = HTMLAttributes<HTMLDivElement>

/**
 * A floating surface holding a short list of MenuItem rows.
 *
 * Use for an open Select, an overflow action list from an IconButton, or a
 * context menu. Not for navigation between top-level destinations, and not
 * for lists longer than about ten rows, which need a searchable list.
 *
 * The menu is a single tab stop with arrow keys moving between items, Escape
 * closes it, and focus must return to the trigger — wire that up in the
 * component that owns the open state. Position it so it never covers the
 * control that opened it.
 */
export function Menu({ className, children, ...props }: MenuProps) {
  return (
    <div
      role="menu"
      className={cn(
        'flex flex-col gap-0 p-1 rounded-md',
        'bg-surface-raised border border-border-subtle shadow-elevation-md',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export type MenuItemProps = Omit<HTMLAttributes<HTMLButtonElement>, 'children'> & {
  children: ReactNode
  /**
   * Marks the current choice. Always pairs the tint with a tick, so it never
   * relies on colour alone.
   */
  selected?: boolean
  disabled?: boolean
}

/**
 * One selectable row inside a Menu surface.
 *
 * Not for rows in a page-level list, which need ListItem. A menu item lives
 * on a floating surface and dismisses the menu when chosen.
 *
 * Minimum height is 40px, so pad to 44px on touch. Keep labels short and
 * never put controls other than the tick inside one.
 */
export function MenuItem({
  className,
  children,
  selected = false,
  disabled = false,
  ...props
}: MenuItemProps) {
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={selected}
      disabled={disabled}
      className={cn(
        'flex min-h-10 w-full items-center gap-2 px-3 py-2 rounded-sm text-left transition-colors',
        'text-body-md',
        selected ? 'bg-bg-selected text-text-link' : 'bg-bg-transparent text-text-primary',
        !disabled && !selected && 'hover:bg-bg-subtle',
        disabled && 'text-text-muted cursor-not-allowed',
        focusRing,
        className,
      )}
      {...props}
    >
      <span className="min-w-0 flex-1">{children}</span>
      {selected ? <Check size={16} strokeWidth={2} className="shrink-0" aria-hidden /> : null}
    </button>
  )
}
