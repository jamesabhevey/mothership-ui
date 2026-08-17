import type { Meta, StoryObj } from '@storybook/react-vite'
import { FormSection } from './FormSection'
import { TextField } from './TextField'

const meta = {
  title: 'Forms/FormSection',
  component: FormSection,
  args: { title: 'Contact details', children: null },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormSection>

export default meta
type Story = StoryObj<typeof meta>

/** Field spacing is 20px, which keeps each label attached to its own input. */
export const ContactDetails: Story = {
  args: {
    title: 'Contact details',
    description: 'How we reach you about this booking',
    children: (
      <>
        <TextField label="Full name" placeholder="Placeholder" required />
        <TextField label="Email address" placeholder="you@example.com" required />
        <TextField label="Phone" placeholder="Optional" />
      </>
    ),
  },
}
