import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/cn'
import { focusRing } from '../lib/focus'
import { Spinner } from './Spinner'

const button = cva(
  [
    'inline-flex items-center justify-center gap-2 rounded-md whitespace-nowrap',
    'transition-colors select-none',
    'disabled:cursor-not-allowed',
    focusRing,
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-action-primary-default text-text-on-brand',
          'hover:not-disabled:bg-action-primary-hover active:not-disabled:bg-action-primary-pressed',
          'disabled:bg-action-primary-disabled disabled:text-text-muted',
        ],
        secondary: [
          'bg-action-secondary-default text-text-primary border border-border-default',
          'hover:not-disabled:bg-action-secondary-hover active:not-disabled:bg-action-secondary-pressed',
          'disabled:bg-action-secondary-disabled disabled:text-text-muted disabled:border-border-subtle',
        ],
        tertiary: [
          'bg-action-tertiary-default text-text-primary',
          'hover:not-disabled:bg-action-tertiary-hover active:not-disabled:bg-action-tertiary-pressed',
          'disabled:bg-action-tertiary-disabled disabled:text-text-muted',
        ],
        destructive: [
          'bg-action-destructive-default text-text-on-brand',
          'hover:not-disabled:bg-action-destructive-hover active:not-disabled:bg-action-destructive-pressed',
          'disabled:bg-action-destructive-disabled disabled:text-text-muted',
        ],
      },
      size: {
        sm: 'h-8 px-3 text-label-md',
        md: 'h-10 px-4 text-label-md',
        lg: 'h-12 px-5 text-label-lg',
      },
      loading: { true: '', false: '' },
    },
    compoundVariants: [
      // size/button/min-width — Loading hides the label, so the button holds a
      // sensible footprint instead of collapsing to the spinner.
      { loading: true, size: 'sm', class: 'min-w-20' },
      { loading: true, size: 'md', class: 'min-w-24' },
      { loading: true, size: 'lg', class: 'min-w-28' },
    ],
    defaultVariants: { variant: 'primary', size: 'md', loading: false },
  },
)

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> &
  Omit<VariantProps<typeof button>, 'loading'> & {
    /** Swaps the label for a centred spinner and disables the control. */
    loading?: boolean
    /** Icon before the label. Sized by the button: 16px, or 24px at `lg`. */
    leadingIcon?: ReactNode
    /** Icon after the label. Sized by the button: 16px, or 24px at `lg`. */
    trailingIcon?: ReactNode
  }

/**
 * Triggers an action. The primary interactive control in the system.
 *
 * Primary for the single most important action in a view, Secondary for
 * alternatives beside it, Tertiary for low emphasis actions in dense layouts,
 * Destructive only for irreversible actions such as delete.
 *
 * Not for navigation to another screen or an external page — use a link or
 * ListItem so the control matches what actually happens.
 *
 * `sm` is 32px high and falls below the 44px minimum touch target, so use
 * `md` or `lg` on touch. Icon-only actions belong in IconButton, which
 * carries a required label.
 *
 * Hover and pressed are CSS states here rather than props; the Figma State
 * axis maps onto `:hover`, `:active`, `:disabled` and the `loading` prop.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant,
    size = 'md',
    loading = false,
    leadingIcon,
    trailingIcon,
    disabled,
    children,
    type = 'button',
    onClick,
    ...props
  },
  ref,
) {
  const iconSlot = size === 'lg' ? 'size-6' : 'size-4'
  // Loading keeps the variant's own fill — it is a busy control, not a
  // disabled one — so it uses aria-disabled rather than the disabled
  // attribute, which would pull in the disabled colours.
  const busy = loading && !disabled

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      aria-busy={busy || undefined}
      aria-disabled={busy || undefined}
      onClick={(event) => {
        if (busy) {
          event.preventDefault()
          return
        }
        onClick?.(event)
      }}
      className={cn(button({ variant, size, loading: busy }), className)}
      {...props}
    >
      {busy ? (
        <Spinner size={size === 'lg' ? 'md' : 'sm'} className="text-current" />
      ) : (
        <>
          {leadingIcon ? (
            <span className={cn('grid shrink-0 place-items-center', iconSlot)} aria-hidden>
              {leadingIcon}
            </span>
          ) : null}
          {children}
          {trailingIcon ? (
            <span className={cn('grid shrink-0 place-items-center', iconSlot)} aria-hidden>
              {trailingIcon}
            </span>
          ) : null}
        </>
      )}
    </button>
  )
})
