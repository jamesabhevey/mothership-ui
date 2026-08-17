import type { HTMLAttributes, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/cn'
import { focusRing } from '../lib/focus'
import { CircleCheck, Info, TriangleAlert, X } from './icons'

const banner = cva('flex w-full items-start gap-3 p-4 rounded-md border border-solid', {
  variants: {
    intent: {
      info: 'bg-feedback-info-surface border-feedback-info-border text-feedback-info-text',
      success:
        'bg-feedback-success-surface border-feedback-success-border text-feedback-success-text',
      warning:
        'bg-feedback-warning-surface border-feedback-warning-border text-feedback-warning-text',
      danger: 'bg-feedback-danger-surface border-feedback-danger-border text-feedback-danger-text',
    },
  },
  defaultVariants: { intent: 'info' },
})

const glyph = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  danger: TriangleAlert,
} as const

export type BannerProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> &
  VariantProps<typeof banner> & {
    /** States the situation in words. The icon and colour are decoration. */
    title: ReactNode
    body?: ReactNode
    /** Renders the dismiss control. */
    onClose?: () => void
  }

/**
 * Communicates a persistent, page-level message about the state of the system
 * or the result of an action.
 *
 * Use for a form-wide validation summary, a system status notice, or the
 * outcome of a background job. Banners stay until dismissed or resolved.
 * Transient confirmations need a toast; validation of a single field belongs
 * in that field's helper text.
 *
 * Use `danger` only for genuine failures — overuse trains users to ignore it.
 * The live region means the banner is announced when it appears rather than
 * only rendering visually.
 */
export function Banner({ className, intent = 'info', title, body, onClose, ...props }: BannerProps) {
  const Glyph = glyph[intent ?? 'info']

  return (
    <div
      role={intent === 'danger' ? 'alert' : 'status'}
      aria-live={intent === 'danger' ? 'assertive' : 'polite'}
      className={cn(banner({ intent }), className)}
      {...props}
    >
      <Glyph size={24} strokeWidth={2} className="shrink-0" aria-hidden />

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-label-md">{title}</p>
        {body ? <p className="text-body-sm">{body}</p> : null}
      </div>

      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          className={cn(
            'grid size-4 shrink-0 place-items-center rounded-sm text-current',
            'transition-opacity hover:opacity-70 active:opacity-50',
            focusRing,
          )}
        >
          <X size={16} strokeWidth={2} aria-hidden />
        </button>
      ) : null}
    </div>
  )
}
