import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './Badge'

const meta = {
  title: 'Primitives/Badge',
  component: Badge,
  args: { children: 'Label' },
  argTypes: {
    intent: {
      control: 'inline-radio',
      options: ['neutral', 'info', 'success', 'warning', 'danger', 'brand'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Neutral: Story = {
  args: { intent: 'neutral', children: 'Neutral' },
}

export const Info: Story = {
  args: { intent: 'info', children: 'Info' },
}

export const Success: Story = {
  args: { intent: 'success', children: 'Active' },
}

export const Warning: Story = {
  args: { intent: 'warning', children: 'Pending' },
}

export const Danger: Story = {
  args: { intent: 'danger', children: 'Failed' },
}

export const Brand: Story = {
  args: { intent: 'brand', children: 'Beta' },
}

export const Small: Story = {
  args: { size: 'sm', children: 'Small' },
}

export const Medium: Story = {
  args: { size: 'md', children: 'Medium' },
}
