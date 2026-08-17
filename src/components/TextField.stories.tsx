import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextField } from './TextField'
import { Search } from './icons'

const meta = {
  title: 'Forms/TextField',
  component: TextField,
  args: { label: 'Full name', placeholder: 'Placeholder' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { helperText: 'As it appears on your passport', required: true },
}

export const WithLeadingIcon: Story = {
  args: {
    label: 'Search',
    size: 'md',
    placeholder: 'Search records',
    leadingIcon: <Search size={16} strokeWidth={2} />,
  },
}

/** Figma's `Filled` state: a value present rather than a placeholder. */
export const Filled: Story = {
  args: {
    label: 'Email address',
    size: 'lg',
    defaultValue: 'james@yld.io',
    helperText: 'We only use this for receipts',
  },
}

/** The 2px danger border is always paired with wording in the helper text. */
export const Error: Story = {
  args: {
    label: 'Reference',
    defaultValue: 'XX-000',
    error: 'Enter a reference in the form AB-123.',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Locked field',
    defaultValue: 'Not editable',
    helperText: 'Helper text',
    disabled: true,
  },
}
