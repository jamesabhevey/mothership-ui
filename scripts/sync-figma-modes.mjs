#!/usr/bin/env node
/**
 * Print every colour token's Light and Dark value from Figma, as JSON.
 *
 * For pulling the palette in by hand — seeding it, or after a restructure the
 * drift check cannot apply on its own. For the routine question of whether the
 * two still agree, use `npm run tokens:drift`, which reads Figma exactly the
 * same way and reports the differences.
 *
 *   FIGMA_TOKEN=… FIGMA_FILE_KEY=… node scripts/sync-figma-modes.mjs
 */
import { readColourModes } from './lib/figma-colour-modes.mjs'

const TOKEN = process.env.FIGMA_TOKEN
const FILE_KEY = process.env.FIGMA_FILE_KEY
if (!TOKEN || !FILE_KEY) {
  console.error('FIGMA_TOKEN and FIGMA_FILE_KEY must both be set.')
  process.exit(1)
}

const { frame, modes } = await readColourModes({ fileKey: FILE_KEY, token: TOKEN })

console.log('FIGMA_MODES_JSON_START')
console.log(JSON.stringify(modes, null, 2))
console.log('FIGMA_MODES_JSON_END')
console.error(`\n${Object.keys(modes).length} colour tokens read from ${frame}.`)
