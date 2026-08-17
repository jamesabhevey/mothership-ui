import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from './Checkbox'

const meta = {
  title: 'Components/Form Elements/Checkbox',
  component: Checkbox,
  args: { children: 'Email me about releases' },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Checked: Story = {
  args: { defaultChecked: true },
}

/** Marks a parent whose children are only partly selected. */
export const Indeterminate: Story = {
  args: { indeterminate: true, children: 'Some children selected' },
}

export const Disabled: Story = {
  args: { disabled: true, children: 'Unavailable' },
}

export const DisabledChecked: Story = {
  args: { disabled: true, defaultChecked: true, children: 'Locked on' },
}
