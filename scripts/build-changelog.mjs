#!/usr/bin/env node
/**
 * git history -> src/changelog.json, for the Changelog page.
 *
 * Read at build time rather than fetched from GitHub in the browser. The API
 * would work — the repository is public — but unauthenticated calls are rate
 * limited per IP, so a page that several people open from one office network
 * would start failing, and it would fail silently on a page whose whole job is
 * to say what changed. The Pages deploy runs on every push to main, so building
 * it in is no less current.
 *
 * The file is generated, not committed. `npm run storybook`, `npm run
 * build-storybook` and `npm run typecheck` each regenerate it first.
 */
import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'

const LIMIT = 40
const SEP = '<<<COMMIT>>>'
const FIELD = '<<<FIELD>>>'

const git = (args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 })

/** owner/repo from the origin remote, whichever form it is written in. */
const repo = (() => {
  try {
    const url = git(['remote', 'get-url', 'origin']).trim()
    const m = /github\.com[:/]([^/]+\/[^/.]+)/.exec(url)
    return m ? m[1] : null
  } catch {
    return null
  }
})()

/**
 * Commit bodies are hard-wrapped, so a paragraph arrives as several lines.
 * Rejoin them, keep the blank-line breaks, and drop the trailers — the
 * co-author line is noise on a page like this.
 */
const paragraphs = (body) =>
  body
    .split(/\n{2,}/)
    .map((p) =>
      p
        .split('\n')
        .filter((line) => !/^(Co-Authored-By|Signed-off-by):/i.test(line.trim()))
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim(),
    )
    .filter(Boolean)

let log = ''
try {
  log = git([
    'log',
    `-n${LIMIT}`,
    '--no-merges',
    `--pretty=format:%h${FIELD}%H${FIELD}%aI${FIELD}%an${FIELD}%s${FIELD}%b${SEP}`,
  ])
} catch (error) {
  // A shallow clone, or a directory that is not a repository at all. Better an
  // empty changelog that says so than a build that fails.
  console.warn(`Could not read git history (${error.message.split('\n')[0]}). Writing an empty changelog.`)
}

const commits = log
  .split(SEP)
  .map((entry) => entry.trim())
  .filter(Boolean)
  .map((entry) => {
    const [short, full, date, author, subject, body = ''] = entry.split(FIELD)
    return { short, full, date, author, subject, body: paragraphs(body) }
  })

const out = { repo, generated: new Date().toISOString(), commits }
writeFileSync('src/changelog.json', JSON.stringify(out, null, 2) + '\n')
console.log(`src/changelog.json written — ${commits.length} commit(s)${repo ? ` from ${repo}` : ''}`)
