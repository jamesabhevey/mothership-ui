import type { Meta, StoryObj } from '@storybook/react-vite'
import { AppBar } from './AppBar'
import { IconButton } from './IconButton'
import { ChevronLeft, EllipsisVertical } from './icons'

const meta = {
  title: 'Layout/AppBar',
  component: AppBar,
  args: {
    title: 'Screen title',
    leadingAction: (
      <IconButton variant="tertiary" label="Back" icon={<ChevronLeft size={16} strokeWidth={2} />} />
    ),
    trailingAction: (
      <IconButton
        variant="tertiary"
        label="More options"
        icon={<EllipsisVertical size={16} strokeWidth={2} />}
      />
    ),
  },
  decorators: [
    (Story) => (
      <div className="w-[390px] overflow-hidden rounded-md border border-border-subtle">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AppBar>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The variant the showcase uses. Centred matches iOS convention; use the
 * leading-aligned default on Android, where a centred title reads as wrong.
 */
export const Centred: Story = {
  args: { centred: true, title: 'Select service' },
}
