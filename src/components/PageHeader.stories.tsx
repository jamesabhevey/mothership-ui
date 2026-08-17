import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PageHeader } from './PageHeader'
import { Button } from './Button'
import { Tab, Tabs } from './Tabs'
import { Plus } from './icons'

const meta = {
  title: 'Components/Blocks/Page Header',
  component: PageHeader,
  args: { title: 'Page title' },
  decorators: [
    (Story) => (
      <div className="w-[720px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PageHeader>

export default meta
type Story = StoryObj<typeof meta>

/** The title should be the only top-level heading on the page. */
export const WithTabs: Story = {
  render: (args) => {
    const [active, setActive] = useState('overview')
    return (
      <PageHeader
        {...args}
        title="Bookings"
        subtitle="Everything scheduled across your team"
        actions={<Button leadingIcon={<Plus size={16} strokeWidth={2} />}>New booking</Button>}
        tabs={
          <Tabs label="Booking views">
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
        }
      />
    )
  },
}
