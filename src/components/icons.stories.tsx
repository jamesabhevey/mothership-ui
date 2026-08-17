import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon, iconNames } from './icons'

const meta = {
  title: 'Primitives/Icon',
  component: Icon,
  args: { name: 'search', size: 24 },
  argTypes: {
    name: { control: 'select', options: iconNames },
    size: { control: 'inline-radio', options: [16, 20, 24, 32] },
  },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/**
 * The whole set. These are Lucide glyphs on a 24px grid with a 2px round
 * stroke — the same artwork the Figma Icon page is drawn from.
 *
 * The Icon component has no showcase section of its own; it appears inside the
 * other components, so this gallery stands in for a variant list.
 */
export const Gallery: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4">
      {iconNames.map((name) => (
        <li key={name} className="flex flex-col items-center gap-2 rounded-md border border-border-subtle p-3">
          <Icon name={name} size={24} className="text-icon-default" />
          <span className="text-caption-md text-text-secondary">{name}</span>
        </li>
      ))}
    </ul>
  ),
}
