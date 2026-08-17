import type { Meta, StoryObj } from '@storybook/react-vite'
import { Radio } from './Radio'

const meta = {
  title: 'Components/Form Elements/Radio',
  component: Radio,
  args: { name: 'plan', children: 'Monthly' },
} satisfies Meta<typeof Radio>

export default meta
type Story = StoryObj<typeof meta>

export const Selected: Story = {
  args: { defaultChecked: true },
}

export const Unselected: Story = {
  args: { children: 'Annually' },
}

export const Disabled: Story = {
  args: { disabled: true, children: 'Custom' },
}

/**
 * How the showcase uses them: radios share a group label, so they belong in a
 * `fieldset` with a `legend`. Arrow keys move between them rather than Tab.
 */
export const Group: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <fieldset className="flex flex-col">
      <legend className="text-label-md text-text-primary">Plan</legend>
      <div className="flex flex-wrap items-center gap-6">
        <Radio name="plan-group" value="monthly" defaultChecked>
          Monthly
        </Radio>
        <Radio name="plan-group" value="annually">
          Annually
        </Radio>
        <Radio name="plan-group" value="custom" disabled>
          Custom
        </Radio>
      </div>
    </fieldset>
  ),
}
