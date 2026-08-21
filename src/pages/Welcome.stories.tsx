import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Group, P, Page, storyHref } from '../docs/parts'
import { Icon, iconNames, type IconName } from '../components/icons'

const meta = {
  title: 'Welcome',
  tags: ['!autodocs'],
  parameters: { controls: { disable: true }, layout: 'fullscreen', options: { showPanel: false } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function NavCard({
  icon,
  name,
  href,
  children,
}: {
  icon: IconName
  name: string
  href: string
  children: ReactNode
}) {
  return (
    <li className="group relative">
      <div className="flex h-full flex-col gap-2 rounded-lg border border-border-subtle bg-surface-default p-5 transition-colors group-hover:bg-bg-subtle">
        <span className="grid size-8 place-items-center rounded-md bg-bg-selected text-icon-link" aria-hidden>
          <Icon name={icon} size={20} />
        </span>
        <a
          href={href}
          target="_top"
          className="text-label-lg font-semibold text-text-link after:absolute after:inset-0 after:content-[''] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          {name}
        </a>
        <p className="text-body-sm text-text-secondary">{children}</p>
      </div>
    </li>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <li className="flex flex-col gap-1 rounded-lg border border-border-subtle p-5">
      <span className="text-heading-lg tabular-nums text-text-primary">{value}</span>
      <span className="text-caption-md text-text-secondary">{label}</span>
    </li>
  )
}

export const Welcome: Story = {
  name: 'Welcome',
  render: () => (
    <Page
      title="Mothership UI"
      intro={
        <>
          A design system that exists twice: once as a Figma library, once as React components. This
          Storybook is the code half, and the place to check what a component actually does before
          you build with it.
          <br />
          <br />
          Every colour, spacing step, corner radius, shadow and type step was read out of the Figma
          variable collections rather than matched by eye, and the component APIs follow the property
          names on the Figma component sets. A designer and a developer describing the same button
          should be using the same words.
        </>
      }
    >
      <Group name="Start here">
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(224px,1fr))] gap-4">
          <NavCard icon="download" name="Get started" href={storyHref('get-started--get-started', 'story')}>
            Installing, the font setup, your first component, and the three conventions that catch
            people out.
          </NavCard>
          <NavCard icon="search" name="Catalog" href={storyHref('catalog--catalog', 'story')}>
            Every component with a live preview, searchable, each linking through to its own page.
          </NavCard>
          <NavCard icon="star" name="Foundations" href={storyHref('foundations-colour--colour', 'story')}>
            Colour, typography, spacing and elevation, with values read live from the code.
          </NavCard>
          <NavCard icon="settings" name="Components" href={storyHref('components-form-elements-button--docs')}>
            One page per component, showing every variant alongside the usage notes from Figma.
          </NavCard>
        </ul>
      </Group>

      <Group name="What is in it">
        {/*
          The icon count derives itself. The other three are counted from the
          built story index and tokens.json — 29 component pages, 93 stories
          under Components, and every entry across the token file — so they need
          updating when the library grows.
        */}
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
          <Stat value="29" label="components" />
          <Stat value={String(iconNames.length)} label="icons" />
          <Stat value="102" label="design tokens" />
          <Stat value="93" label="documented variants" />
        </ul>
        <P>
          Components are grouped the way the Figma library groups them: Form Elements, Content
          Presentation, Navigation, and Blocks for the composed pieces built out of the others.
        </P>
      </Group>

      <Group name="What it is opinionated about">
        <P>
          <strong>Colour is never the only signal.</strong> Every error pairs red with words and an
          icon, every selected row pairs its tint with a tick or an <code>aria-current</code>. If you
          find yourself relying on a colour alone, the component is being used against its grain.
        </P>
        <P>
          <strong>Keyboard focus is always visible.</strong> Focus was not a variant in the Figma
          file, but the focus token was kept there deliberately, so every interactive component
          implements it.
        </P>
        <P>
          <strong>Touch targets are called out, not silently fixed.</strong> Where a control is
          smaller than the 44px minimum — Button <code>sm</code>, IconButton <code>sm</code> and{' '}
          <code>md</code> — its page says so, so the choice sits with you rather than being hidden.
        </P>
        <P>
          <strong>Nothing hard-codes a value.</strong> Every component refers to tokens by name, so
          re-theming the library is one file rather than a search and replace.
        </P>
      </Group>

      <Group name="Keeping it honest">
        <P>
          The two halves drift apart if nobody is watching, so something is. A job runs every Monday,
          reads the Figma library, compares the colours the components are actually painted against
          the values in the code, and opens a pull request if they disagree. Nothing changes without
          somebody approving it.
        </P>
        <P>
          It watches colour rather than everything, because reading variable definitions needs a
          Figma plan we do not have. Spacing and type changes still come through a person. The
          Foundations pages read their values live from the code, so whatever the tokens are right
          now is what those pages show.
        </P>
      </Group>
    </Page>
  ),
}
