import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../lib/cn'

export type FormSectionProps = Omit<HTMLAttributes<HTMLFieldSetElement>, 'title'> & {
  /** The group label. Screen readers announce it with each field. */
  title?: ReactNode
  description?: ReactNode
  children: ReactNode
}

/**
 * A titled group of related form fields with consistent vertical rhythm.
 *
 * Use when a form has more than about five fields and splits into meaningful
 * groups, such as "Contact details" and "Delivery address". A single field
 * needs no section; settings that apply immediately need SettingsRowGroup.
 *
 * Field spacing is 20px, which keeps each label visually attached to its own
 * input rather than the one above.
 */
export function FormSection({
  className,
  title,
  description,
  children,
  ...props
}: FormSectionProps) {
  return (
    <fieldset className={cn('flex w-full min-w-0 flex-col gap-4', className)} {...props}>
      {title || description ? (
        <legend className="flex flex-col gap-1">
          {title ? <span className="text-heading-sm text-text-primary">{title}</span> : null}
          {description ? (
            <span className="text-caption-lg text-text-secondary">{description}</span>
          ) : null}
        </legend>
      ) : null}
      <div className="flex w-full flex-col gap-5">{children}</div>
    </fieldset>
  )
}
