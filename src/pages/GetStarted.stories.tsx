import type { Meta, StoryObj } from '@storybook/react-vite'
import { Code, Group, P, Page } from '../docs/parts'

const meta = {
  title: 'Get started',
  tags: ['!autodocs'],
  parameters: { controls: { disable: true }, layout: 'fullscreen', options: { showPanel: false } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const GetStarted: Story = {
  name: 'Get started',
  render: () => (
    <Page
      title="Get started"
      intro={
        <>
          Mothership UI is the React implementation of the Mothership UI Figma library: 29
          components, an icon set, and the token layer they are all built from.
          <br />
          <br />
          Every colour, spacing step, corner radius, shadow and type step was read out of the Figma
          variable collections rather than eyeballed, and the component APIs follow the property
          names on the Figma component sets. If a designer says "Button, Secondary, Large", that is
          what the code is called.
        </>
      }
    >
      <Group name="What is in here">
        <P>
          <strong>Get started</strong> is this page. <strong>Catalog</strong> lists every component
          with a preview and a link. <strong>Foundations</strong> documents the token layer, with
          values read live from the code so the pages cannot go stale.{' '}
          <strong>Assets</strong> holds the icon set. <strong>Components</strong> has a page per
          component, showing every variant, with the usage notes written in Figma sitting above
          them.
        </P>
        <P>
          The usage notes are worth reading before reaching for something. They explain when not to
          use a component, which is usually the more useful half.
        </P>
      </Group>

      <Group name="Installing">
        <P>
          The library is not published to a package registry. Copy{' '}
          <code>src/components</code>, <code>src/styles</code> and <code>src/lib</code> into your
          project, then install what they depend on.
        </P>
        <Code>{`npm install react react-dom class-variance-authority clsx tailwind-merge lucide-react
npm install -D tailwindcss @tailwindcss/vite`}</Code>
        <P>
          Tailwind v4 is required rather than optional. The token layer is a Tailwind{' '}
          <code>@theme</code> block, which is what turns{' '}
          <code>--color-action-primary-default</code> into the utility{' '}
          <code>bg-action-primary-default</code>. Add the plugin to your Vite config.
        </P>
        <Code>{`// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})`}</Code>
      </Group>

      <Group name="The font">
        <P>
          The type scale is Inter in four weights, one per role: Regular 400 for body, Medium 500
          for labels and captions, Semi Bold 600 for headings, Bold 700 for display. Serve it
          locally rather than from a CDN so there is no third-party request and no layout shift.
        </P>
        <Code>{`npm install @fontsource/inter`}</Code>
        <Code>{`// main.tsx — import before your stylesheet
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'

import './styles/index.css'`}</Code>
        <P>
          Miss a weight and nothing breaks visibly: the browser synthesises it, and the type comes
          out subtly wrong in a way that is hard to spot next to a Figma frame. Import all four.
        </P>
      </Group>

      <Group name="Using a component">
        <P>
          Import from the components barrel. Props follow the Figma property names, lower-cased,
          with <code>Type</code> becoming <code>variant</code> because <code>type</code> is taken on
          a button element.
        </P>
        <Code>{`import { Button, TextField, Banner } from './components'
import { Plus } from './components/icons'

export function Example() {
  return (
    <form className="flex flex-col gap-4">
      <Banner intent="info" title="Two slots left today" />

      <TextField
        label="Full name"
        placeholder="Placeholder"
        helperText="As it appears on your passport"
        required
      />

      <Button variant="primary" size="md" leadingIcon={<Plus size={16} strokeWidth={2} />}>
        Add booking
      </Button>
    </form>
  )
}`}</Code>
      </Group>

      <Group name="Using the tokens">
        <P>
          Build your own layouts from the same tokens the components use, so a re-theme reaches your
          code too. Never hard-code a hex.
        </P>
        <Code>{`<section className="rounded-lg border border-border-subtle bg-surface-default p-4">
  <h2 className="text-heading-sm text-text-primary">Bookings</h2>
  <p className="text-body-sm text-text-secondary">Everything scheduled this week</p>
</section>`}</Code>
        <P>
          Spacing is the one place to be careful. Figma's <code>space/N</code> tokens are
          pixel-named and every step lands on Tailwind's 4px grid, so use the stock utilities:{' '}
          <code>p-4</code> <em>is</em> <code>space/16</code>. The raw <code>--space-*</code>{' '}
          variables exist for anything outside Tailwind.
        </P>
      </Group>

      <Group name="Three things that will surprise you">
        <P>
          <strong>Hover and pressed are not props.</strong> Figma draws them as variants; the
          browser already owns them. The <code>State</code> axis maps to <code>:hover</code>,{' '}
          <code>:active</code> and <code>:disabled</code>. Only <code>loading</code>,{' '}
          <code>disabled</code> and <code>selected</code> are props, because those are application
          state rather than pointer state.
        </P>
        <P>
          <strong>Small sizes fail the touch target.</strong> Button <code>sm</code> is 32px and
          IconButton <code>sm</code> and <code>md</code> are 32 and 40, all below the 44px minimum.
          Use a larger size on touch, or pad the hit area.
        </P>
        <P>
          <strong>Icon-only controls require a label.</strong> <code>IconButton</code> takes a
          required <code>label</code> prop, which becomes the accessible name. There is no visible
          text to fall back on, so the type system insists.
        </P>
      </Group>
    </Page>
  ),
}
