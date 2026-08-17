import { useEffect, useId, useRef, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/cn'
import { X } from './icons'
import { IconButton } from './IconButton'

const dialog = cva(
  [
    'flex w-full flex-col gap-4 p-6 rounded-xl',
    'bg-surface-raised shadow-elevation-lg',
  ],
  {
    variants: {
      size: { sm: 'max-w-[360px]', md: 'max-w-[480px]', lg: 'max-w-[640px]' },
    },
    defaultVariants: { size: 'sm' },
  },
)

export type ModalProps = VariantProps<typeof dialog> & {
  open: boolean
  /** Called on Escape, scrim click, and the close control. */
  onClose: () => void
  /** The accessible name of the dialog. */
  title: ReactNode
  children?: ReactNode
  /** Usually a primary Button. Swap it to `destructive` for delete confirmations. */
  primaryAction?: ReactNode
  secondaryAction?: ReactNode
  /** Hides the close control. The scrim must not be the only way out. */
  showClose?: boolean
  className?: string
}

/**
 * Interrupts the current task to ask for a decision or collect a small amount
 * of input. Modals should be rare.
 *
 * Not for long forms, nested modals, or non-urgent information. If the
 * content scrolls, it belongs on its own screen or in a sheet.
 *
 * Focus moves into the dialog on open, is trapped inside it, and returns to
 * the trigger on close. Escape dismisses it. The title is the accessible
 * name. The scrim is decorative.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  primaryAction,
  secondaryAction,
  showClose = true,
  size,
  className,
}: ModalProps) {
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return

    previouslyFocused.current = document.activeElement as HTMLElement | null

    const focusables = () =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      )

    focusables()[0]?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const items = focusables()
      if (items.length === 0) return

      const first = items[0]
      const last = items[items.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused.current?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-12 bg-surface-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(dialog({ size }), className)}
      >
        <div className="flex w-full items-center gap-3">
          <h2 id={titleId} className="min-w-0 flex-1 text-heading-md text-text-primary">
            {title}
          </h2>
          {showClose ? (
            <IconButton
              variant="tertiary"
              label="Close"
              onClick={onClose}
              icon={<X size={16} strokeWidth={2} />}
            />
          ) : null}
        </div>

        {children ? <div className="w-full">{children}</div> : null}

        {primaryAction || secondaryAction ? (
          <div className="flex w-full items-center justify-end gap-2">
            {secondaryAction}
            {primaryAction}
          </div>
        ) : null}
      </div>
    </div>
  )
}
