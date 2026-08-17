import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconButton } from './IconButton'
import { Bell, EllipsisVertical, Plus, Settings, Trash2 } from './icons'

const meta = {
  title: 'Components/Form Elements/Icon Button',
  component: IconButton,
  args: { label: 'Add', icon: <Plus size={16} strokeWidth={2} /> },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'tertiary'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: { variant: 'primary', label: 'Add', icon: <Plus size={16} strokeWidth={2} /> },
}

export const Secondary: Story = {
  args: { variant: 'secondary', label: 'Settings', icon: <Settings size={16} strokeWidth={2} /> },
}

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    label: 'More options',
    icon: <EllipsisVertical size={16} strokeWidth={2} />,
  },
}

export const Disabled: Story = {
  args: {
    variant: 'secondary',
    disabled: true,
    label: 'Delete',
    icon: <Trash2 size={16} strokeWidth={2} />,
  },
}

export const Small: Story = {
  args: { size: 'sm', variant: 'secondary', label: 'Notifications', icon: <Bell size={16} strokeWidth={2} /> },
}

export const Medium: Story = {
  args: { size: 'md', variant: 'secondary', label: 'Notifications', icon: <Bell size={16} strokeWidth={2} /> },
}

export const Large: Story = {
  args: { size: 'lg', variant: 'secondary', label: 'Notifications', icon: <Bell size={24} strokeWidth={2} /> },
}
