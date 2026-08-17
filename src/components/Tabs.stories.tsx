import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tab, Tabs } from './Tabs'

const meta = {
  title: 'Components/Navigation/Tabs/Tabs',
  component: Tabs,
  args: { label: 'Booking views' },
  decorators: [
    (Story) => (
      <div className="w-[640px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

/** Exactly one tab is active at all times — never zero, never more than one. */
export const Default: Story = {
  render: (args) => {
    const [active, setActive] = useState('overview')
    return (
      <Tabs {...args}>
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'upcoming', label: 'Upcoming' },
          { id: 'past', label: 'Past' },
        ].map((tab) => (
          <Tab key={tab.id} active={active === tab.id} onClick={() => setActive(tab.id)}>
            {tab.label}
          </Tab>
        ))}
        <Tab disabled>Archived</Tab>
      </Tabs>
    )
  },
}
