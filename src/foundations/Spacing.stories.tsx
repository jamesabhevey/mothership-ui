import type { Meta, StoryObj } from '@storybook/react-vite'
import { Group, Page, useToken } from '../docs/parts'

const meta = {
  title: 'Foundations/Spacing & Sizing',
  tags: ['!autodocs'],
  parameters: { controls: { disable: true }, layout: 'fullscreen', options: { showPanel: false } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const space: Array<[string, string, string]> = [
  // [figma, css var, tailwind equivalent]
  ['space/0', '--space-0', 'p-0 / gap-0'],
  ['space/4', '--space-4', 'p-1 / gap-1'],
  ['space/8', '--space-8', 'p-2 / gap-2'],
  ['space/12', '--space-12', 'p-3 / gap-3'],
  ['space/16', '--space-16', 'p-4 / gap-4'],
  ['space/20', '--space-20', 'p-5 / gap-5'],
  ['space/24', '--space-24', 'p-6 / gap-6'],
  ['space/40', '--space-40', 'p-10 / gap-10'],
  ['space/48', '--space-48', 'p-12 / gap-12'],
  ['space/64', '--space-64', 'p-16 / gap-16'],
]

const sizes: Array<[string, string, string]> = [
  ['size/control/sm', '--size-control-sm', 'h-8 — below the 44px touch target'],
  ['size/control/md', '--size-control-md', 'h-10'],
  ['size/control/lg', '--size-control-lg', 'h-12'],
  ['size/control/min-target', '--size-control-min-target', 'minimum touch target'],
  ['size/appbar', '--size-appbar', 'h-16'],
  ['size/button/min-width/sm', '--size-button-min-width-sm', 'min-w-20 — loading state'],
  ['size/button/min-width/md', '--size-button-min-width-md', 'min-w-24 — loading state'],
  ['size/button/min-width/lg', '--size-button-min-width-lg', 'min-w-28 — loading state'],
]

const icons: Array<[string, string, string]> = [
  ['size/icon/16', '--size-icon-16', 'size-4'],
  ['size/icon/20', '--size-icon-20', 'size-5'],
  ['size/icon/24', '--size-icon-24', 'size-6'],
  ['size/icon/32', '--size-icon-32', 'size-8'],
]

function Bar({ figma, css, note }: { figma: string; css: string; note: string }) {
  const value = useToken(css)
  return (
    <li className="flex items-center gap-4">
      <span className="w-44 shrink-0 text-label-md text-text-primary">{figma}</span>
      <span className="w-14 shrink-0 font-mono text-caption-md text-text-secondary">
        {value || '—'}
      </span>
      <span
        className="h-4 shrink-0 rounded-sm bg-action-primary-default"
        style={{ width: `max(2px, var(${css}))` }}
        aria-hidden
      />
      <span className="font-mono text-caption-md text-text-muted">{note}</span>
    </li>
  )
}

function Box({ figma, css, note }: { figma: string; css: string; note: string }) {
  const value = useToken(css)
  return (
    <li className="flex items-center gap-4">
      <span className="w-44 shrink-0 text-label-md text-text-primary">{figma}</span>
      <span className="w-14 shrink-0 font-mono text-caption-md text-text-secondary">
        {value || '—'}
      </span>
      <span
        className="shrink-0 rounded-sm border border-border-default bg-bg-subtle"
        style={{ width: `var(${css})`, height: `var(${css})` }}
        aria-hidden
      />
      <span className="font-mono text-caption-md text-text-muted">{note}</span>
    </li>
  )
}

export const SpacingAndSizing: Story = {
  name: 'Spacing & Sizing',
  render: () => (
    <Page
      title="Spacing & Sizing"
      intro={
        <>
          Figma's <code>space/N</code> tokens are pixel-named, and every step already lands on
          Tailwind's 4px grid — so components use stock utilities and <code>p-4</code> <em>is</em>{' '}
          <code>space/16</code>. The raw variables are published on <code>:root</code> for anyone
          consuming the tokens outside Tailwind or cross-checking against Figma.
        </>
      }
    >
      <Group name="Spacing scale">
        <ul className="flex flex-col gap-3">
          {space.map(([figma, css, note]) => (
            <Bar key={css} figma={figma} css={css} note={note} />
          ))}
        </ul>
      </Group>

      <Group name="Control heights">
        <ul className="flex flex-col gap-3">
          {sizes.map(([figma, css, note]) => (
            <Bar key={css} figma={figma} css={css} note={note} />
          ))}
        </ul>
      </Group>

      <Group name="Icon sizes">
        <ul className="flex flex-col gap-3">
          {icons.map(([figma, css, note]) => (
            <Box key={css} figma={figma} css={css} note={note} />
          ))}
        </ul>
        <p className="max-w-[80ch] text-[14px]/6 text-text-primary">
          Icons only ever render at these four steps. Size comes from the parent slot, never from
          the glyph.
        </p>
      </Group>
    </Page>
  ),
}
