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

/**
 * Version names.
 *
 * Every commit that lands on main is deployed and is what anyone pulling the
 * library gets, so every commit is a version. There is no release step to hang
 * a number on.
 *
 * The name is the day it landed plus which change of that day it was, counted
 * from the first — 2026.09.10.2 is the second change that day. Dates rather
 * than 2.1.0 because nothing here is published as a package: there is no
 * install to pin, so a number counting breaking changes would be describing a
 * thing that does not exist.
 *
 * The day is taken from the commit's own timezone offset, which is the day the
 * author saw when they made it.
 */
const dayKey = (iso) => iso.slice(0, 10).replace(/-/g, '.')

const seen = new Map()
// git log is newest first, so count from the oldest to number them in the order
// they actually happened.
for (const commit of [...commits].reverse()) {
  const day = dayKey(commit.date)
  const n = (seen.get(day) ?? 0) + 1
  seen.set(day, n)
  commit.version = `${day}.${n}`
}

const out = { repo, generated: new Date().toISOString(), commits }
writeFileSync('src/changelog.json', JSON.stringify(out, null, 2) + '\n')
console.log(`src/changelog.json written — ${commits.length} commit(s)${repo ? ` from ${repo}` : ''}`)
