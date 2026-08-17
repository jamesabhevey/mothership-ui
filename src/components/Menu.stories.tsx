import type { Meta, StoryObj } from '@storybook/react-vite'
import { Menu, MenuItem } from './Menu'

const meta = {
  title: 'Components/Navigation/Menu/Menu',
  component: Menu,
} satisfies Meta<typeof Menu>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The floating surface. Opening, arrow-key movement, Escape and returning
 * focus to the trigger belong to whatever owns the open state.
 */
export const Default: Story = {
  render: (args) => (
    <Menu className="w-56" {...args}>
      <MenuItem selected>Monthly</MenuItem>
      <MenuItem>Quarterly</MenuItem>
      <MenuItem>Annually</MenuItem>
      <MenuItem disabled>Custom</MenuItem>
    </Menu>
  ),
}
