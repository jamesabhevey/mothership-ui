import { useId, useState, type ReactNode } from 'react'
import { cn } from '../lib/cn'

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

const bubblePosition: Record<TooltipPlacement, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-1',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-1',
  left: 'right-full top-1/2 -translate-y-1/2 mr-1',
  right: 'left-full top-1/2 -translate-y-1/2 ml-1',
}

// 8x4 triangle, matching the arrow geometry on the Figma variants.
const arrowPosition: Record<TooltipPlacement, string> = {
  top: 'top-full left-1/2 -translate-x-1/2 border-x-4 border-x-transparent border-t-4 border-t-bg-inverse',
  bottom:
    'bottom-full left-1/2 -translate-x-1/2 border-x-4 border-x-transparent border-b-4 border-b-bg-inverse',
  left: 'left-full top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-l-4 border-l-bg-inverse',
  right:
    'right-full top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-bg-inverse',
}

export type TooltipProps = {
  /** The short clarifying phrase. Keep it under about ten words. */
  label: ReactNode
  /** Which side of the trigger the tooltip sits on. */
  placement?: TooltipPlacement
  /** Force visibility. Leave unset to show on hover and keyboard focus. */
  open?: boolean
  className?: string
  children: ReactNode
}

/**
 * Shows a short clarifying label on hover or focus of another control.
 *
 * Use to name an IconButton, or to explain a truncated value or unfamiliar
 * term. Not for essential information, long explanations, or anything
 * containing a link or button: tooltips are unreachable on touch devices and
 * vanish on any interaction, so nothing important belongs in one.
 *
 * A tooltip is not an accessible name. IconButton still needs its `label`
 * filled in even when a tooltip is present.
 *
 * The Figma component gives each placement its own arrow geometry so the
 * arrow meets the bubble edge exactly. Here the arrow is centred on the
 * trigger, which is what a reusable tooltip needs.
 */
export function Tooltip({
  label,
  placement = 'top',
  open,
  className,
  children,
}: TooltipProps) {
  const [hovered, setHovered] = useState(false)
  const id = useId()
  const visible = open ?? hovered

  return (
    <span
      className={cn('relative inline-flex', className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <span aria-describedby={visible ? id : undefined} className="inline-flex">
        {children}
      </span>
      <span
        id={id}
        role="tooltip"
        hidden={!visible}
        className={cn(
          'absolute z-50 w-max px-2 py-1 rounded-sm',
          'bg-bg-inverse text-text-inverse text-caption-lg',
          bubblePosition[placement],
        )}
      >
        {label}
        <span className={cn('absolute size-0', arrowPosition[placement])} aria-hidden />
      </span>
    </span>
  )
}
