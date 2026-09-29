import { forwardRef, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/cn'

type Step = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'

/** One blurred blob: the brand step, its centre, its radii, and its opacity. */
type Blob = { step: Step; at: [string, string]; size: [string, string]; opacity?: number }

/*
 * The blobs in the Figma "Foundations / Mesh Gradient" frame, lowest first,
 * measured off the 1072 x 480 swatch and turned into percentages of the box.
 * Figma draws each one as an ellipse with a 140px layer blur; a radial
 * gradient fading to nothing is the CSS equivalent, so the radii here are the
 * ellipse's plus the spread of the blur, and the colour holds solid for the
 * inner 35%, where the blur has not yet reached.
 */
const meshes: Record<'vivid' | 'subtle', { base: Step; blobs: Blob[] }> = {
  vivid: {
    base: '700',
    blobs: [
      { step: '500', at: ['20%', '19%'], size: ['44%', '80%'] },
      { step: '400', at: ['77%', '19%'], size: ['36%', '68%'] },
      { step: '300', at: ['90%', '88%'], size: ['28%', '54%'], opacity: 85 },
      { step: '600', at: ['45%', '94%'], size: ['37%', '68%'] },
      { step: '800', at: ['6%', '100%'], size: ['33%', '60%'] },
    ],
  },
  subtle: {
    base: '50',
    blobs: [
      { step: '200', at: ['16%', '19%'], size: ['38%', '74%'] },
      { step: '100', at: ['82%', '23%'], size: ['37%', '68%'] },
      { step: '300', at: ['88%', '90%'], size: ['27%', '50%'], opacity: 60 },
      { step: '50', at: ['46%', '96%'], size: ['36%', '66%'] },
      { step: '200', at: ['8%', '100%'], size: ['31%', '56%'], opacity: 70 },
    ],
  },
}

const colour = (step: Step, opacity = 100) =>
  opacity === 100
    ? `var(--color-brand-${step})`
    : `color-mix(in srgb, var(--color-brand-${step}) ${opacity}%, transparent)`

// CSS paints the first background layer on top, Figma the last child, so the
// blobs are reversed on the way out.
const background = ({ base, blobs }: (typeof meshes)['vivid']) => ({
  backgroundColor: colour(base),
  backgroundImage: [...blobs]
    .reverse()
    .map(
      ({ step, at, size, opacity }) =>
        `radial-gradient(ellipse ${size[0]} ${size[1]} at ${at[0]} ${at[1]}, ${colour(step, opacity)} 35%, transparent)`,
    )
    .join(', '),
})

// A 320px floor on the 4px grid, rather than a height: an empty gradient
// still shows, and content or a class taller than that wins.
const box = cva('relative block min-h-80 w-full overflow-hidden', {
  variants: {
    variant: {
      vivid: 'text-text-on-brand',
      subtle: 'text-text-primary',
    },
  },
  defaultVariants: { variant: 'vivid' },
})

export type MeshGradientProps = VariantProps<typeof box> & {
  /** Whatever sits on the gradient: a heading, a call to action. Optional, since it can stand alone. */
  children?: ReactNode
  className?: string
}

/**
 * A soft field of brand colour, built only from the brand primitive ramp.
 *
 * Use behind a hero band, the top of a marketing page, or a large empty state
 * that wants more presence than `surface/media`. Not for anything a person
 * has to read closely, and not inside a control.
 *
 * `vivid` sits on `color/brand/700` and sets its text to `text/on-brand`, for
 * a heading and a button on a dark field. `subtle` sits on `color/brand/50`
 * and keeps `text/primary`, for a quiet surface behind ordinary copy. The
 * lighter blobs in the vivid variant reach `color/brand/300`, so keep text
 * away from the bottom right corner, or check the contrast where it lands.
 *
 * The primitives have one value, so the gradient is the same in light and
 * dark mode. That is deliberate: it is a brand moment rather than a surface,
 * and the Figma frame binds the same variables.
 *
 * It is at least 320px tall, so `<MeshGradient />` on its own is visible
 * rather than a box of no height. Content or a class can make it taller;
 * pass `min-h-0` for a thin band. Corners are square: round it where it sits.
 */
export const MeshGradient = forwardRef<HTMLDivElement, MeshGradientProps>(function MeshGradient(
  { variant = 'vivid', children, className },
  ref,
) {
  return (
    <div ref={ref} className={cn(box({ variant }), className)} style={background(meshes[variant ?? 'vivid'])}>
      {children}
    </div>
  )
})
