import type { Meta, StoryObj } from '@storybook/react-vite'
import { CardGrid } from './CardGrid'
import { Card } from './Card'
import { Button } from './Button'

const meta = {
  title: 'Components/Surfaces/CardGrid',
  component: CardGrid,
} satisfies Meta<typeof CardGrid>

export default meta
type Story = StoryObj<typeof meta>

/** Resize the canvas to watch the cards reflow on `minCardWidth`. */
export const ThreeCards: Story = {
  render: (args) => (
    <CardGrid {...args}>
      <Card
        title="Outlined card"
        body="One or two sentences describing what this card contains and why it matters."
        actions={<Button size="md">Open</Button>}
      />
      <Card
        variant="elevated"
        title="Elevated card"
        body="Elevated cards rely on shadow alone, which disappears in high contrast mode."
        actions={
          <Button size="md" variant="secondary">
            Open
          </Button>
        }
      />
      <Card
        interactive
        title="Interactive card"
        body="Hover applies only when the whole card is clickable."
        media={<div className="h-[140px] w-full bg-surface-media" />}
      />
    </CardGrid>
  ),
}
