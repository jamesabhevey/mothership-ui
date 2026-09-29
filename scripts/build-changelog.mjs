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
 *
 * Indented blocks are the exception. A commit message that lays three tokens
 * out in a column means the column, and rewrapping it produces a run-on line
 * that reads as nonsense. Those keep their line breaks, and the page renders
 * them as written.
 */
const paragraphs = (body) =>
  body
    .split(/\n{2,}/)
    .map((block) => {
      const lines = block
        .split('\n')
        .filter((line) => !/^(Co-Authored-By|Signed-off-by):/i.test(line.trim()))
      if (!lines.length) return ''

      const indented = lines.every((line) => /^\s{2,}\S/.test(line))
      if (indented) {
        // Strip the common indent, keep the relative one, keep the breaks.
        const pad = Math.min(...lines.map((l) => l.match(/^\s*/)[0].length))
        return lines.map((l) => l.slice(pad).trimEnd()).join('\n')
      }

      return lines.join(' ').replace(/\s+/g, ' ').trim()
    })
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
 * from the first — 10.09.2026.2 is the second change that day. Dates rather
 * than 2.1.0 because the Storybook is not versioned as a package: every change
 * that lands is what you get, so a number counting breaking changes would be
 * describing a release step that does not happen. The npm package is separate
 * and is semver.
 *
 * Day before month, as it is written here. It costs the property that a version
 * name sorts as a string, which nothing relied on — the list is ordered by git,
 * not by parsing these back.
 *
 * The day is taken from the commit's own timezone offset, which is the day the
 * author saw when they made it.
 */
const dayKey = (iso) => {
  const [y, m, d] = iso.slice(0, 10).split('-')
  return `${d}.${m}.${y}`
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/**
 * The heading a day's changes are listed under: "29 September 2026".
 *
 * Built from the string rather than by constructing a Date. The commit carries
 * its own timezone offset, and the day the author saw is the day this should
 * say — handing the timestamp to the browser would re-resolve it in whatever
 * timezone the reader happens to be in, and quietly move a late-evening commit
 * to the following morning.
 */
const dayLabel = (iso) => {
  const [y, m, d] = iso.slice(0, 10).split('-')
  return `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`
}

/**
 * What kind of change this is, from the verb the subject opens with.
 *
 * Only verbs that are unambiguous are mapped; everything else is "Changed".
 * A classifier that guesses eagerly gets some of them wrong, and a changelog
 * entry labelled "Added" when something was removed is worse than one labelled
 * with the generic term — the reader stops trusting every label, not just that
 * one. Which is why "Bring", "Halve" and "Quieten" deliberately fall through.
 */
const KINDS = [
  ['Added', ['add', 'publish', 'introduce', 'create', 'document', 'start', 'give']],
  ['Removed', ['remove', 'drop', 'delete', 'cut']],
  ['Fixed', ['fix', 'correct', 'repair', 'restore']],
]

const kindOf = (subject) => {
  const verb = subject.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z-]/g, '')
  for (const [kind, verbs] of KINDS) if (verbs.includes(verb)) return kind
  return 'Changed'
}

const seen = new Map()
// git log is newest first, so count from the oldest to number them in the order
// they actually happened.
for (const commit of [...commits].reverse()) {
  const day = dayKey(commit.date)
  const n = (seen.get(day) ?? 0) + 1
  seen.set(day, n)
  commit.version = `${day}.${n}`
  commit.kind = kindOf(commit.subject)
  commit.day = dayLabel(commit.date)
}

const out = { repo, generated: new Date().toISOString(), commits }
writeFileSync('src/changelog.json', JSON.stringify(out, null, 2) + '\n')
console.log(`src/changelog.json written — ${commits.length} commit(s)${repo ? ` from ${repo}` : ''}`)
