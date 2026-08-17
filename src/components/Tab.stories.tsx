import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tab, Tabs } from './Tabs'

const meta = {
  title: 'Components/Layout/Tab',
  component: Tab,
  args: { children: 'Overview' },
  decorators: [
    (Story) => (
      <Tabs label="Example tabs" className="w-[320px]">
        <Story />
      </Tabs>
    ),
  ],
} satisfies Meta<typeof Tab>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: 'Upcoming' },
}

/** Active pairs the 2px indicator with the link colour, never colour alone. */
export const Active: Story = {
  args: { active: true },
}

export const Disabled: Story = {
  args: { disabled: true, children: 'Archived' },
}
