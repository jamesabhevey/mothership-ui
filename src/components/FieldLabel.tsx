import type { LabelHTMLAttributes, ReactNode } from 'react'
import { cn } from '../lib/cn'

export type FieldLabelProps = Omit<LabelHTMLAttributes<HTMLLabelElement>, 'children'> & {
  /** The field name. Never hide it to save space. */
  label: ReactNode
  /** Shows the asterisk. */
  required?: boolean
  /**
   * A sentence of guidance below the label that is not an error and not a
   * format hint. Format hints and errors belong in FieldHelperText.
   */
  supporting?: ReactNode
  /** Renders the muted colour used when the field it labels is disabled. */
  disabled?: boolean
}

/**
 * The label for a form field, with optional supporting copy and a required
 * marker. Every field needs one.
 *
 * The asterisk alone does not communicate that a field is required, so state
 * the convention once near the form, or add the word "Required" to the label.
 */
export function FieldLabel({
  className,
  label,
  required,
  supporting,
  disabled,
  ...props
}: FieldLabelProps) {
  return (
    <label className={cn('flex flex-col gap-1', className)} {...props}>
      <span className="flex items-start gap-1 text-label-md">
        <span className={disabled ? 'text-text-muted' : 'text-text-primary'}>{label}</span>
        {required ? (
          <span className="text-feedback-danger-text" aria-hidden>
            *
          </span>
        ) : null}
      </span>
      {supporting ? (
        <span className={cn('text-caption-md', disabled ? 'text-text-muted' : 'text-text-secondary')}>
          {supporting}
        </span>
      ) : null}
    </label>
  )
}
