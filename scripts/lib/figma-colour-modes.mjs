/**
 * Read every colour token's Light and Dark value out of the Figma file.
 *
 * Figma's variables endpoint would return all of this directly, but it is
 * Enterprise-only and 403s on this plan. The ordinary file endpoint works, and
 * returns *resolved* fills — so a frame pinned to a mode reports that mode's
 * values.
 *
 * The Foundations / Colour page is laid out in exactly the shape that needs:
 * one group per token, named for the variable, holding a Light swatch and a
 * Dark swatch, each pinned to its mode. Reading the two swatches reads the two
 * values, by name, with no guessing.
 *
 * Shared by `npm run tokens:modes` and the weekly drift check so the two can
 * never disagree about how a value is read.
 */

export const api = async (path, token) => {
  const res = await fetch(`https://api.figma.com/v1/${path}`, { headers: { 'X-Figma-Token': token } })
  if (!res.ok) {
    const where = path.split('?')[0].replace(/files\/[^/]+/, 'files/KEY')
    throw new Error(`Figma returned ${res.status} ${res.statusText} on /v1/${where}`)
  }
  return res.json()
}

/** Figma channels are 0–1 floats; alpha is dropped when fully opaque. */
const toValue = (colour, opacity = 1) => {
  const a = (colour.a ?? 1) * opacity
  const ch = (n) => Math.round(n * 255)
  if (a >= 1) {
    const hex = (n) => ch(n).toString(16).padStart(2, '0')
    return `#${hex(colour.r)}${hex(colour.g)}${hex(colour.b)}`
  }
  // Matches the notation tokens.json already uses for translucent tokens.
  return `rgb(${ch(colour.r)} ${ch(colour.g)} ${ch(colour.b)} / ${+a.toFixed(2)})`
}

/** The first solid fill found anywhere under a node. */
const fillOf = (node) => {
  const solid = (node.fills ?? []).find((f) => f.type === 'SOLID' && f.visible !== false)
  if (solid) return toValue(solid.color, solid.opacity ?? 1)
  for (const child of node.children ?? []) {
    const found = fillOf(child)
    if (found) return found
  }
  return null
}

/**
 * Find the Colour page by name rather than by node id.
 *
 * A hardcoded id looks stable until somebody duplicates the frame or rebuilds
 * the page, at which point it silently stops resolving. Names are what a
 * designer actually keeps.
 */
const findColourFrame = async (fileKey, token) => {
  const file = await api(`files/${fileKey}?depth=2`, token)
  for (const page of file.document.children ?? []) {
    for (const child of page.children ?? []) {
      if (/colou?r/i.test(child.name) && /^(FRAME|SECTION)$/.test(child.type)) {
        // Frames in this file are often already named "Page / Frame", so only
        // prefix the page when it would not repeat it.
        const label = child.name.startsWith(page.name) ? child.name : `${page.name} / ${child.name}`
        return { id: child.id, name: label }
      }
    }
  }
  throw new Error(
    'No frame with "Colour" in its name found in the Figma file. The palette is read from that ' +
      'frame, so either it has been renamed or the page has been restructured.',
  )
}

/**
 * @returns {Promise<{frame: string, modes: Record<string, {light?: string, dark?: string}>}>}
 *   Token name without the `color/` prefix -> its value in each mode.
 */
export async function readColourModes({ fileKey, token }) {
  const frame = await findColourFrame(fileKey, token)
  const response = await api(`files/${fileKey}/nodes?ids=${frame.id}`, token)
  const document = response.nodes[frame.id]?.document
  if (!document) throw new Error(`Figma returned no document for ${frame.name} (${frame.id}).`)

  const modes = {}
  const walk = (node) => {
    if (/^color\//.test(node.name)) {
      const found = {}
      for (const child of node.children ?? []) {
        const mode = child.name.toLowerCase()
        if (mode === 'light' || mode === 'dark') {
          const value = fillOf(child)
          if (value) found[mode] = value
        }
      }
      if (found.light || found.dark) modes[node.name.replace(/^color\//, '')] = found
    }
    for (const child of node.children ?? []) walk(child)
  }
  walk(document)

  if (!Object.keys(modes).length) {
    throw new Error(
      `Read ${frame.name} but found no token groups in it. Each swatch group has to be named for ` +
        'its variable (color/…) and hold a Light and a Dark child.',
    )
  }

  return { frame: frame.name, modes }
}

/**
 * Both notations compared as numbers, so #0b0d0f29 and rgb(11 13 15 / 0.16)
 * agree.
 *
 * A missing value on either side is never equal to anything, including another
 * missing value. Two absences are not agreement — they mean there was nothing
 * to compare, which the caller has to handle as its own case rather than let it
 * pass as a match.
 */
export function sameValue(a, b) {
  if (a === undefined || a === null || b === undefined || b === null) return false
  const parse = (v) => {
    if (!v) return null
    const s = String(v).trim().toLowerCase()
    let m = /^#([0-9a-f]{6})([0-9a-f]{2})?$/.exec(s)
    if (m) {
      const [r, g, b] = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16))
      return [r, g, b, m[2] ? Math.round((parseInt(m[2], 16) / 255) * 100) / 100 : 1]
    }
    m = /^rgb\((\d+) (\d+) (\d+)(?: \/ ([\d.]+))?\)$/.exec(s)
    if (m) return [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : Math.round(+m[4] * 100) / 100]
    return s
  }
  const x = parse(a)
  const y = parse(b)
  if (Array.isArray(x) && Array.isArray(y)) return x.every((n, i) => n === y[i])
  return x === y
}

/**
 * Every solid fill and stroke painted inside a set of nodes, with where it was
 * seen.
 *
 * Used to find colours that are not in the palette at all — a fill typed in by
 * hand rather than bound to a variable. Solid paints only: gradients and images
 * are not a colour anyone could have tokenised, and reporting them would be
 * noise.
 *
 * @returns {Promise<Map<string, string[]>>} value -> the layer paths painting it
 */
export async function readPaintedColours({ fileKey, token, nodeIds }) {
  const found = new Map()
  // Figma caps how much it will return per request, so ask in batches.
  for (let i = 0; i < nodeIds.length; i += 20) {
    const batch = nodeIds.slice(i, i + 20)
    const { nodes } = await api(`files/${fileKey}/nodes?ids=${batch.join(',')}`, token)
    for (const key of Object.keys(nodes)) {
      const root = nodes[key]?.document
      if (!root) continue
      const walk = (node, trail) => {
        const here = trail ? `${trail} / ${node.name}` : node.name
        for (const list of [node.fills, node.strokes]) {
          for (const paint of list ?? []) {
            if (paint.type !== 'SOLID' || paint.visible === false) continue
            const value = toValue(paint.color, paint.opacity ?? 1)
            if (!found.has(value)) found.set(value, [])
            const where = found.get(value)
            if (where.length < 4 && !where.includes(here)) where.push(here)
          }
        }
        for (const child of node.children ?? []) walk(child, here)
      }
      walk(root, '')
    }
  }
  return found
}
