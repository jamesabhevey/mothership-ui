import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card } from './Card'
import { Button } from './Button'

const meta = {
  title: 'Surfaces/Card',
  component: Card,
  args: {
    title: 'Card title',
    body: 'One or two sentences describing what this card contains and why it matters.',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['outlined', 'elevated'] },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    title: 'Outlined card',
    body: 'One or two sentences describing what this card contains and why it matters.',
    actions: <Button size="md">Open</Button>,
  },
}

/**
 * Elevated cards rely on shadow alone to separate from the page, which
 * disappears in high contrast mode. Prefer outlined where separation matters.
 */
export const Elevated: Story = {
  args: {
    variant: 'elevated',
    title: 'Elevated card',
    body: 'Elevated cards rely on shadow alone, which disappears in high contrast mode.',
    actions: (
      <Button size="md" variant="secondary">
        Open
      </Button>
    ),
  },
}

/** Hover applies only when the whole card is clickable. */
export const Interactive: Story = {
  args: {
    interactive: true,
    title: 'Interactive card',
    body: 'Hover applies only when the whole card is clickable.',
    media: <div className="h-[140px] w-full bg-surface-media" />,
  },
}
