import { Children, Fragment, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../lib/cn'
import { Divider } from './Divider'

export type SettingsRowGroupProps = HTMLAttributes<HTMLDivElement> & {
  /** Names the set. Screen readers announce it with each row. */
  label?: ReactNode
  /** ListItem rows. Dividers are inserted between them. */
  children: ReactNode
}

/**
 * A bounded group of settings rows, each applying immediately.
 *
 * Use for a settings or preferences screen: give a row a Switch as its
 * trailing content when the setting is a toggle, or leave the chevron when it
 * opens a sub-screen. Form fields that only apply on submit need FormSection;
 * a plain list of records needs ListItem on its own.
 *
 * Rows are 48px minimum, which clears the touch target. Dividers are
 * decorative and hidden from assistive technology.
 */
export function SettingsRowGroup({
  className,
  label,
  children,
  ...props
}: SettingsRowGroupProps) {
  const rows = Children.toArray(children)

  return (
    <section className={cn('flex w-full flex-col gap-2', className)} aria-label={typeof label === 'string' ? label : undefined}>
      {label ? <h2 className="px-4 text-label-md text-text-secondary">{label}</h2> : null}
      <div
        className="w-full overflow-hidden rounded-md border border-border-subtle bg-surface-default"
        {...props}
      >
        {rows.map((row, index) => (
          <Fragment key={index}>
            {index > 0 ? <Divider /> : null}
            {row}
          </Fragment>
        ))}
      </div>
    </section>
  )
}
