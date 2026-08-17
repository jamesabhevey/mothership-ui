import type { Meta, StoryObj } from '@storybook/react-vite'
import { FieldHelperText } from './FieldHelperText'

const meta = {
  title: 'Components/Form Elements/Field Text/Field Helper Text',
  component: FieldHelperText,
  args: { children: 'As it appears on your passport' },
} satisfies Meta<typeof FieldHelperText>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** The alert glyph means the error is never carried by colour alone. */
export const Error: Story = {
  args: { error: true, children: 'Enter a reference in the form AB-123.' },
}

export const Disabled: Story = {
  args: { disabled: true, children: 'Helper text' },
}
