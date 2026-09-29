import type { Meta, StoryObj } from '@storybook/react-vite'
import { Illustration } from './Illustration'
import { Card } from './Card'

/**
 * The library's own illustration, the same image the Figma component carries,
 * exported from it rather than redrawn, so the two cannot disagree.
 *
 * 1024px wide at 140KB. It renders around 320px here and 336px in Figma, so
 * this has headroom for a 2x display without shipping the 3.4MB original.
 *
 * Referenced relatively so it resolves under the subpath GitHub Pages serves
 * the built site from. It is 4:3, which is why every ratio has something to
 * crop: 16:9 loses the top and bottom, 1:1 loses the sides.
 */
const placeholder = './illustration-placeholder.jpg'

const meta = {
  title: 'Assets/Illustration',
  component: Illustration,
  args: { src: placeholder, alt: '' },
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
  name: '16:9',
  args: { ratio: '16:9' },
}

export const ThreeTwo: Story = {
  name: '3:2',
  args: { ratio: '3:2' },
}

export const FourThree: Story = {
  name: '4:3',
  args: { ratio: '4:3' },
}

export const Square: Story = {
  name: '1:1',
  args: { ratio: '1:1' },
}

export const NoImage: Story = {
  name: 'No image',
  args: { ratio: '16:9', src: undefined },
  parameters: {
    docs: {
      description: {
        story:
          'With no `src` the box holds its shape and shows `surface/media`. This is the loading state and the state where a supplied image fails. Deliberately empty rather than showing the library illustration, which would look like content somebody chose.',
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
