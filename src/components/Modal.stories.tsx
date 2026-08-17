import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Modal } from './Modal'
import { Button } from './Button'

const meta = {
  title: 'Components/Content Presentation/Modal',
  component: Modal,
  args: { open: true, onClose: () => {}, title: 'Modal title' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Opened from a trigger so the focus behaviour is exercisable: focus moves
 * into the dialog, Tab is trapped inside it, Escape dismisses, and focus
 * returns to the button that opened it.
 */
export const DeleteConfirmation: Story = {
  parameters: { controls: { exclude: ['open', 'onClose'] } },
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Modal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          title="Delete this booking?"
          primaryAction={
            <Button variant="destructive" onClick={() => setOpen(false)}>
              Delete
            </Button>
          }
          secondaryAction={
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          }
        >
          <p className="text-body-md text-text-secondary">
            The customer will be notified and the slot will be released. This cannot be undone.
          </p>
        </Modal>
      </>
    )
  },
}
