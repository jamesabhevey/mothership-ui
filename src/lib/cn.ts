import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * tailwind-merge has to be told about the type scale.
 *
 * `text-label-md` (a font size) and `text-text-primary` (a colour) are both
 * `text-*`, and without this the merger treats them as the same conflict
 * group and silently drops whichever comes first — which shows up as text
 * rendering at the wrong colour. Same story for `shadow-elevation-*`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'display-lg',
            'heading-lg',
            'heading-md',
            'heading-sm',
            'body-lg',
            'body-md',
            'body-sm',
            'label-lg',
            'label-md',
            'label-sm',
            'caption-lg',
            'caption-md',
          ],
        },
      ],
      shadow: [{ shadow: ['elevation-sm', 'elevation-md', 'elevation-lg'] }],
    },
  },
})

/** Merge conditional class names, letting later Tailwind utilities win. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
