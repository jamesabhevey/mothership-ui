/**
 * Contract checks.
 *
 * Type-checking and the build catch code that cannot compile. They do not catch
 * the things that have actually gone wrong in this repo, all of which fail
 * silently: a CSS override whose selector no longer matches anything, a link to
 * a story whose title has been renamed, a hand-edited generated file, a
 * hard-coded hex, a headline number that stopped being true.
 *
 * Each check below exists because that specific thing broke, or could break
 * without anyone noticing. Run after `npm run build-storybook` — several of them
 * read the built site.
 *
 *   node scripts/check-contracts.mjs
 */
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'

const STATIC = 'storybook-static'
const failures = []
const notes = []
const fail = (check, detail) => failures.push({ check, detail })
const pass = (check, detail) => notes.push(`  ok    ${check}${detail ? ` — ${detail}` : ''}`)

const walk = (dir, out = []) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else out.push(p)
  }
  return out
}

const srcFiles = walk('src').filter((f) => ['.tsx', '.ts'].includes(extname(f)))

// ---------------------------------------------------------------------------
// 1. The generated token stylesheet is what the generator produces.
//
// src/styles/tokens.css is generated from tokens/tokens.json. Editing it by
// hand works until the next `npm run tokens` silently reverts the edit, and a
// stale generated file means the code and the token source disagree while both
// look fine.
// ---------------------------------------------------------------------------
{
  // Two files now: the components' stylesheet and the copy the Storybook
  // manager loads, which carries the same colour tokens in both modes.
  const paths = ['src/styles/tokens.css', 'public/manager-tokens.css']
  const before = paths.map((p) => readFileSync(p, 'utf8'))
  execFileSync('node', ['scripts/build-tokens.mjs'], { stdio: 'pipe' })
  const stale = paths.filter((p, i) => readFileSync(p, 'utf8') !== before[i])
  if (stale.length) {
    paths.forEach((p, i) => writeFileSync(p, before[i]))
    fail(
      'generated tokens are current',
      `not what tokens/tokens.json generates: ${stale.join(', ')}. Run \`npm run tokens\` and commit` +
        ' the result (this check restored your copy rather than leaving the tree dirty).',
    )
  } else {
    pass('generated tokens are current', paths.join(', '))
  }
}

// ---------------------------------------------------------------------------
// 1b. Every colour token has both modes, and every one is documented.
//
// Colour is the only collection with modes. A token added with just a light
// value would fall back to its light value in dark mode — which renders, looks
// deliberate, and is wrong. Two tokens were also sitting in the Figma file
// undocumented on the Colour page before this check existed.
// ---------------------------------------------------------------------------
{
  const tokens = JSON.parse(readFileSync('tokens/tokens.json', 'utf8'))
  const oneMode = Object.entries(tokens.color)
    .filter(([, v]) => !v || typeof v !== 'object' || !v.light || !v.dark)
    .map(([k]) => k)

  if (oneMode.length) fail('every colour token has both modes', oneMode.join(', '))
  else pass('every colour token has both modes', `${Object.keys(tokens.color).length} tokens`)

  // A fully transparent token has nothing to show, so it is deliberately not
  // given a swatch.
  const undocumented = ['bg/transparent']
  const page = readFileSync('src/foundations/Colour.stories.tsx', 'utf8')
  const listed = new Set([...page.matchAll(/'--color-([a-z0-9-]+)'/g)].map((m) => m[1]))
  const absent = Object.keys(tokens.color)
    .filter((k) => !undocumented.includes(k))
    .filter((k) => !listed.has(k.replace(/\//g, '-')))

  if (absent.length) fail('every colour token is on the Colour page', absent.join(', '))
  else pass('every colour token is on the Colour page')
}

// ---------------------------------------------------------------------------
// 2. No colour literals in the components.
//
// Every component is supposed to reach for a token. One hard-coded hex is
// invisible in review and survives a re-theme, which is the whole point of
// having tokens.
// ---------------------------------------------------------------------------
{
  const offenders = []
  for (const f of srcFiles.filter((f) => f.startsWith('src/components/'))) {
    const text = readFileSync(f, 'utf8')
    text.split('\n').forEach((line, i) => {
      const m = line.match(/#[0-9a-fA-F]{3,8}\b|\brgba?\(/)
      if (m) offenders.push(`${f}:${i + 1} ${m[0]}`)
    })
  }
  if (offenders.length) fail('components use tokens, not colour literals', offenders.join('\n         '))
  else pass('components use tokens, not colour literals', `${srcFiles.filter((f) => f.startsWith('src/components/')).length} files`)
}

// ---------------------------------------------------------------------------
// 2b. No component names a duration or a curve in numbers.
//
// Motion is tokenised through Tailwind's transition defaults, so a component
// that writes `duration-200` or an easing literal has stepped outside the scale
// — and unlike a hard-coded colour it is invisible in review, because the
// difference between 150ms and 200ms cannot be seen in a diff.
//
// Arbitrary values referring to a token, `duration-[var(--duration-base)]`, are
// the supported way to ask for something other than the default.
// ---------------------------------------------------------------------------
{
  const offenders = []
  for (const f of srcFiles.filter((f) => f.startsWith('src/components/') && !f.includes('.stories.'))) {
    readFileSync(f, 'utf8')
      .split('\n')
      .forEach((line, i) => {
        const literal =
          // duration-200, delay-75 — Tailwind's numeric scale
          /\b(?:duration|delay)-\d+/.exec(line) ??
          // a curve written out, or a bare ms/s value in a style prop
          /cubic-bezier\([^)]*\)/.exec(line) ??
          /transition(?:-duration|-timing-function)?:\s*[^v\n]*\d+m?s/.exec(line)
        if (literal) offenders.push(`${f}:${i + 1} ${literal[0].trim()}`)
      })
  }
  if (offenders.length) fail('components use motion tokens, not literals', offenders.join('\n         '))
  else pass('components use motion tokens, not literals')
}

// ---------------------------------------------------------------------------
// 3. Every internal link resolves to a story that exists.
//
// These links are built from story ids, and a story id is derived from its
// title. Renaming a title moves the id and leaves the link pointing at nothing
// — which shows up as a blank page, not an error. This already happened once.
// ---------------------------------------------------------------------------
{
  const index = JSON.parse(readFileSync(join(STATIC, 'index.json'), 'utf8')).entries
  const toStoryId = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

  const wanted = new Set()
  for (const f of srcFiles) {
    const text = readFileSync(f, 'utf8')
    // Links written out in full.
    for (const m of text.matchAll(/storyHref\(\s*'([^']+)'/g)) wanted.add(m[1])
    // The catalog builds its links from each entry's Storybook title, so the
    // titles are what has to resolve.
    if (f.endsWith('Catalog.stories.tsx')) {
      for (const m of text.matchAll(/title: '([^']*\/[^']*)'/g)) wanted.add(`${toStoryId(m[1])}--docs`)
    }
  }

  const dead = [...wanted].filter((id) => !index[id])
  if (dead.length) fail('internal links resolve', `no story with these ids:\n         ${dead.join('\n         ')}`)
  else pass('internal links resolve', `${wanted.size} links`)
}

// ---------------------------------------------------------------------------
// 4. The numbers on the Welcome page are still true.
//
// Four counts are stated as fact there. Three are hand-written, so they drift
// the moment a component or a token is added. The icon count derives itself and
// needs no checking.
// ---------------------------------------------------------------------------
{
  const index = JSON.parse(readFileSync(join(STATIC, 'index.json'), 'utf8')).entries
  const entries = Object.values(index)
  const tokens = JSON.parse(readFileSync('tokens/tokens.json', 'utf8'))

  const countLeaves = (o) => {
    let n = 0
    const w = (x) => { for (const v of Object.values(x)) (v && typeof v === 'object' ? w(v) : n++) }
    w(o)
    return n
  }
  // A type step counts once, not once per property: `type/body/md` is one token
  // to a designer even though it carries a size, line height, tracking and
  // weight.
  const typeSteps = (() => {
    let n = 0
    const w = (o) => {
      for (const v of Object.values(o)) {
        const nested = v && typeof v === 'object' && Object.values(v).some((x) => x && typeof x === 'object')
        nested ? w(v) : n++
      }
    }
    w(tokens.type)
    return n
  })()

  const actual = {
    components: entries.filter((e) => e.type === 'docs' && e.title.startsWith('Components/')).length,
    // A colour token counts once however many modes it has, the same way a type
    // step counts once however many properties it carries. `surface/default` is
    // one token to a designer, not two because it has a light and a dark value.
    'design tokens': Object.entries(tokens)
      .filter(([k]) => k !== 'type' && k !== 'color')
      .reduce((a, [, v]) => a + countLeaves(v), 0) + typeSteps + Object.keys(tokens.color).length,
    'documented variants': entries.filter((e) => e.type === 'story' && e.title.startsWith('Components/')).length,
  }

  const welcome = readFileSync('src/pages/Welcome.stories.tsx', 'utf8')
  const stated = Object.fromEntries(
    [...welcome.matchAll(/<Stat value="(\d+)" label="([^"]+)"/g)].map((m) => [m[2], Number(m[1])]),
  )

  const wrong = Object.entries(actual)
    .filter(([label, n]) => stated[label] !== n)
    .map(([label, n]) => `${label}: page says ${stated[label] ?? '(missing)'}, actually ${n}`)

  if (wrong.length) fail('Welcome page counts are current', wrong.join('\n         '))
  else pass('Welcome page counts are current', Object.entries(actual).map(([k, v]) => `${v} ${k}`).join(', '))
}

// ---------------------------------------------------------------------------
// 5. Every Storybook internal the CSS overrides hang off still exists.
//
// The sidebar and docs chrome are restyled from manager-head.html and
// preview-head.html, which have to target Storybook's own markup. Those hooks
// are not API. If an upgrade renames one, the rule stops matching and the
// styling quietly reverts to Storybook's defaults — no error, no build failure.
//
// This looks for each hook in the built site, skipping index.html and
// iframe.html, which is where our own CSS ends up and would match itself.
// ---------------------------------------------------------------------------
{
  const heads = ['.storybook/manager-head.html', '.storybook/preview-head.html']
  const hooks = new Set()
  for (const f of heads) {
    const css = readFileSync(f, 'utf8')
    for (const m of css.matchAll(/[.#]((?:sb|sbdocs|storybook|sidebar|docblock)[\w-]*)/g)) hooks.add(m[1])
    for (const m of css.matchAll(/\[data-[\w-]+=['"]([\w-]{4,})['"]\]/g)) {
      if (!['true', 'false'].includes(m[1])) hooks.add(m[1])
    }
  }

  const haystack = walk(STATIC)
    .filter((f) => ['.js', '.css', '.html', '.json'].includes(extname(f)))
    .filter((f) => !['storybook-static/index.html', 'storybook-static/iframe.html'].includes(f))

  const missing = new Set(hooks)
  for (const f of haystack) {
    if (!missing.size) break
    const text = readFileSync(f, 'utf8')
    for (const h of [...missing]) if (text.includes(h)) missing.delete(h)
  }

  if (missing.size) {
    fail(
      'CSS overrides still target real Storybook markup',
      `these hooks are gone from the built site, so the rules using them do nothing:\n         ${[...missing].join('\n         ')}`,
    )
  } else {
    pass('CSS overrides still target real Storybook markup', `${hooks.size} hooks`)
  }
}

// ---------------------------------------------------------------------------
console.log('\nContract checks\n')
for (const n of notes) console.log(n)
if (failures.length) {
  console.log('')
  for (const f of failures) console.log(`  FAIL  ${f.check}\n         ${f.detail}\n`)
  console.log(`${failures.length} of ${failures.length + notes.length} checks failed.\n`)
  process.exit(1)
}
console.log(`\n${notes.length} checks passed.\n`)
