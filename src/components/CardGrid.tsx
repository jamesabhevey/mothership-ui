import type { HTMLAttributes } from 'react'
import { cn } from '../lib/cn'

export type CardGridProps = HTMLAttributes<HTMLDivElement> & {
  /** Narrowest a card may get before the grid reflows. Defaults to 280px. */
  minCardWidth?: number
}

/**
 * A wrapping grid of Cards for browsing a collection of comparable items.
 *
 * Use when items are visual or need more than a line of description, so a
 * list would be too dense. Records best compared field by field need a table;
 * navigation needs ListItem.
 *
 * Keep the visual order the same as the reading order, since wrapping layouts
 * are read left to right and top to bottom.
 */
export function CardGrid({ className, minCardWidth = 280, style, ...props }: CardGridProps) {
  return (
    <div
      className={cn('grid w-full gap-6', className)}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(min(${minCardWidth}px, 100%), 1fr))`,
        ...style,
      }}
      {...props}
    />
  )
}
