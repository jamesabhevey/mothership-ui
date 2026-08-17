import type { Meta, StoryObj } from '@storybook/react-vite'
import { Select } from './Select'

const meta = {
  title: 'Components/Form Elements/Select',
  component: Select,
  args: {
    label: 'Billing period',
    children: (
      <>
        <option value="monthly">Monthly</option>
        <option value="quarterly">Quarterly</option>
        <option value="annually">Annually</option>
      </>
    ),
  },
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
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { defaultValue: 'monthly', helperText: 'Change this at any time' },
}

export const Error: Story = {
  args: {
    label: 'Region',
    size: 'md',
    error: 'Choose a region to continue.',
    children: (
      <>
        <option value="">Choose an option</option>
        <option value="uk">United Kingdom</option>
        <option value="eu">European Union</option>
      </>
    ),
  },
}

export const Disabled: Story = {
  args: {
    label: 'Currency',
    disabled: true,
    defaultValue: 'gbp',
    helperText: 'Set by your organisation',
    children: <option value="gbp">Pound sterling</option>,
  },
}
