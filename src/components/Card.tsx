import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../lib/cn'

const card = cva('flex w-full flex-col gap-4 p-4 rounded-lg', {
  variants: {
    variant: {
      outlined: 'bg-surface-default border border-border-subtle',
      elevated: 'bg-surface-default shadow-elevation-sm',
    },
    interactive: { true: 'transition-colors', false: '' },
  },
  compoundVariants: [
    { variant: 'outlined', interactive: true, class: 'hover:bg-bg-subtle' },
    { variant: 'elevated', interactive: true, class: 'hover:bg-bg-subtle hover:shadow-elevation-md' },
  ],
  defaultVariants: { variant: 'outlined', interactive: false },
})

export type CardProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof card> & {
    title?: ReactNode
    body?: ReactNode
    /** Image, chart or any other block above the text. */
    media?: ReactNode
    /** Usually a Button or a row of Buttons. */
    actions?: ReactNode
  }

/**
 * Groups related content and actions about a single subject into one bounded
 * surface.
 *
 * Use for a collection of comparable items in a grid, or to group a summary
 * with its own actions. Not for nesting inside another card, and not as a
 * general layout container — a card with no title and no action is probably
 * just a section and does not need a border.
 *
 * `interactive` applies the hover treatment, and only makes sense when the
 * whole card is clickable, in which case it must contain exactly one primary
 * destination and one accessible name.
 *
 * Elevated cards rely on shadow alone to separate from the page, which
 * disappears in high contrast mode, so prefer `outlined` where separation
 * matters.
 */
export function Card({
  className,
  variant,
  interactive,
  title,
  body,
  media,
  actions,
  children,
  ...props
}: CardProps) {
  return (
    <div className={cn(card({ variant, interactive }), className)} {...props}>
      {media ? <div className="w-full overflow-hidden rounded-sm">{media}</div> : null}

      {title || body ? (
        <div className="flex w-full flex-col gap-2">
          {title ? <h3 className="text-heading-sm text-text-primary">{title}</h3> : null}
          {body ? <p className="text-body-sm text-text-secondary">{body}</p> : null}
        </div>
      ) : null}

      {children}

      {actions ? <div className="flex w-full items-start gap-2">{actions}</div> : null}
    </div>
  )
}
