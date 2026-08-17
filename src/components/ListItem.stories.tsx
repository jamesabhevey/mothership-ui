import type { Meta, StoryObj } from '@storybook/react-vite'
import { ListItem } from './ListItem'
import { Divider } from './Divider'
import { Switch } from './Switch'
import { ChevronRight, User } from './icons'

const meta = {
  title: 'Components/Surfaces/ListItem',
  component: ListItem,
  args: {
    title: 'Haircut and finish',
    subtitle: '45 minutes · £38',
    leadingIcon: <User size={24} strokeWidth={2} />,
    trailingIcon: <ChevronRight size={16} strokeWidth={2} />,
  },
  decorators: [
    (Story) => (
      <div className="w-96 overflow-hidden rounded-md border border-border-subtle">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ListItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { as: 'button' },
}

/** Marks the current row in a navigation list. Not the same as checked. */
export const Selected: Story = {
  args: { as: 'button', selected: true, title: 'Colour consultation', subtitle: '20 minutes · Free' },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    title: 'Restyle',
    subtitle: 'Not available this week',
    trailingIcon: undefined,
  },
}

/** `trailing` takes free-form content, unlike the 16px `trailingIcon` slot. */
export const WithSwitch: Story = {
  args: {
    title: 'Push notifications',
    subtitle: 'On this device',
    leadingIcon: undefined,
    trailingIcon: undefined,
    trailing: <Switch defaultChecked className="py-0" />,
  },
}

/** Rows are separated by a Divider rather than a border on the row itself. */
export const List: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <>
      <ListItem
        as="button"
        title="Haircut and finish"
        subtitle="45 minutes · £38"
        leadingIcon={<User size={24} strokeWidth={2} />}
        trailingIcon={<ChevronRight size={16} strokeWidth={2} />}
      />
      <Divider />
      <ListItem
        as="button"
        selected
        title="Colour consultation"
        subtitle="20 minutes · Free"
        leadingIcon={<User size={24} strokeWidth={2} />}
        trailingIcon={<ChevronRight size={16} strokeWidth={2} />}
      />
      <Divider />
      <ListItem
        disabled
        title="Restyle"
        subtitle="Not available this week"
        leadingIcon={<User size={24} strokeWidth={2} />}
      />
    </>
  ),
}
