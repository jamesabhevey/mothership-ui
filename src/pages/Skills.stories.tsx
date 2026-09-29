import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge, type BadgeProps } from '../components/Badge'
import { Code, Group, P, Page, prose } from '../docs/parts'

const meta = {
  title: 'Skills',
  // A reference page rather than a component, so no generated docs page.
  tags: ['!autodocs'],
  parameters: { controls: { disable: true }, layout: 'fullscreen', options: { showPanel: false } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

type Skill = {
  name: string
  /** Where it lives, and therefore who it applies to. */
  status: 'In this repository' | 'Recommended'
  /** The one-line answer to "when would I reach for this". */
  summary: string
  /** What it does, in enough detail to decide whether you want it. */
  body: string[]
  /** How it is triggered. */
  invoked: string
}

const intents: Record<Skill['status'], BadgeProps['intent']> = {
  'In this repository': 'success',
  Recommended: 'info',
}

const skills: Skill[] = [
  {
    name: 'Design review',
    status: 'In this repository',
    summary: 'Reviews a pull request against this design system and comments on the diff.',
    invoked: '.claude/skills/design-review — run automatically on every pull request',
    body: [
      'The judgement half of the pull request gate. Everything a script can decide already runs and blocks the merge: colour and motion literals, a stale entry point, dead links, and axe across every story in both colour modes. This covers what a script cannot.',
      'It looks for a component rebuilt inline where one already exists, spacing and type outside the scale, controls that cannot be operated by keyboard, an interactive element shipped with three of its four states, and a new component with no story — which means no documentation and no accessibility coverage, since the suite runs off the stories.',
      'Advisory on purpose. Its own workflow, not a required check, and a failure blocks nothing. A gate that fails differently on a re-run gets switched off within a fortnight and takes the checks that did work with it. It is also told to report nothing the automated checks already catch, and to stop at five findings: a review of twenty small things gets skimmed, and the two that mattered go with it.',
    ],
  },
]

function SkillCard({ skill }: { skill: Skill }) {
  return (
    <li className="flex flex-col gap-4 border-b border-border-subtle pb-10 last:border-0 last:pb-0">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <Badge intent={intents[skill.status]}>{skill.status}</Badge>
        <span className="font-mono text-caption-md text-text-secondary">{skill.invoked}</span>
      </div>
      <h3 className="text-heading-md text-text-primary">{skill.name}</h3>
      <p className="text-body-md text-text-primary">{skill.summary}</p>
      {skill.body.map((paragraph, i) => (
        <p key={i} className={`${prose} text-text-secondary`}>
          {paragraph}
        </p>
      ))}
    </li>
  )
}

export const Skills: Story = {
  name: 'Skills',
  render: () => (
    <Page
      title="Skills"
      intro={
        <>
          A skill is a written standard an AI assistant loads before it starts work — a folder
          holding the rules, the vocabulary and the worked examples for one job. It is the
          difference between asking for "a review" and asking for a review against{' '}
          <em>this</em> design system.
          <br />
          <br />
          They matter here for the same reason the usage notes on each component do. A design
          system is mostly a set of decisions about what not to do, and those decisions are
          invisible to anyone — person or model — who was not in the room. A skill writes them
          down once, in a form that gets applied every time rather than remembered sometimes.
          <br />
          <br />
          <strong>A skill is instructions, not a program.</strong> It does not run on its own.
          Something has to invoke it: a GitHub Action on a pull request, or a person typing its
          name. The skill is the standard; the trigger is separate.
        </>
      }
    >
      <Group name="The skills">
        <ul className="flex flex-col gap-10 border-t border-border-subtle pt-7">
          {skills.map((skill) => (
            <SkillCard key={skill.name} skill={skill} />
          ))}
        </ul>
      </Group>

      <Group name="Writing one">
        <P>
          A skill is a folder with a <code>SKILL.md</code> in it. The front matter gives it a name
          and a description; the description is what an assistant reads to decide whether the skill
          applies, so it should say when to use it rather than what it contains.
        </P>
        <Code>{`.claude/skills/design-review/SKILL.md

---
name: design-review
description: Review a pull request against the Mothership UI design
  system — component reuse, tokens, layout, accessibility and finish.
  Use when reviewing a PR in this repository.
---`}</Code>
        <P>
          Two things separate a skill that gets followed from one that gets ignored. It has to say
          what <em>not</em> to report — ours is told to skip anything the automated checks already
          catch, because a second opinion on top of a red build is noise. And it has to cap itself:
          a review of twenty small things gets skimmed and then ignored, and the findings that
          mattered go with it.
        </P>
      </Group>
    </Page>
  ),
}
