import { forwardRef, useId, type ReactNode, type SelectHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/cn'
import { ChevronDown } from './icons'
import { FieldLabel } from './FieldLabel'
import { FieldHelperText } from './FieldHelperText'

const control = cva(
  [
    'relative flex items-center gap-2 w-full px-3 rounded-md border border-solid',
    'transition-colors',
    'focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus-ring',
  ],
  {
    variants: {
      size: { sm: 'h-8', md: 'h-10', lg: 'h-12' },
      state: {
        default: 'bg-surface-default border-border-default',
        error: 'bg-surface-default border-2 border-feedback-danger-border',
        disabled: 'bg-surface-sunken border-border-subtle',
      },
    },
    defaultVariants: { size: 'sm', state: 'default' },
  },
)

const field = cva(
  [
    'peer min-w-0 flex-1 appearance-none bg-transparent outline-none',
    'disabled:cursor-not-allowed',
  ],
  {
    variants: {
      size: { sm: 'text-body-sm', md: 'text-body-md', lg: 'text-body-lg' },
      disabled: { true: 'text-text-muted', false: 'text-text-primary' },
    },
    defaultVariants: { size: 'sm', disabled: false },
  },
)

export type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> &
  Pick<VariantProps<typeof control>, 'size'> & {
    /** Keep the label visible: a select with only a placeholder gives no context. */
    label?: ReactNode
    supporting?: ReactNode
    helperText?: ReactNode
    /** Validation message. Switches the control to the error treatment. */
    error?: ReactNode
    className?: string
  }

/**
 * Lets the user choose one option from a list that stays collapsed until
 * opened.
 *
 * Use when there are more than about five mutually exclusive options, or the
 * options are familiar enough that the user does not need to see them all to
 * decide. Two or three options worth comparing at a glance need Radio;
 * freeform input needs TextField.
 *
 * The Figma Active variant draws the open list as a Menu instance. In code
 * that is the browser's own popup on a native `<select>`, which keeps
 * keyboard and screen-reader behaviour correct on every platform. Menu and
 * MenuItem are exported separately for custom, non-native pickers.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, size = 'sm', label, supporting, helperText, error, id, disabled, required, children, ...props },
  ref,
) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const messageId = `${selectId}-message`
  const message = error ?? helperText
  const state = disabled ? 'disabled' : error ? 'error' : 'default'

  return (
    <div className={cn('flex w-full flex-col gap-2', className)}>
      {label ? (
        <FieldLabel
          htmlFor={selectId}
          label={label}
          supporting={supporting}
          required={required}
          disabled={disabled}
        />
      ) : null}

      <div className={control({ size, state })}>
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className={cn(field({ size, disabled }), 'focus-visible:outline-none')}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          size={size === 'lg' ? 24 : 16}
          strokeWidth={2}
          aria-hidden
          className={cn('pointer-events-none shrink-0', disabled ? 'text-icon-muted' : 'text-icon-default')}
        />
      </div>

      {message ? (
        <FieldHelperText id={messageId} error={Boolean(error)} disabled={disabled}>
          {message}
        </FieldHelperText>
      ) : null}
    </div>
  )
})
