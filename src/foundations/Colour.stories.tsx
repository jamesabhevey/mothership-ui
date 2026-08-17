import type { Meta, StoryObj } from '@storybook/react-vite'
import { Group, Page, Swatch, SwatchGrid } from '../docs/parts'

const meta = {
  title: 'Foundations/Colour',
  // A reference page rather than a component, so no generated docs page.
  tags: ['!autodocs'],
  parameters: { controls: { disable: true }, layout: 'fullscreen', options: { showPanel: false } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const groups: Array<[string, Array<[string, string]>]> = [
  [
    'Background',
    [
      ['color/bg/default', '--color-bg-default'],
      ['color/bg/subtle', '--color-bg-subtle'],
      ['color/bg/selected', '--color-bg-selected'],
      ['color/bg/inverse', '--color-bg-inverse'],
    ],
  ],
  [
    'Surface',
    [
      ['color/surface/default', '--color-surface-default'],
      ['color/surface/raised', '--color-surface-raised'],
      ['color/surface/sunken', '--color-surface-sunken'],
      ['color/surface/media', '--color-surface-media'],
      ['color/surface/overlay', '--color-surface-overlay'],
    ],
  ],
  [
    'Text',
    [
      ['color/text/primary', '--color-text-primary'],
      ['color/text/secondary', '--color-text-secondary'],
      ['color/text/muted', '--color-text-muted'],
      ['color/text/inverse', '--color-text-inverse'],
      ['color/text/on-brand', '--color-text-on-brand'],
      ['color/text/link', '--color-text-link'],
    ],
  ],
  [
    'Icon',
    [
      ['color/icon/default', '--color-icon-default'],
      ['color/icon/muted', '--color-icon-muted'],
      ['color/icon/inverse', '--color-icon-inverse'],
      ['color/icon/link', '--color-icon-link'],
    ],
  ],
  [
    'Border',
    [
      ['color/border/default', '--color-border-default'],
      ['color/border/subtle', '--color-border-subtle'],
      ['color/border/strong', '--color-border-strong'],
    ],
  ],
  [
    'Action — primary',
    [
      ['color/action/primary/default', '--color-action-primary-default'],
      ['color/action/primary/hover', '--color-action-primary-hover'],
      ['color/action/primary/pressed', '--color-action-primary-pressed'],
      ['color/action/primary/disabled', '--color-action-primary-disabled'],
    ],
  ],
  [
    'Action — secondary',
    [
      ['color/action/secondary/default', '--color-action-secondary-default'],
      ['color/action/secondary/hover', '--color-action-secondary-hover'],
      ['color/action/secondary/pressed', '--color-action-secondary-pressed'],
      ['color/action/secondary/disabled', '--color-action-secondary-disabled'],
    ],
  ],
  [
    'Action — tertiary',
    [
      ['color/action/tertiary/default', '--color-action-tertiary-default'],
      ['color/action/tertiary/hover', '--color-action-tertiary-hover'],
      ['color/action/tertiary/pressed', '--color-action-tertiary-pressed'],
      ['color/action/tertiary/disabled', '--color-action-tertiary-disabled'],
    ],
  ],
  [
    'Action — destructive',
    [
      ['color/action/destructive/default', '--color-action-destructive-default'],
      ['color/action/destructive/hover', '--color-action-destructive-hover'],
      ['color/action/destructive/pressed', '--color-action-destructive-pressed'],
      ['color/action/destructive/disabled', '--color-action-destructive-disabled'],
    ],
  ],
  [
    'Feedback — info',
    [
      ['color/feedback/info/surface', '--color-feedback-info-surface'],
      ['color/feedback/info/border', '--color-feedback-info-border'],
      ['color/feedback/info/text', '--color-feedback-info-text'],
    ],
  ],
  [
    'Feedback — success',
    [
      ['color/feedback/success/surface', '--color-feedback-success-surface'],
      ['color/feedback/success/border', '--color-feedback-success-border'],
      ['color/feedback/success/text', '--color-feedback-success-text'],
    ],
  ],
  [
    'Feedback — warning',
    [
      ['color/feedback/warning/surface', '--color-feedback-warning-surface'],
      ['color/feedback/warning/border', '--color-feedback-warning-border'],
      ['color/feedback/warning/text', '--color-feedback-warning-text'],
    ],
  ],
  [
    'Feedback — danger',
    [
      ['color/feedback/danger/surface', '--color-feedback-danger-surface'],
      ['color/feedback/danger/border', '--color-feedback-danger-border'],
      ['color/feedback/danger/text', '--color-feedback-danger-text'],
    ],
  ],
  [
    'Focus and shadow',
    [
      ['color/focus/ring', '--color-focus-ring'],
      ['color/shadow/default', '--color-shadow-default'],
    ],
  ],
]

export const Colour: Story = {
  render: () => (
    <Page
      title="Colour"
      intro={
        <>
          Every colour in the system, read live from the CSS custom properties. Names map one to
          one onto the Figma Semantic collection: <code>color/action/primary/default</code> becomes{' '}
          <code>--color-action-primary-default</code> and the Tailwind utility{' '}
          <code>bg-action-primary-default</code>.
          <br />
          <br />
          Intent colour is decoration. Text has to carry the meaning on its own, so never signal an
          error with <code>danger</code> alone.
        </>
      }
    >
      {groups.map(([name, tokens]) => (
        <Group key={name} name={name}>
          <SwatchGrid>
            {tokens.map(([figma, css]) => (
              <Swatch key={css} figma={figma} css={css} />
            ))}
          </SwatchGrid>
        </Group>
      ))}
    </Page>
  ),
}
