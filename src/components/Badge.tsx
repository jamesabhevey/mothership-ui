import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/cn'

const badge = cva('inline-flex items-center justify-center gap-1 py-1 rounded-full', {
  variants: {
    intent: {
      neutral: 'bg-bg-subtle text-text-secondary',
      info: 'bg-feedback-info-surface text-feedback-info-text',
      success: 'bg-feedback-success-surface text-feedback-success-text',
      warning: 'bg-feedback-warning-surface text-feedback-warning-text',
      danger: 'bg-feedback-danger-surface text-feedback-danger-text',
      brand: 'bg-bg-selected text-text-link',
    },
    size: {
      sm: 'px-2 text-label-sm',
      md: 'px-3 text-label-md',
    },
  },
  defaultVariants: { intent: 'neutral', size: 'sm' },
})

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badge>

/**
 * A small, non-interactive label showing status, category or count.
 *
 * Not for anything clickable — a badge is read only. If the user can act on
 * it, use Button at `sm`.
 *
 * Intent colour is decoration, so the label text must carry the meaning on
 * its own. Never use `danger` alone to signal an error; pair it with wording.
 */
export function Badge({ className, intent, size, ...props }: BadgeProps) {
  return <span className={cn(badge({ intent, size }), className)} {...props} />
}
