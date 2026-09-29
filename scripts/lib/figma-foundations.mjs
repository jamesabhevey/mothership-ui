/**
 * Read the type scale and the dimension scale out of the Figma file.
 *
 * Same constraint as the colour reader: Figma's variables endpoint is
 * Enterprise-only and 403s on this plan, so nothing can be read by asking for
 * the variables themselves. The ordinary file endpoint works, and the
 * Foundations pages happen to be laid out in a shape that can be read exactly.
 *
 * Typography: one frame per role, named for the token — `type/display/lg` —
 * holding a label and a specimen. The specimen is set in the style it
 * documents, so its own resolved size, line height, tracking and weight *are*
 * the token's values. Nothing is parsed out of prose.
 *
 * Dimension: one frame per token, named for it — `space/16`, `radius/md` —
 * holding a label and the value written out as text. Read as the token's own
 * stated number rather than measured off the artwork, which is what makes this
 * safe: an earlier attempt at numbers tried to infer them from geometry and
 * produced false alarms, because 4px occurs everywhere in a Figma file and
 * there is no way to tell a radius from an unrelated gap.
 *
 * Motion is not here, and cannot be. Its durations and curves exist only as
 * Figma variables with no documented page to read them from, and variables are
 * the one thing this plan cannot fetch.
 */
import { api } from './figma-colour-modes.mjs'

/**
 * Names are compared with their separators removed.
 *
 * Figma writes `size/control/min-target` where the code, having flattened the
 * path into a key, writes `size/control/min/target`. They are the same token,
 * and a comparison that did not know that would report two phantom differences
 * every Monday — which is how a check gets ignored.
 */
export const normaliseName = (name) => name.toLowerCase().replace(/[-/\s]/g, '')

/** Find a frame under the Foundations page by what it is called. */
const findFoundationFrame = async (fileKey, token, pattern, what) => {
  const file = await api(`files/${fileKey}?depth=2`, token)
  for (const page of file.document.children ?? []) {
    for (const child of page.children ?? []) {
      if (pattern.test(child.name) && /^(FRAME|SECTION)$/.test(child.type)) {
        return { id: child.id, name: child.name }
      }
    }
  }
  throw new Error(
    `No frame matching ${what} found in the Figma file. Either it has been renamed or the ` +
      'Foundations page has been restructured.',
  )
}

const subtree = async (fileKey, token, id) => {
  const { nodes } = await api(`files/${fileKey}/nodes?ids=${encodeURIComponent(id)}`, token)
  const node = nodes?.[id]?.document
  if (!node) throw new Error(`Figma returned no node for ${id}`)
  return node
}

const descend = (node, out = []) => {
  out.push(node)
  for (const child of node.children ?? []) descend(child, out)
  return out
}

const textsUnder = (node) => descend(node).filter((n) => n.type === 'TEXT')

/**
 * @returns {Promise<{frame: string, styles: Record<string, {size: string, lineHeight: string,
 *   letterSpacing: string, weight: string}>}>} Token name without the `type/` prefix.
 */
export async function readTypeStyles({ fileKey, token }) {
  const frame = await findFoundationFrame(fileKey, token, /typograph/i, 'Typography')
  const root = await subtree(fileKey, token, frame.id)

  const styles = {}
  for (const group of root.children ?? []) {
    if (!/^type\//i.test(group.name)) continue
    const name = group.name.replace(/^type\//i, '')

    // The label restates the token name and the numbers; the specimen is the
    // pangram. Telling them apart by their text rather than their order, so
    // reordering the frame cannot silently swap which one is read.
    const specimens = textsUnder(group).filter(
      (t) => !normaliseName(t.characters ?? '').startsWith(normaliseName(group.name)),
    )
    if (specimens.length !== 1) continue

    const s = specimens[0].style ?? {}
    if (s.fontSize == null) continue
    styles[name] = {
      size: `${Math.round(s.fontSize)}px`,
      lineHeight: s.lineHeightPx == null ? '' : `${Math.round(s.lineHeightPx)}px`,
      // Figma reports tracking in px at this scale, matching tokens.json.
      letterSpacing: `${+(s.letterSpacing ?? 0).toFixed(2)}px`.replace('-0px', '0px'),
      weight: String(s.fontWeight ?? ''),
    }
  }

  if (!Object.keys(styles).length) {
    throw new Error(
      `The ${frame.name} frame has no frames named "type/…" in it, so no text style could be ` +
        'read. The page has been restructured.',
    )
  }
  return { frame: frame.name, styles }
}

/**
 * @returns {Promise<{frame: string, values: Record<string, {value: string, section: string}>}>}
 *   Full token name as Figma writes it -> its stated value in px.
 */
export async function readDimensions({ fileKey, token }) {
  const frame = await findFoundationFrame(fileKey, token, /dimension/i, 'Dimension')
  const root = await subtree(fileKey, token, frame.id)

  const values = {}
  for (const section of root.children ?? []) {
    for (const row of section.children ?? []) {
      if (!/^(space|radius|border-width|size)\//i.test(row.name)) continue
      const texts = (row.children ?? []).filter((t) => t.type === 'TEXT')
      // The one that is a bare number. The others are the name and the note.
      const number = texts.map((t) => (t.characters ?? '').trim()).find((c) => /^\d+$/.test(c))
      if (number == null) continue
      values[row.name] = { value: `${number}px`, section: section.name }
    }
  }

  if (!Object.keys(values).length) {
    throw new Error(
      `The ${frame.name} frame has no token rows in it, so no dimension could be read. The page ` +
        'has been restructured.',
    )
  }
  return { frame: frame.name, values }
}
