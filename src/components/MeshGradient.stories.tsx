import type { Meta, StoryObj } from '@storybook/react-vite'
import { MeshGradient } from './MeshGradient'
import { Button } from './Button'

const meta = {
  title: 'Assets/Mesh Gradient',
  component: MeshGradient,
  argTypes: {
    variant: { control: 'inline-radio', options: ['vivid', 'subtle'] },
  },
  // The Figma swatch is 1072 x 480; this keeps the same ratio so the two can
  // be compared side by side.
  args: { className: 'aspect-[1072/480] rounded-xl' },
} satisfies Meta<typeof MeshGradient>

export default meta
type Story = StoryObj<typeof meta>

export const Vivid: Story = {
  args: { variant: 'vivid' },
}

export const Subtle: Story = {
  args: { variant: 'subtle' },
}

/*
 * The two variants carrying content, which is what they are for. On vivid the
 * text follows text/on-brand and the button is secondary: the primary button
 * is brand/500, too close to the field to stand out from it.
 */
export const VividHero: Story = {
  name: 'Vivid, with content',
  args: {
    variant: 'vivid',
    className: 'rounded-xl',
    children: (
      <div className="flex max-w-xl flex-col items-start gap-4 px-10 py-16">
        <h2 className="text-heading-lg">Ship the design system, not a screenshot of it</h2>
        <p className="text-body-lg">Every component reads its values from the Figma variables.</p>
        <Button variant="secondary">Get started</Button>
      </div>
    ),
  },
}

export const SubtleHero: Story = {
  name: 'Subtle, with content',
  args: {
    variant: 'subtle',
    className: 'rounded-xl',
    children: (
      <div className="flex max-w-xl flex-col items-start gap-4 px-10 py-16">
        <h2 className="text-heading-lg">Nothing booked yet</h2>
        <p className="text-body-lg text-text-secondary">Your upcoming sessions will show up here.</p>
        <Button>Book a session</Button>
      </div>
    ),
  },
}
