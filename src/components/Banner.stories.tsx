import type { Meta, StoryObj } from '@storybook/react-vite'
import { Banner } from './Banner'

const meta = {
  title: 'Surfaces/Banner',
  component: Banner,
  args: {
    title: 'Banner title',
    body: 'Supporting text explaining what happened and what to do next.',
    onClose: () => {},
  },
  argTypes: {
    intent: { control: 'inline-radio', options: ['info', 'success', 'warning', 'danger'] },
  },
  decorators: [
    (Story) => (
      <div className="w-[480px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Banner>

export default meta
type Story = StoryObj<typeof meta>

export const Info: Story = {
  args: {
    intent: 'info',
    title: 'Scheduled maintenance',
    body: 'The service will be read only on Sunday from 02:00 to 04:00 UTC.',
  },
}

export const Success: Story = {
  args: {
    intent: 'success',
    title: 'Export finished',
    body: 'Your download will start automatically.',
  },
}

export const Warning: Story = {
  args: {
    intent: 'warning',
    title: 'Card expiring soon',
    body: 'Update your payment details before 30 September to avoid interruption.',
  },
}

/**
 * `danger` renders as `role="alert"`. Use it only for genuine failures —
 * overuse trains users to ignore it. Shown without a dismiss control, as a
 * validation summary that should stay until it is resolved.
 */
export const Danger: Story = {
  args: {
    intent: 'danger',
    title: 'Two fields need attention',
    body: 'Reference and region are not valid. Correct them and submit again.',
    onClose: undefined,
  },
}
