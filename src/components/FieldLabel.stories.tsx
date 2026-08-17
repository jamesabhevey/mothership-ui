import type { Meta, StoryObj } from '@storybook/react-vite'
import { FieldLabel } from './FieldLabel'

const meta = {
  title: 'Components/Forms/FieldLabel',
  component: FieldLabel,
  args: { label: 'Full name' },
} satisfies Meta<typeof FieldLabel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** The asterisk, as used by the required fields on the showcase form. */
export const Required: Story = {
  args: { required: true },
}

/** `Supporting=Below` in Figma: guidance that is not an error or format hint. */
export const WithSupporting: Story = {
  args: { supporting: 'As it appears on your passport' },
}

/** The parent field drives this when the input is disabled. */
export const Disabled: Story = {
  args: { label: 'Locked field', disabled: true },
}
