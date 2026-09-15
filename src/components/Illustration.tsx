import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/cn'

const box = cva('relative block w-full overflow-hidden bg-surface-media', {
  variants: {
    // The four ratios in the Figma Illustration set, widest first.
    ratio: {
      '16:9': 'aspect-[16/9]',
      '3:2': 'aspect-[3/2]',
      '4:3': 'aspect-[4/3]',
      '1:1': 'aspect-square',
    },
  },
  defaultVariants: { ratio: '16:9' },
})

export type IllustrationProps = VariantProps<typeof box> & {
  /** Leave unset to show the placeholder — an image still loading, or none supplied. */
  src?: string
  /**
   * What the picture says, or an empty string when it says nothing.
   *
   * Required rather than optional so the decision is made rather than skipped.
   * Most illustrations are decorative and sit beside text that already carries
   * the meaning: pass `alt=""` for those, and a screen reader will pass over it.
   * Describe it only when losing the picture would lose information.
   */
  alt: string
  /**
   * Lazy by default, which is right for an illustration further down a page.
   * Set `eager` for one above the fold — a hero deferred is a hero that arrives
   * late.
   */
  loading?: 'lazy' | 'eager'
  className?: string
}

/**
 * A picture in a box of a fixed shape.
 *
 * Use for the illustrations in the Figma Illustration set: the media area of a
 * Card, the top of an empty state, a figure beside a block of text. Not for
 * photographs of people, which want Avatar, and not for icons, which want Icon.
 *
 * The ratio is the point. The box is reserved at its full height before the
 * image has loaded, so the page does not jump when it arrives — which is what
 * an aspect ratio is actually for, and why this is a component rather than a
 * note in the documentation saying to use 16:9.
 *
 * Choose the ratio for the crop rather than the space: 16:9 for scenes and
 * headers, 3:2 and 4:3 for general illustration, 1:1 for thumbnails and grids.
 * The image covers the box and crops from the centre, matching the Fill scale
 * mode the Figma component uses, so a wide image in a square box loses its
 * sides rather than squashing.
 *
 * With no `src` the box is left as `surface/media`, which is the same
 * placeholder the Figma component falls back to. That is a usable loading and
 * empty state rather than an accident.
 *
 * Corners are square. Round it where it sits — Card already rounds its media
 * slot — so this never has to know what it is inside.
 */
export const Illustration = forwardRef<HTMLDivElement, IllustrationProps>(function Illustration(
  { ratio = '16:9', src, alt, loading = 'lazy', className },
  ref,
) {
  return (
    <div ref={ref} className={cn(box({ ratio }), className)}>
      {src ? (
        <img
          src={src}
          alt={alt}
          loading={loading}
          // Cover and centre, so the ratio is honoured by cropping rather than
          // by distorting whatever was handed to it.
          className="absolute inset-0 size-full object-cover"
        />
      ) : null}
    </div>
  )
})
