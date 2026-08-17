import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/cn'

const spinner = cva('shrink-0 animate-spin motion-reduce:animate-none', {
  variants: {
    // size/icon/16 | 24 | 32 — the spinner matches the icon scale exactly.
    size: { sm: 'size-4', md: 'size-6', lg: 'size-8' },
  },
  defaultVariants: { size: 'sm' },
})

export type SpinnerProps = Omit<React.SVGProps<SVGSVGElement>, 'children'> &
  VariantProps<typeof spinner> & {
    /**
     * Announced alongside the spinner. A spinner on its own tells a screen
     * reader user nothing, so pass the loading state in words — or set it to
     * null when a visible label already says it.
     */
    label?: string | null
  }

/**
 * Indicates a short, indeterminate wait.
 *
 * Use for a submitting button, a panel loading its first data, or an inline
 * action that has not returned. Not for waits with known progress, which need
 * a progress bar. Colour comes from the arc, which uses currentColor, so it
 * can sit on dark or brand surfaces.
 */
export function Spinner({ className, size, label = 'Loading', ...props }: SpinnerProps) {
  return (
    <>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        className={cn(spinner({ size }), 'text-action-primary-default', className)}
        {...props}
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity={0.2} strokeWidth={2} />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </svg>
      {label ? <span className="sr-only">{label}</span> : null}
    </>
  )
}
