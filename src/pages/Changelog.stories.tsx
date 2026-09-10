import type { Meta, StoryObj } from '@storybook/react-vite'
import { Group, P, Page } from '../docs/parts'
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
 * Commits carry an ISO timestamp; the page groups by the day they landed, since
 * this library has no versions to group by. Dates are formatted in en-GB
 * explicitly rather than left to the reader's locale, so the page reads the
 * same for everyone looking at it together.
 */
const dayOf = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

const byDay = commits.reduce<Array<[string, typeof commits]>>((days, commit) => {
  const day = dayOf(commit.date)
  const last = days[days.length - 1]
  if (last && last[0] === day) last[1].push(commit)
  else days.push([day, [commit]])
  return days
}, [])

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
    <li className="flex flex-col gap-2 border-b border-border-subtle pb-5 last:border-0 last:pb-0">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-label-lg font-semibold text-text-primary">{commit.subject}</span>
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-caption-md text-text-link hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            {commit.short}
          </a>
        ) : (
          <span className="font-mono text-caption-md text-text-muted">{commit.short}</span>
        )}
      </div>
      {commit.body.map((paragraph, i) => (
        <p key={i} className="max-w-[80ch] text-body-sm text-text-secondary">
          {withCode(paragraph)}
        </p>
      ))}
    </li>
  )
}

export const Changelog: Story = {
  name: 'Changelog',
  render: () => (
    <Page
      title="Changelog"
      intro={
        <>
          Every change to the library, newest first, straight from the commit history. Each entry
          links to its commit, where you can see exactly what changed and why.
          <br />
          <br />
          There are no version numbers to group by: this is an internal library consumed from source
          rather than a published package, so changes land on <code>main</code> and reach the
          Storybook on the next deploy. The entries are grouped by the day they landed instead.
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
          {byDay.map(([day, entries]) => (
            <Group key={day} name={day}>
              <ul className="flex flex-col gap-5 border-t border-border-subtle pt-5">
                {entries.map((commit) => (
                  <Entry key={commit.full} commit={commit} />
                ))}
              </ul>
            </Group>
          ))}

          {repo ? (
            <P>
              Showing the {commits.length} most recent commits.{' '}
              <a
                href={`https://github.com/${repo}/commits/main`}
                target="_blank"
                rel="noreferrer"
                className="text-text-link hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
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
