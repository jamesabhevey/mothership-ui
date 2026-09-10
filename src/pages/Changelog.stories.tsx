import type { Meta, StoryObj } from '@storybook/react-vite'
import { P, Page } from '../docs/parts'
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
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="rounded-sm bg-bg-subtle px-1.5 py-0.5 font-mono text-caption-md text-text-primary">
          {commit.version}
        </span>
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
      <span className="text-label-lg font-semibold text-text-primary">{commit.subject}</span>
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
          <strong>What counts as a version.</strong> Every change that lands is one. There is no
          release step to wait for — a change reaches <code>main</code>, this Storybook redeploys,
          and that is what you get when you pull the library — so there is no gap between a change
          being made and it being live to gather several of them into a release.
          <br />
          <br />
          The name is the day it landed and which change of that day it was, so{' '}
          <code>2026.09.10.2</code> is the second change that day. Dates rather than numbers like{' '}
          <code>2.1.0</code> because nothing here is published as a package: there is no install to
          pin to, so a number counting breaking changes would be describing something that does not
          exist.
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
            One flat list rather than a heading per day. The version name
            already carries the date, so a day heading above it was the same
            date twice.
          */}
          <ul className="flex flex-col gap-5 border-t border-border-subtle pt-5">
            {commits.map((commit) => (
              <Entry key={commit.full} commit={commit} />
            ))}
          </ul>

          {repo ? (
            <P>
              Showing the {commits.length} most recent versions.{' '}
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
