import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/cn'
import { User } from './icons'

const avatar = cva(
  'inline-flex items-center justify-center overflow-hidden rounded-full shrink-0',
  {
    variants: {
      size: {
        xs: 'size-6 text-label-sm',
        sm: 'size-8 text-label-sm',
        md: 'size-10 text-label-md',
        lg: 'size-12 text-label-lg',
      },
      hasImage: {
        true: 'bg-surface-media',
        false: 'bg-bg-subtle text-text-secondary',
      },
    },
    defaultVariants: { size: 'md', hasImage: false },
  },
)

export type AvatarProps = Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> &
  Omit<VariantProps<typeof avatar>, 'hasImage'> & {
    /** Photo source. Falls back to initials, then to the user glyph. */
    src?: string
    /** Initials, e.g. "JD". Ignored when `src` is set. */
    initials?: string
    /**
     * The person or organisation being represented. Becomes the image alt
     * text — an avatar is not a substitute for a name.
     */
    name?: string
  }

/**
 * Represents a person or an organisation.
 *
 * Use to identify the author of a comment, the owner of a record, or the
 * signed-in user in an app bar. Not for product images or generic thumbnails;
 * those are not identity and should not be circular.
 *
 * If the avatar is a control, such as an account menu trigger, wrap it in
 * IconButton rather than making it interactive here.
 */
export function Avatar({ className, size = 'md', src, initials, name, ...props }: AvatarProps) {
  const glyph = size === 'xs' || size === 'sm' ? 16 : 24

  return (
    <span className={cn(avatar({ size, hasImage: Boolean(src) }), className)} {...props}>
      {src ? (
        <img src={src} alt={name ?? ''} className="size-full object-cover" />
      ) : initials ? (
        <span aria-hidden>{initials}</span>
      ) : (
        <User size={glyph} strokeWidth={2} className="text-icon-muted" aria-hidden />
      )}
      {!src && name ? <span className="sr-only">{name}</span> : null}
    </span>
  )
}
