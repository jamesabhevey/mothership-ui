import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'
import { ChevronRight, Plus } from './icons'

const meta = {
  title: 'Primitives/Button',
  component: Button,
  args: { children: 'Button' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'tertiary', 'destructive'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: { variant: 'primary', children: 'Primary' },
}

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Secondary' },
}

export const Tertiary: Story = {
  args: { variant: 'tertiary', children: 'Tertiary' },
}

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Destructive' },
}

export const Small: Story = {
  args: { size: 'sm', children: 'Small' },
}

export const Medium: Story = {
  args: { size: 'md', children: 'Medium' },
}

export const Large: Story = {
  args: { size: 'lg', children: 'Large' },
}

export const LeadingIcon: Story = {
  args: { children: 'Leading', leadingIcon: <Plus size={16} strokeWidth={2} /> },
}

export const TrailingIcon: Story = {
  args: { children: 'Trailing', trailingIcon: <ChevronRight size={16} strokeWidth={2} /> },
}

export const Loading: Story = {
  args: { loading: true, children: 'Saving' },
}

export const Disabled: Story = {
  args: { disabled: true, children: 'Disabled' },
}

export const DisabledSecondary: Story = {
  args: { variant: 'secondary', disabled: true, children: 'Disabled' },
}
