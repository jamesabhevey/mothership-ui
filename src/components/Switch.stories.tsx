import type { Meta, StoryObj } from '@storybook/react-vite'
import { Switch } from './Switch'

const meta = {
  title: 'Forms/Switch',
  component: Switch,
  args: { children: 'Push notifications' },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const On: Story = {
  args: { defaultChecked: true },
}

export const Disabled: Story = {
  args: { disabled: true, children: 'Unavailable' },
}

export const DisabledOn: Story = {
  args: { disabled: true, defaultChecked: true, children: 'Locked on' },
}
