import { forwardRef, useCallback, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../lib/cn'
import { Check } from './icons'

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & {
  /** The visible label. Every checkbox needs one, placed beside the box. */
  children?: ReactNode
  /** Marks a parent whose children are only partly selected. */
  indeterminate?: boolean
  className?: string
}

/**
 * Lets the user select any number of options from a set, including none.
 *
 * Use when options are independent, or for a standalone opt-in such as
 * accepting terms. Mutually exclusive choices need Radio; an immediate on/off
 * setting that applies straight away needs Switch.
 *
 * The box is 20px, well below the 44px minimum touch target, so the label is
 * part of the control and the row is padded to 44px.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { className, children, indeterminate = false, disabled, ...props },
  forwardedRef,
) {
  const ref = useCallback(
    (node: HTMLInputElement | null) => {
      if (node) node.indeterminate = indeterminate
      if (typeof forwardedRef === 'function') forwardedRef(node)
      else if (forwardedRef) forwardedRef.current = node
    },
    [forwardedRef, indeterminate],
  )

  const marked = indeterminate

  return (
    <label
      className={cn(
        'group inline-flex items-start gap-3 py-3',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className,
      )}
    >
      <input
        ref={ref}
        type="checkbox"
        disabled={disabled}
        className="peer sr-only"
        aria-checked={indeterminate ? 'mixed' : undefined}
        {...props}
      />
      <span
        aria-hidden
        className={cn(
          'grid size-5 shrink-0 place-items-center rounded-sm border border-solid transition-colors',
          'bg-surface-default border-border-default',
          !disabled && 'group-hover:bg-bg-subtle',
          'peer-checked:bg-action-primary-default peer-checked:border-transparent',
          !disabled && 'group-hover:peer-checked:bg-action-primary-hover',
          'peer-checked:[&>svg]:block',
          'peer-disabled:border-border-subtle',
          'peer-disabled:peer-checked:bg-action-primary-disabled',
          marked &&
            (disabled
              ? 'bg-action-primary-disabled border-transparent'
              : 'bg-action-primary-default border-transparent group-hover:bg-action-primary-hover'),
          'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus-ring',
        )}
      >
        {indeterminate ? (
          <span
            className={cn('h-0.5 w-3 rounded-full', disabled ? 'bg-text-muted' : 'bg-text-on-brand')}
          />
        ) : (
          <Check
            size={16}
            strokeWidth={2}
            className={cn('hidden', disabled ? 'text-text-muted' : 'text-text-on-brand')}
          />
        )}
      </span>
      {children ? (
        <span className={cn('text-label-md', disabled ? 'text-text-muted' : 'text-text-primary')}>
          {children}
        </span>
      ) : null}
    </label>
  )
})
