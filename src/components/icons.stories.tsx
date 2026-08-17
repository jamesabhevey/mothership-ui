import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon, iconNames } from './icons'

const meta = {
  title: 'Components/Assets/Icon',
  component: Icon,
  args: { name: 'search', size: 24 },
  argTypes: {
    name: { control: 'select', options: iconNames },
    size: { control: 'inline-radio', options: [16, 20, 24, 32] },
  },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Swap the glyph and size with the controls. The full set is in
 * Foundations → Iconography.
 */
export const Default: Story = {}
