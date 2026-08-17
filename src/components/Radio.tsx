import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../lib/cn'

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & {
  /** The visible label. The whole row is clickable. */
  children?: ReactNode
  className?: string
}

/**
 * Lets the user pick exactly one option from a visible set.
 *
 * Use when there are two to five mutually exclusive options and seeing them
 * all at once helps the decision. One option must always be selected — a
 * radio cannot be unselected by clicking it again, so never use one for an
 * optional single choice. More than about five options need Select;
 * independent choices need Checkbox.
 *
 * Group radios inside a `<fieldset>` with a `<legend>`: they share a group
 * label, and arrow keys move between them rather than Tab.
 *
 * The 20px control is below the 44px minimum touch target, so the label is
 * part of the control and the row is padded to 44px.
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { className, children, disabled, ...props },
  ref,
) {
  return (
    <label
      className={cn(
        'group inline-flex items-start gap-3 py-3',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className,
      )}
    >
      <input ref={ref} type="radio" disabled={disabled} className="peer sr-only" {...props} />
      <span
        aria-hidden
        className={cn(
          'grid size-5 shrink-0 place-items-center rounded-full border border-solid transition-colors',
          'bg-surface-default border-border-default',
          !disabled && 'group-hover:bg-bg-subtle',
          'peer-checked:border-2 peer-checked:border-action-primary-default',
          'peer-checked:[&>span]:opacity-100',
          'peer-disabled:border-border-subtle peer-disabled:peer-checked:border-border-subtle',
          'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus-ring',
        )}
      >
        <span
          className={cn(
            'size-2 rounded-full opacity-0 transition-opacity',
            disabled ? 'bg-text-muted' : 'bg-action-primary-default group-hover:bg-action-primary-hover',
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
