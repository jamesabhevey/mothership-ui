import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsRowGroup } from './SettingsRowGroup'
import { ListItem } from './ListItem'
import { Switch } from './Switch'
import { ChevronRight } from './icons'

const meta = {
  title: 'Components/Surfaces/SettingsRowGroup',
  component: SettingsRowGroup,
  args: { label: 'Notifications', children: null },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SettingsRowGroup>

export default meta
type Story = StoryObj<typeof meta>

/** A toggle row and a row that opens a sub-screen, divided automatically. */
export const Notifications: Story = {
  args: {
    label: 'Notifications',
    children: (
      <>
        <ListItem
          title="Push notifications"
          subtitle="On this device"
          trailing={<Switch defaultChecked className="py-0" />}
        />
        <ListItem
          as="button"
          title="Email digest"
          subtitle="Weekly"
          trailingIcon={<ChevronRight size={16} strokeWidth={2} />}
        />
      </>
    ),
  },
}
