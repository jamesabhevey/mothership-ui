import type { Meta, StoryObj } from '@storybook/react-vite'
import { Group, Page, useToken } from '../docs/parts'

const meta = {
  title: 'Foundations/Typography',
  tags: ['!autodocs'],
  parameters: { controls: { disable: true }, layout: 'fullscreen', options: { showPanel: false } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const scale: Array<[string, Array<[string, string, string]>]> = [
  // [group, [figma name, tailwind class, css var stem]]
  [
    'Display',
    [
      ['type/display/lg', 'text-display-lg', '--text-display-lg'],
      ['type/display/md', 'text-display-md', '--text-display-md'],
      ['type/display/sm', 'text-display-sm', '--text-display-sm'],
    ],
  ],
  [
    'Heading',
    [
      ['type/heading/lg', 'text-heading-lg', '--text-heading-lg'],
      ['type/heading/md', 'text-heading-md', '--text-heading-md'],
      ['type/heading/sm', 'text-heading-sm', '--text-heading-sm'],
    ],
  ],
  [
    'Body',
    [
      ['type/body/lg', 'text-body-lg', '--text-body-lg'],
      ['type/body/md', 'text-body-md', '--text-body-md'],
      ['type/body/sm', 'text-body-sm', '--text-body-sm'],
    ],
  ],
  [
    'Label',
    [
      ['type/label/lg', 'text-label-lg', '--text-label-lg'],
      ['type/label/md', 'text-label-md', '--text-label-md'],
      ['type/label/sm', 'text-label-sm', '--text-label-sm'],
    ],
  ],
  [
    'Caption',
    [
      ['type/caption/lg', 'text-caption-lg', '--text-caption-lg'],
      ['type/caption/md', 'text-caption-md', '--text-caption-md'],
      ['type/caption/sm', 'text-caption-sm', '--text-caption-sm'],
    ],
  ],
]

function Specimen({ figma, cls, stem }: { figma: string; cls: string; stem: string }) {
  const size = useToken(stem)
  const lineHeight = useToken(`${stem}--line-height`)
  const weight = useToken(`${stem}--font-weight`)
  const tracking = useToken(`${stem}--letter-spacing`)

  return (
    <li className="flex flex-col gap-2 border-b border-border-subtle pb-5 last:border-0">
      <p className={`${cls} text-text-primary`}>The quick brown fox</p>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="text-label-md text-text-primary">{figma}</span>
        <span className="font-mono text-caption-md text-text-secondary">{cls}</span>
        <span className="font-mono text-caption-md text-text-muted">
          {size || '—'} / {lineHeight || '—'} · weight {weight || '—'} · tracking {tracking || '—'}
        </span>
      </div>
    </li>
  )
}

export const Typography: Story = {
  render: () => (
    <Page
      title="Typography"
      intro={
        <>
          One family — Inter — across five tiers. Sizes, line heights, weights and letter spacing
          are read live from the tokens.
          <br />
          <br />
          <strong>Label</strong> is for controls and form labels, <strong>body</strong> for reading
          text, <strong>caption</strong> for helper and metadata text. Label and caption are Medium
          (500); body is Regular (400); headings are Semi Bold (600).
        </>
      }
    >
      {scale.map(([group, rows]) => (
        <Group key={group} name={group}>
          <ul className="flex flex-col gap-5">
            {rows.map(([figma, cls, stem]) => (
              <Specimen key={stem} figma={figma} cls={cls} stem={stem} />
            ))}
          </ul>
        </Group>
      ))}

      <Group name="Using the display tier">
        <p className="max-w-[80ch] text-[14px]/6 text-text-primary">
          Per the notes on the Figma styles: <code>display/lg</code> is for marketing heroes and
          empty state headlines, never dense UI. <code>display/md</code> is for page level hero
          headings. <code>display/sm</code> is the smallest display size, for screen titles on wide
          layouts. <code>caption/sm</code> fails comfortable reading at small sizes, so use it
          sparingly.
        </p>
      </Group>
    </Page>
  ),
}
