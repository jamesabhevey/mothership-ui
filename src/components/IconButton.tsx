import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/cn'
import { focusRing } from '../lib/focus'

const iconButton = cva(
  [
    'inline-grid place-items-center rounded-md shrink-0',
    'transition-colors select-none',
    'disabled:cursor-not-allowed',
    focusRing,
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-action-primary-default text-icon-inverse',
          'hover:not-disabled:bg-action-primary-hover active:not-disabled:bg-action-primary-pressed',
          'disabled:bg-action-primary-disabled disabled:text-icon-muted',
        ],
        secondary: [
          'bg-action-secondary-default text-icon-default border border-border-default',
          'hover:not-disabled:bg-action-secondary-hover active:not-disabled:bg-action-secondary-pressed',
          'disabled:bg-action-secondary-disabled disabled:text-icon-muted disabled:border-border-subtle',
        ],
        tertiary: [
          'bg-action-tertiary-default text-icon-default',
          'hover:not-disabled:bg-action-tertiary-hover active:not-disabled:bg-action-tertiary-pressed',
          'disabled:bg-action-tertiary-disabled disabled:text-icon-muted',
        ],
      },
      size: { sm: 'size-8', md: 'size-10', lg: 'size-12' },
    },
    defaultVariants: { variant: 'tertiary', size: 'md' },
  },
)

export type IconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'color' | 'children'
> &
  VariantProps<typeof iconButton> & {
    /** The glyph. Rendered at 16px, or 24px at `lg`. */
    icon: ReactNode
    /**
     * Required. There is no visible text to name the control, so this becomes
     * the accessible name.
     */
    label: string
  }

/**
 * Triggers an action using an icon alone, where a text label would not fit.
 *
 * Use where space is genuinely constrained — a toolbar, a table row, an app
 * bar, the close control on a modal — and the icon is unambiguous. If you
 * would need a tooltip to explain it, use Button with a visible label.
 *
 * `sm` is 32px and `md` is 40px, both below the 44px minimum touch target, so
 * use `lg` on touch or pad the hit area.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { className, variant, size = 'md', icon, label, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      className={cn(iconButton({ variant, size }), className)}
      {...props}
    >
      <span className={cn('grid place-items-center', size === 'lg' ? 'size-6' : 'size-4')} aria-hidden>
        {icon}
      </span>
    </button>
  )
})
