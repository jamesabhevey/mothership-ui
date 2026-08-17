import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../lib/cn'
import { TriangleAlert } from './icons'

export type FieldHelperTextProps = Omit<HTMLAttributes<HTMLParagraphElement>, 'children'> & {
  children: ReactNode
  /** Switches to the error treatment: alert glyph plus danger text. */
  error?: boolean
  /** Renders the muted colour used when the field it describes is disabled. */
  disabled?: boolean
}

/**
 * The line of text below a form field, carrying either a hint or a validation
 * message.
 *
 * The icon plus wording means an error is conveyed without relying on colour.
 * Error text must say what is wrong and how to fix it, not just that
 * something failed. Page-level messages belong in Banner instead.
 */
export function FieldHelperText({
  className,
  children,
  error,
  disabled,
  ...props
}: FieldHelperTextProps) {
  return (
    <p
      className={cn(
        'flex items-start gap-1 text-caption-md',
        error ? 'text-feedback-danger-text' : disabled ? 'text-text-muted' : 'text-text-secondary',
        className,
      )}
      {...props}
    >
      {error ? <TriangleAlert size={16} strokeWidth={2} className="shrink-0" aria-hidden /> : null}
      <span className="min-w-0 flex-1">{children}</span>
    </p>
  )
}
