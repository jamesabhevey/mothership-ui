import { cn } from '../lib/cn'

export type DividerProps = React.HTMLAttributes<HTMLDivElement> & {
  orientation?: 'horizontal' | 'vertical'
}

/**
 * A one pixel rule separating content within a surface.
 *
 * Use to separate rows in a list, sections in a form, or groups in a menu,
 * where whitespace alone is not enough. Not for outlining a container — put a
 * border-border-default stroke on the container itself.
 *
 * Decorative, so it is hidden from assistive technology. Never rely on a
 * divider alone to convey grouping; give the group a heading too.
 */
export function Divider({ className, orientation = 'horizontal', ...props }: DividerProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      aria-hidden
      className={cn(
        'bg-border-subtle shrink-0',
        orientation === 'horizontal' ? 'h-px w-full' : 'w-px self-stretch',
        className,
      )}
      {...props}
    />
  )
}
