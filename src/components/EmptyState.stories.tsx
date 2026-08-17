import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmptyState } from './EmptyState'
import { Button } from './Button'
import { Search } from './icons'

const meta = {
  title: 'Surfaces/EmptyState',
  component: EmptyState,
  args: { title: 'Nothing here yet' },
  decorators: [
    (Story) => (
      <div className="w-[640px] rounded-md border border-border-subtle">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

/** The description says what to do next, not just that nothing is here. */
export const NoResults: Story = {
  args: {
    icon: <Search size={32} strokeWidth={2} />,
    title: 'No bookings match those filters',
    description: 'Try widening the date range, or clear the service filter to see everything.',
    action: <Button variant="secondary">Clear filters</Button>,
  },
}
