import type { Meta, StoryObj } from '@storybook/react-vite'
import { Divider } from './Divider'

const meta = {
  title: 'Components/Content Presentation/Divider',
  component: Divider,
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
  },
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
  render: (args) => (
    <div className="flex w-64 flex-col gap-2">
      <span className="text-body-sm text-text-secondary">Above</span>
      <Divider {...args} />
      <span className="text-body-sm text-text-secondary">Below</span>
    </div>
  ),
}

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => (
    <div className="flex h-10 items-center gap-3">
      <span className="text-body-sm text-text-secondary">Left</span>
      <Divider {...args} />
      <span className="text-body-sm text-text-secondary">Right</span>
    </div>
  ),
}
