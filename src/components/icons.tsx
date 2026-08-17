import type { LucideIcon, LucideProps } from 'lucide-react'
import {
  ArrowRight,
  Bell,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleCheck,
  Download,
  EllipsisVertical,
  ExternalLink,
  Eye,
  House,
  Info,
  Lock,
  Mail,
  Pencil,
  Plus,
  Search,
  Settings,
  Star,
  Trash2,
  TriangleAlert,
  User,
  X,
} from 'lucide-react'

/**
 * Every glyph in the set, in the order the Figma Icon page lists them.
 *
 * This array is the canonical list — enumerate it rather than calling
 * `Object.keys(icons)`. Tooling that walks the module (Storybook's docgen, for
 * one) appends its own keys to exported objects, so the map is not safe to
 * iterate.
 */
export const iconNames = [
  'arrow-right',
  'bell',
  'calendar',
  'check',
  'chevron-down',
  'chevron-left',
  'chevron-right',
  'chevron-up',
  'circle-check',
  'download',
  'ellipsis-vertical',
  'external-link',
  'eye',
  'house',
  'info',
  'lock',
  'mail',
  'pencil',
  'plus',
  'search',
  'settings',
  'star',
  'trash-2',
  'triangle-alert',
  'user',
  'x',
] as const

export type IconName = (typeof iconNames)[number]

/**
 * The Figma Icon set (page "Icon", nodes 17:5–31:92) is Lucide, drawn on a
 * 24px grid with a 2px round stroke. lucide-react ships that same artwork, so
 * the glyphs are reused rather than re-exported as SVG assets.
 *
 * Size comes from the parent slot and must be 16, 20, 24 or 32 — never a
 * value off the scale. Colour comes from the stroke, which inherits
 * currentColor so the surrounding component controls it.
 */
export const icons: Record<IconName, LucideIcon> = {
  'arrow-right': ArrowRight,
  bell: Bell,
  calendar: Calendar,
  check: Check,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  'circle-check': CircleCheck,
  download: Download,
  'ellipsis-vertical': EllipsisVertical,
  'external-link': ExternalLink,
  eye: Eye,
  house: House,
  info: Info,
  lock: Lock,
  mail: Mail,
  pencil: Pencil,
  plus: Plus,
  search: Search,
  settings: Settings,
  star: Star,
  'trash-2': Trash2,
  'triangle-alert': TriangleAlert,
  user: User,
  x: X,
}

export type IconProps = Omit<LucideProps, 'size' | 'name'> & {
  name: IconName
  /** Slot size in px. The design system only uses 16, 20, 24 and 32. */
  size?: 16 | 20 | 24 | 32
}

/** Render a glyph from the Mothership icon set by name. */
export function Icon({ name, size = 24, strokeWidth = 2, ...props }: IconProps) {
  const Glyph = icons[name]
  return <Glyph size={size} strokeWidth={strokeWidth} aria-hidden {...props} />
}

export type { LucideIcon }
export {
  ArrowRight,
  Bell,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleCheck,
  Download,
  EllipsisVertical,
  ExternalLink,
  Eye,
  House,
  Info,
  Lock,
  Mail,
  Pencil,
  Plus,
  Search,
  Settings,
  Star,
  Trash2,
  TriangleAlert,
  User,
  X,
}
