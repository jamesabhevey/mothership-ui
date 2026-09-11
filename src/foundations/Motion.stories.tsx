import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Group, P, Page, useToken } from '../docs/parts'
import { Button } from '../components/Button'
import { Switch } from '../components/Switch'
import { Select } from '../components/Select'
import { Spinner } from '../components/Spinner'

const meta = {
  title: 'Foundations/Motion',
  tags: ['!autodocs'],
  parameters: { controls: { disable: true }, layout: 'fullscreen', options: { showPanel: false } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const durations: Array<[string, string, string]> = [
  // [token, css var, what it is for]
  ['duration/fast', '--duration-fast', 'A control answering a pointer: hover, pressed, focus, checked.'],
  ['duration/base', '--duration-base', 'Something that travels or fades rather than just recolours.'],
  ['duration/slow', '--duration-slow', 'A surface arriving, which has further to come than a colour.'],
  ['duration/loop', '--duration-loop', 'One turn of a continuous indicator.'],
]

const easings: Array<[string, string, string]> = [
  ['easing/standard', '--ease-standard', 'Anything already on screen changing. Eases in and out.'],
  ['easing/enter', '--ease-enter', 'Anything arriving. Starts at speed and settles.'],
]

/** Token name, resolved value, and what it is for. */
function Token({ name, css, note }: { name: string; css: string; note: string }) {
  const value = useToken(css)
  return (
    <li className="flex flex-col gap-1 border-b border-border-subtle pb-4 last:border-0 last:pb-0">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="text-label-md text-text-primary">{name}</span>
        <span className="font-mono text-caption-md text-text-secondary">{css}</span>
        <span className="font-mono text-caption-md text-text-muted">{value || '—'}</span>
      </div>
      <p className="text-body-sm text-text-secondary">{note}</p>
    </li>
  )
}

/**
 * A bar that runs the length of the page on hover, at one duration and curve.
 *
 * Reading a duration as a number is not the same as feeling it, and the
 * difference between 100ms and 250ms is exactly the sort of thing that has to
 * be felt to be chosen well.
 */
function Specimen({ label, duration, easing }: { label: string; duration: string; easing: string }) {
  return (
    <li className="group flex flex-col gap-2">
      <span className="font-mono text-caption-md text-text-secondary">{label}</span>
      <div className="h-8 w-full overflow-hidden rounded-sm bg-bg-subtle">
        <div
          className="h-full w-8 rounded-sm bg-action-primary-default transition-[width] group-hover:w-full"
          style={{ transitionDuration: `var(${duration})`, transitionTimingFunction: `var(${easing})` }}
        />
      </div>
    </li>
  )
}

export const Motion: Story = {
  render: function MotionPage() {
    const [on, setOn] = useState(false)

    return (
      <Page
        title="Motion"
        intro={
          <>
            Two small scales — how long something takes, and how it accelerates. Every transition in
            the library resolves to one of them.
            <br />
            <br />
            These live in Figma too, in a <strong>Motion</strong> collection alongside Semantic,
            Dimension and Typography — as Figma's own <code>TIMING</code> and <code>EASING</code>{' '}
            variable types, so a prototype transition can use the same values a component does.
            Figma states durations in seconds where the code states them in milliseconds;{' '}
            <code>duration/fast</code> is 0.1 there and 100ms here.
            <br />
            <br />
            This scale was defined in code first and added to Figma afterwards, which is the reverse
            of every other foundation here. The weekly drift check does not cover it yet — that
            reads colour only.
            <br />
            <br />
            Motion here is feedback, not decoration. It exists to say <em>that</em> responded,{' '}
            <em>this</em> moved there, <em>something</em> is still working. Anything that does not
            answer one of those has no reason to move.
          </>
        }
      >
        <Group name="Duration">
          <ul className="flex flex-col gap-4 border-t border-border-subtle pt-5">
            {durations.map(([name, css, note]) => (
              <Token key={css} name={name} css={css} note={note} />
            ))}
          </ul>
          <P>Hover each bar to feel the difference between them.</P>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Specimen label="fast — 100ms" duration="--duration-fast" easing="--ease-standard" />
            <Specimen label="base — 150ms" duration="--duration-base" easing="--ease-standard" />
            <Specimen label="slow — 250ms" duration="--duration-slow" easing="--ease-standard" />
          </ul>
        </Group>

        <Group name="Easing">
          <ul className="flex flex-col gap-4 border-t border-border-subtle pt-5">
            {easings.map(([name, css, note]) => (
              <Token key={css} name={name} css={css} note={note} />
            ))}
          </ul>
          <P>
            Both curves are slow at the end, because a thing that decelerates into place looks like
            it arrived somewhere rather than stopping dead. The difference is the start: standard
            eases in, so a change on screen builds; enter starts at speed, so something coming in
            feels like it was already on its way. A continuous loop is linear — a spinner that
            eased would look like it was struggling.
          </P>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Specimen label="standard" duration="--duration-slow" easing="--ease-standard" />
            <Specimen label="enter" duration="--duration-slow" easing="--ease-enter" />
          </ul>
        </Group>

        <Group name="How it is applied">
          <P>
            Components do not name a duration. Tailwind's own{' '}
            <code>--default-transition-duration</code> and{' '}
            <code>--default-transition-timing-function</code> are set to <code>duration/fast</code>{' '}
            and <code>easing/standard</code>, so every <code>transition-*</code> in the library
            resolves to the scale without saying so. A component only names a duration when it wants
            something other than that — which is the exception, and reads as one.
          </P>
          <ul className="flex flex-col gap-4 border-t border-border-subtle pt-5">
            <Token
              name="Everything by default"
              css="--duration-fast"
              note="Button, IconButton, Card, Checkbox, ListItem, MenuItem, Tab, TextField, Select, Banner, Switch track. Colour answering a pointer."
            />
            <Token
              name="Movement and fades"
              css="--duration-base"
              note="The Switch thumb travelling, the Radio dot fading in, the Select chevron turning over. Further to go than a colour, so a little longer."
            />
            <Token
              name="A surface arriving"
              css="--duration-slow"
              note="The Select dropdown, on easing/enter. It leaves instantly — an exit would mean keeping it mounted to animate, which is more machinery than a disappearance is worth."
            />
            <Token
              name="Continuous"
              css="--duration-loop"
              note="One rotation of the Spinner, linear and unending."
            />
          </ul>
        </Group>

        <Group name="In the components">
          <P>Each of these is one of the four, in the order above.</P>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <li className="flex flex-col gap-2">
              <span className="font-mono text-caption-md text-text-secondary">
                fast — hover the button
              </span>
              <Button variant="primary">Save changes</Button>
            </li>
            <li className="flex flex-col gap-2">
              <span className="font-mono text-caption-md text-text-secondary">
                base — the thumb travels
              </span>
              <Switch checked={on} onChange={(event) => setOn(event.target.checked)}>
                Email notifications
              </Switch>
            </li>
            <li className="flex flex-col gap-2">
              <span className="font-mono text-caption-md text-text-secondary">
                slow — the list arrives
              </span>
              <Select label="Billing period" placeholder="Choose a period">
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
              </Select>
            </li>
            <li className="flex flex-col gap-2">
              <span className="font-mono text-caption-md text-text-secondary">loop — one turn</span>
              <Spinner size="md" />
            </li>
          </ul>
        </Group>

        <Group name="Reduced motion">
          <P>
            Someone who has asked their operating system for less movement gets none of the
            decoration: every transition and animation collapses to nothing. It collapses rather
            than being removed, so anything whose final state depends on the animation still lands
            on it.
          </P>
          <P>
            The exception is a continuous indicator. A spinner that stops spinning does not read as
            calm, it reads as frozen — the one thing a loading indicator must never look like. Those
            keep turning at half speed. Reduced motion means less movement, not less information.
          </P>
          <P>
            It is enforced once, in the stylesheet, rather than component by component. Nothing in
            the library has to remember to check.
          </P>
        </Group>
      </Page>
    )
  },
}
