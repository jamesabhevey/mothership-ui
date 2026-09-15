import type { Meta, StoryObj } from '@storybook/react-vite'
import { Illustration } from './Illustration'
import { Card } from './Card'

/**
 * A stand-in, not the artwork.
 *
 * Served from public/ rather than written inline, so the hexes in it are not
 * sitting in a component file where the colour-literal contract check reads
 * them as styling — which is exactly what it did when they were. Relative, so
 * it resolves under the subpath GitHub Pages serves the built site from.
 *
 * The real illustrations live in the Figma Illustration set. Pass your own
 * `src`; this component ships no artwork.
 */
const sample = './illustration-sample.svg'

const meta = {
  title: 'Assets/Illustration',
  component: Illustration,
  args: { src: sample, alt: '' },
  argTypes: {
    ratio: { control: 'inline-radio', options: ['16:9', '3:2', '4:3', '1:1'] },
    loading: { control: 'inline-radio', options: ['lazy', 'eager'] },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Illustration>

export default meta
type Story = StoryObj<typeof meta>

export const Widescreen: Story = {
  args: { ratio: '16:9' },
}

export const ThreeTwo: Story = {
  name: 'Three by two',
  args: { ratio: '3:2' },
}

export const FourThree: Story = {
  name: 'Four by three',
  args: { ratio: '4:3' },
}

export const Square: Story = {
  args: { ratio: '1:1' },
}

export const Placeholder: Story = {
  args: { ratio: '16:9', src: undefined },
  parameters: {
    docs: {
      description: {
        story:
          'With no `src` the box holds its shape and shows `surface/media`. This is the loading state and the empty state, and it is the same fallback the Figma component has.',
      },
    },
  },
}

export const InACard: Story = {
  name: 'In a card',
  args: { ratio: '16:9' },
  parameters: {
    docs: {
      description: {
        story:
          'Card provides the slot and rounds it; Illustration provides the shape. Neither needs to know about the other, which is why Illustration has square corners of its own.',
      },
    },
  },
  render: (args) => (
    <Card
      variant="outlined"
      media={<Illustration {...args} />}
      title="Scheduled maintenance"
      body="Read only on Sunday, 02:00 to 04:00."
    />
  ),
}
