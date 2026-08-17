import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../lib/cn'

export type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & {
  /** The setting being switched. Label the setting, not the on/off positions. */
  children?: ReactNode
  className?: string
}

/**
 * Turns a single setting on or off, taking effect immediately.
 *
 * Use when the change applies the moment it is toggled, such as enabling
 * notifications in a settings screen. Choices that only apply once a form is
 * submitted need Checkbox — a switch with a Save button beside it is a
 * contradiction.
 *
 * The 40x24 track is below the 44px minimum touch target, so the hit area
 * extends across the whole row.
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { className, children, disabled, ...props },
  ref,
) {
  return (
    <label
      className={cn(
        'group inline-flex items-center gap-3 py-2.5',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className,
      )}
    >
      <input ref={ref} type="checkbox" role="switch" disabled={disabled} className="peer sr-only" {...props} />
      <span
        aria-hidden
        className={cn(
          'flex h-6 w-10 shrink-0 items-center rounded-full px-1 transition-colors',
          'bg-bg-subtle border border-solid border-border-default',
          'peer-checked:bg-action-primary-default peer-checked:border-transparent peer-checked:justify-end',
          'peer-checked:[&>span]:border-transparent',
          'peer-disabled:border-border-subtle',
          'peer-disabled:peer-checked:bg-action-primary-disabled',
          'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus-ring',
        )}
      >
        <span
          className={cn(
            'size-4 rounded-full border border-solid transition-colors',
            'bg-surface-default border-border-strong',
            disabled && 'bg-border-subtle border-border-subtle',
          )}
        />
      </span>
      {children ? (
        <span className={cn('text-label-md', disabled ? 'text-text-muted' : 'text-text-primary')}>
          {children}
        </span>
      ) : null}
    </label>
  )
})
