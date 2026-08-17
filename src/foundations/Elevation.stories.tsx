import type { Meta, StoryObj } from '@storybook/react-vite'
import { Group, Page, useToken } from './parts'

const meta = {
  title: 'Foundations/Radius, Border & Elevation',
  tags: ['!autodocs'],
  parameters: { controls: { disable: true }, layout: 'fullscreen', options: { showPanel: false } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const radii: Array<[string, string, string, string]> = [
  // [figma, css var, tailwind, used by]
  ['radius/sm', '--radius-sm', 'rounded-sm', 'Menu items, tooltips, card media'],
  ['radius/md', '--radius-md', 'rounded-md', 'Buttons, inputs, banners, menus'],
  ['radius/lg', '--radius-lg', 'rounded-lg', 'Cards'],
  ['radius/xl', '--radius-xl', 'rounded-xl', 'Modal dialog'],
  ['radius/full', '--radius-full', 'rounded-full', 'Badges, avatars, switch, radio'],
]

const borders: Array<[string, string, string]> = [
  ['border/width/sm', '--border-width-sm', 'Default borders and dividers'],
  ['border/width/md', '--border-width-md', 'Error state on inputs, selected radio'],
]

const elevations: Array<[string, string, string]> = [
  ['elevation/sm', 'shadow-elevation-sm', 'Elevated card at rest'],
  ['elevation/md', 'shadow-elevation-md', 'Menu surface, elevated card on hover'],
  ['elevation/lg', 'shadow-elevation-lg', 'Modal dialog'],
]

function RadiusSample({
  figma,
  css,
  cls,
  usedBy,
}: {
  figma: string
  css: string
  cls: string
  usedBy: string
}) {
  const value = useToken(css)
  return (
    <li className="flex items-center gap-4">
      <span
        className={`size-16 shrink-0 border border-border-default bg-bg-subtle ${cls}`}
        aria-hidden
      />
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-label-md text-text-primary">{figma}</span>
        <span className="font-mono text-caption-md text-text-secondary">
          {cls} · {value || '—'}
        </span>
        <span className="text-caption-md text-text-muted">{usedBy}</span>
      </div>
    </li>
  )
}

export const RadiusBorderElevation: Story = {
  name: 'Radius, Border & Elevation',
  render: () => (
    <Page
      title="Radius, Border & Elevation"
      intro={
        <>
          Corner radius, stroke width and the three drop shadows. Elevation is a shadow of{' '}
          <code>color/shadow/default</code>, which is a 16% black — it darkens whatever sits
          beneath rather than assuming a white page.
        </>
      }
    >
      <Group name="Radius">
        <ul className="flex flex-col gap-4">
          {radii.map(([figma, css, cls, usedBy]) => (
            <RadiusSample key={css} figma={figma} css={css} cls={cls} usedBy={usedBy} />
          ))}
        </ul>
      </Group>

      <Group name="Border width">
        <ul className="flex flex-col gap-4">
          {borders.map(([figma, css, usedBy]) => (
            <li key={css} className="flex items-center gap-4">
              <span
                className="h-16 w-16 shrink-0 rounded-md border-border-default bg-bg-subtle"
                style={{ borderStyle: 'solid', borderWidth: `var(${css})` }}
                aria-hidden
              />
              <div className="flex flex-col gap-0.5">
                <span className="text-label-md text-text-primary">{figma}</span>
                <span className="font-mono text-caption-md text-text-secondary">{css}</span>
                <span className="text-caption-md text-text-muted">{usedBy}</span>
              </div>
            </li>
          ))}
        </ul>
      </Group>

      <Group name="Elevation">
        <ul className="flex flex-wrap gap-6 pb-2">
          {elevations.map(([figma, cls, usedBy]) => (
            <li key={cls} className="flex flex-col gap-3">
              <span
                className={`grid size-28 place-items-center rounded-lg bg-surface-raised ${cls}`}
                aria-hidden
              />
              <div className="flex flex-col gap-0.5">
                <span className="text-label-md text-text-primary">{figma}</span>
                <span className="font-mono text-caption-md text-text-secondary">{cls}</span>
                <span className="max-w-40 text-caption-md text-text-muted">{usedBy}</span>
              </div>
            </li>
          ))}
        </ul>
        <p className="max-w-[80ch] text-[14px]/6 text-text-primary">
          Shadow disappears in high contrast mode, so never let it be the only thing separating a
          surface from the page. That is why Card defaults to <code>outlined</code> rather than{' '}
          <code>elevated</code>.
        </p>
      </Group>
    </Page>
  ),
}
