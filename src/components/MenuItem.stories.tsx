import type { Meta, StoryObj } from '@storybook/react-vite'
import { Menu, MenuItem } from './Menu'

const meta = {
  title: 'Surfaces/MenuItem',
  component: MenuItem,
  args: { children: 'Quarterly' },
  decorators: [
    (Story) => (
      <Menu className="w-56">
        <Story />
      </Menu>
    ),
  ],
} satisfies Meta<typeof MenuItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** Selected always pairs the tint with a tick, so it is never colour alone. */
export const Selected: Story = {
  args: { selected: true, children: 'Monthly' },
}

export const Disabled: Story = {
  args: { disabled: true, children: 'Custom' },
}
