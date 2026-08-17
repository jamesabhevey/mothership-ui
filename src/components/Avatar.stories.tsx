import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from './Avatar'

const meta = {
  title: 'Primitives/Avatar',
  component: Avatar,
  args: { initials: 'JD', name: 'James Devine' },
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const XSmall: Story = {
  args: { size: 'xs' },
}

export const Small: Story = {
  args: { size: 'sm' },
}

export const Medium: Story = {
  args: { size: 'md' },
}

export const Large: Story = {
  args: { size: 'lg' },
}

/** With no photo and no initials, the user glyph stands in. */
export const IconFallback: Story = {
  args: { size: 'md', initials: undefined, name: 'Unknown person' },
}
