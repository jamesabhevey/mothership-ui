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
          'peer-checked:bg-action-primary-default peer-checked:border-transparent',
          // The thumb is a grandchild of the input, and peer- variants only
          // reach siblings, so the checked state has to move it from here.
          'peer-checked:[&>span]:border-transparent peer-checked:[&>span]:translate-x-4',
          'peer-disabled:border-border-subtle',
          'peer-disabled:peer-checked:bg-action-primary-disabled',
          'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus-ring',
        )}
      >
        <span
          className={cn(
            // The thumb travels rather than jumping. It used to move by
            // switching the track to justify-end, which is an alignment change
            // and cannot be transitioned — so the one control whose movement is
            // the feedback was the one control that did not move. 16px is the
            // track's 40 less its 4px padding either side and the 16px thumb.
            //
            // The transitioned property is `translate`, not `transform`:
            // Tailwind v4's translate-* utilities set the standalone `translate`
            // property, and a transition list naming `transform` moves the thumb
            // without animating it — which looks exactly like the jump this was
            // meant to fix.
            'size-4 rounded-full border border-solid',
            'transition-[background-color,border-color,translate] duration-[var(--duration-base)]',
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
