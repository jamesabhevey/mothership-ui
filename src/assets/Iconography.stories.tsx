import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon, iconNames } from '../components/icons'
import { Group, Page } from '../docs/parts'

const meta = {
  title: 'Assets/Iconography',
  tags: ['!autodocs'],
  parameters: { controls: { disable: true }, layout: 'fullscreen', options: { showPanel: false } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Iconography: Story = {
  render: () => (
    <Page
      title="Iconography"
      intro={
        <>
          The set is Lucide, drawn on a 24px grid with a 2px round stroke — the same artwork the
          Figma Icon page is drawn from, used from its source rather than re-exported as SVG.
          <br />
          <br />
          Size comes from the parent slot and is only ever 16, 20, 24 or 32. Colour comes from the
          stroke, which inherits <code>currentColor</code>, so the surrounding component controls
          it. Decorative icons are hidden from assistive technology; an icon that carries meaning
          needs a label beside it.
        </>
      }
    >
      <Group name={`The set — ${iconNames.length} glyphs`}>
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(128px,1fr))] gap-3">
          {iconNames.map((name) => (
            <li
              key={name}
              className="flex flex-col items-center gap-2 rounded-md border border-border-subtle p-4"
            >
              <Icon name={name} size={24} className="text-icon-default" />
              <span className="text-center font-mono text-caption-md text-text-secondary">
                {name}
              </span>
            </li>
          ))}
        </ul>
      </Group>

      <Group name="Sizes">
        <ul className="flex flex-wrap items-end gap-8">
          {([16, 20, 24, 32] as const).map((size) => (
            <li key={size} className="flex flex-col items-center gap-2">
              <Icon name="search" size={size} className="text-icon-default" />
              <span className="font-mono text-caption-md text-text-secondary">{size}px</span>
            </li>
          ))}
        </ul>
      </Group>
    </Page>
  ),
}
