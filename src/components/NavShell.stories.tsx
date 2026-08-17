import type { Meta, StoryObj } from '@storybook/react-vite'
import { NavShell } from './NavShell'
import { AppBar } from './AppBar'
import { Banner } from './Banner'
import { Button } from './Button'
import { Divider } from './Divider'
import { IconButton } from './IconButton'
import { ListItem } from './ListItem'
import { ChevronLeft, ChevronRight, EllipsisVertical } from './icons'

const meta = {
  title: 'Components/Layout/NavShell',
  component: NavShell,
  args: { children: null },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof NavShell>

export default meta
type Story = StoryObj<typeof meta>

/**
 * `device` constrains the shell to the 390×844 iPhone reference frame the
 * Figma component uses. The app bar stays fixed while the content scrolls.
 */
export const Device: Story = {
  args: {
    device: true,
    appBar: (
      <AppBar
        centred
        title="Select service"
        leadingAction={
          <IconButton variant="tertiary" label="Back" icon={<ChevronLeft size={16} strokeWidth={2} />} />
        }
        trailingAction={
          <IconButton
            variant="tertiary"
            label="More options"
            icon={<EllipsisVertical size={16} strokeWidth={2} />}
          />
        }
      />
    ),
    children: (
      <div className="flex flex-col gap-4 p-4">
        <Banner intent="info" title="Two slots left today" />
        <div className="overflow-hidden rounded-md border border-border-subtle">
          <ListItem
            as="button"
            title="Haircut and finish"
            subtitle="45 minutes · £38"
            trailingIcon={<ChevronRight size={16} strokeWidth={2} />}
          />
          <Divider />
          <ListItem
            as="button"
            title="Beard trim"
            subtitle="20 minutes · £15"
            trailingIcon={<ChevronRight size={16} strokeWidth={2} />}
          />
          <Divider />
          <ListItem
            as="button"
            title="Wash and blow dry"
            subtitle="30 minutes · £24"
            trailingIcon={<ChevronRight size={16} strokeWidth={2} />}
          />
        </div>
        <Button size="lg" className="w-full">
          Continue
        </Button>
      </div>
    ),
  },
}
