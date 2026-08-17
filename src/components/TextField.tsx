import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/cn'
import { focusRing } from '../lib/focus'
import { FieldLabel } from './FieldLabel'
import { FieldHelperText } from './FieldHelperText'

const control = cva(
  [
    'flex items-center gap-2 w-full px-3 rounded-md border border-solid',
    'transition-colors',
    'focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus-ring',
  ],
  {
    variants: {
      size: { sm: 'h-8', md: 'h-10', lg: 'h-12' },
      state: {
        // The border stays at border/default: a colour change plus a ring
        // reads as two indicators.
        default: 'bg-surface-default border-border-default',
        error: 'bg-surface-default border-2 border-feedback-danger-border',
        disabled: 'bg-surface-sunken border-border-subtle',
      },
    },
    defaultVariants: { size: 'sm', state: 'default' },
  },
)

const input = cva(
  'min-w-0 flex-1 bg-transparent outline-none placeholder:text-text-muted disabled:cursor-not-allowed',
  {
    variants: {
      size: { sm: 'text-body-sm', md: 'text-body-md', lg: 'text-body-lg' },
      disabled: { true: 'text-text-muted', false: 'text-text-primary' },
    },
    defaultVariants: { size: 'sm', disabled: false },
  },
)

export type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> &
  Pick<VariantProps<typeof control>, 'size'> & {
    /** The field name. Never hide it to save space — a placeholder is not a label. */
    label?: ReactNode
    /** Sentence of guidance shown under the label. */
    supporting?: ReactNode
    /** Format hint or character limit, shown under the input. */
    helperText?: ReactNode
    /**
     * The validation message. Setting it switches the field to the error
     * treatment and replaces `helperText` — colour alone is not an error
     * message, so say what is wrong and how to fix it.
     */
    error?: ReactNode
    /** Glyph inside the input. 16px, or 24px at `lg`. */
    leadingIcon?: ReactNode
    className?: string
  }

/**
 * Collects a single line of text from the user.
 *
 * Use for short freeform input: a name, an email address, a search term, a
 * reference number. Not for choosing from a fixed set of options, which needs
 * Select.
 *
 * `sm` is 32px high, below the 44px minimum touch target, so use `md` or `lg`
 * on touch.
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  {
    className,
    size = 'sm',
    label,
    supporting,
    helperText,
    error,
    leadingIcon,
    id,
    disabled,
    required,
    ...props
  },
  ref,
) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const messageId = `${inputId}-message`
  const message = error ?? helperText
  const state = disabled ? 'disabled' : error ? 'error' : 'default'

  return (
    <div className={cn('flex w-full flex-col gap-2', className)}>
      {label ? (
        <FieldLabel
          htmlFor={inputId}
          label={label}
          supporting={supporting}
          required={required}
          disabled={disabled}
        />
      ) : null}

      <div className={control({ size, state })}>
        {leadingIcon ? (
          <span
            className={cn(
              'grid shrink-0 place-items-center',
              size === 'lg' ? 'size-6' : 'size-4',
              disabled ? 'text-icon-muted' : 'text-icon-default',
            )}
            aria-hidden
          >
            {leadingIcon}
          </span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className={cn(input({ size, disabled }), focusRing, 'focus-visible:outline-none')}
          {...props}
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
