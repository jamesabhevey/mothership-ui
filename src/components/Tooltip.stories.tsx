import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tooltip } from './Tooltip'
import { Button } from './Button'
import { IconButton } from './IconButton'
import { Mail } from './icons'

const meta = {
  title: 'Components/Primitives/Tooltip',
  component: Tooltip,
  args: { label: 'Archive this record', children: <Button variant="secondary">Hover me</Button> },
  argTypes: {
    placement: { control: 'inline-radio', options: ['top', 'bottom', 'left', 'right'] },
  },
  // The bubble is absolutely positioned above the trigger, so the story needs
  // room to show it rather than clipping at the canvas edge.
  decorators: [
    (Story) => (
      <div className="flex min-h-24 items-end justify-center">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

/** Shown on hover and on keyboard focus. */
export const Top: Story = {
  args: {
    placement: 'top',
    label: 'Archive this record',
    children: <IconButton variant="secondary" label="Archive" icon={<Mail size={16} strokeWidth={2} />} />,
  },
}

/** `open` forces visibility, for documentation and visual regression shots. */
export const AlwaysOpen: Story = {
  args: { open: true, label: 'Always open', children: <Button variant="secondary">Bottom</Button> },
}
