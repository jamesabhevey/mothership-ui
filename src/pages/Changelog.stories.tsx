import type { Meta, StoryObj } from '@storybook/react-vite'
import { Group, P, Page, prose } from '../docs/parts'
import { Badge, type BadgeProps } from '../components/Badge'
import changelog from '../changelog.json'

const meta = {
  title: 'Changelog',
  // A reference page rather than a component, so no generated docs page. A
  // single story with autodocs off is what makes it a plain sidebar entry.
  tags: ['!autodocs'],
  parameters: { controls: { disable: true }, layout: 'fullscreen', options: { showPanel: false } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const { repo, commits } = changelog

const commitUrl = (hash: string) => (repo ? `https://github.com/${repo}/commit/${hash}` : null)

/**
 * Colour per kind of change, using the library's own Badge.
 *
 * Removed is neutral rather than danger. Red would read as something having
 * gone wrong, and most removals here are the opposite — a thing that stopped
 * earning its place being taken out on purpose.
 */
const intents: Record<string, BadgeProps['intent']> = {
  Added: 'success',
  Changed: 'info',
  Fixed: 'brand',
  Removed: 'neutral',
}

/**
 * Commit bodies are plain text, but they are written with backticks around
 * code the way the rest of these pages are, so the same convention is honoured
 * here rather than leaving the marks on screen.
 */
function withCode(text: string) {
  return text.split(/(`[^`]+`)/).map((part, i) =>
    part.startsWith('`') && part.endsWith('`') && part.length > 2 ? (
      <code key={i}>{part.slice(1, -1)}</code>
    ) : (
      part
    ),
  )
}

function Entry({ commit }: { commit: (typeof commits)[number] }) {
  const url = commitUrl(commit.full)
  return (
    <li className="flex flex-col gap-3 border-b border-border-subtle pb-8 last:border-0 last:pb-0">
      <Badge className="self-start" intent={intents[commit.kind] ?? 'neutral'}>
        {commit.kind}
      </Badge>
      {/*
        h3, under the date's h2, under the page's h1. Forty entries is exactly
        the page somebody navigates by heading, and the levels are what makes
        that work.
      */}
      <h3 className="text-heading-sm font-semibold text-text-primary">{commit.subject}</h3>
      {commit.body.map((paragraph, i) =>
        // A block that kept its line breaks was laid out deliberately in the
        // commit message — a short column of tokens, usually. Rendered as
        // written, in mono, rather than rewrapped into a run-on sentence.
        paragraph.includes('\n') ? (
          <pre
            key={i}
            className="max-w-full overflow-x-auto rounded-sm bg-bg-subtle px-3 py-2 font-mono text-caption-md text-text-secondary"
          >
            {paragraph}
          </pre>
        ) : (
          <p key={i} className={`max-w-[80ch] ${prose} text-text-secondary`}>
            {withCode(paragraph)}
          </p>
        ),
      )}
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="mt-1 text-label-md text-text-link underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          View commit
        </a>
      ) : null}
    </li>
  )
}

/**
 * Newest first, gathered by the day they landed.
 *
 * The commits arrive in order, so one pass is enough — no sorting, and no
 * assumption that a day's changes are contiguous beyond what git already
 * guarantees.
 */
const byDay = commits.reduce<Array<[string, typeof commits]>>((days, commit) => {
  const last = days[days.length - 1]
  if (last && last[0] === commit.day) last[1].push(commit)
  else days.push([commit.day, [commit]])
  return days
}, [])

export const Changelog: Story = {
  name: 'Changelog',
  render: () => (
    <Page
      title="Changelog"
      intro={
        <>
          Every change to the library, newest first, straight from the commit history, gathered
          under the day it landed. Each entry links to its commit, where you can see exactly what
          changed and why.
          <br />
          <br />
          <strong>Every change that lands is a version.</strong> There is no release step to wait
          for — a change reaches <code>main</code>, this Storybook redeploys, and that is what you
          get when you pull the library. Which is why the date leads here rather than a number
          like <code>2.1.0</code>: there is nothing to count. The npm package is separate, and is
          semver.
          <br />
          <br />
          Each entry carries the kind of change it was, read from the verb its description opens
          with. Only unambiguous verbs are labelled; anything else is <strong>Changed</strong>{' '}
          rather than guessed at, because a label that is sometimes wrong teaches you to ignore all
          of them.
        </>
      }
    >
      {commits.length === 0 ? (
        <P>
          No history was available when this page was built. That happens on a shallow clone, where
          only the most recent commit is fetched.
        </P>
      ) : (
        <>
          {/*
            The date leads, and a day's changes sit under it. Group is the same
            section heading the Foundations pages use, so the spacing between
            days matches the spacing between sections everywhere else.
          */}
          {byDay.map(([day, entries]) => (
            <Group key={day} name={day}>
              <ul className="flex flex-col gap-8 border-t border-border-subtle pt-6">
                {entries.map((commit) => (
                  <Entry key={commit.full} commit={commit} />
                ))}
              </ul>
            </Group>
          ))}

          {repo ? (
            <P>
              Showing the {commits.length} most recent versions.{' '}
              <a
                href={`https://github.com/${repo}/commits/main`}
                target="_blank"
                rel="noreferrer"
                // Underlined in its resting state, not just on hover. A link
                // sitting inside a sentence has to be distinguishable from the
                // text around it without relying on colour; against body text
                // this one differs by 1.34:1, well under the 3:1 that would
                // let colour carry it alone.
                className="text-text-link underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              >
                See the full history on GitHub
              </a>
              .
            </P>
          ) : null}
        </>
      )}
    </Page>
  ),
}
