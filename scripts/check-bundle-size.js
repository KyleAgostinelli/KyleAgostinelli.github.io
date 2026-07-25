// Bundle size budget, enforced in CI (see .github/workflows/ci.yml). Runs after `next build`.
// Compares each App Router page's real gzipped "First Load JS" (the manifest's chunk list,
// gzipped the same way a browser receives them) against a checked-in baseline in
// bundle-budget.json, and fails on regression past a small tolerance.
//
// Usage:
//   node scripts/check-bundle-size.js            # check against the committed baseline
//   node scripts/check-bundle-size.js --update    # write the current sizes as the new baseline

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { gzipSync } from 'node:zlib'
import { z } from 'zod'

const rootDir = process.cwd()
const nextDir = path.join(rootDir, '.next')
const manifestPath = path.join(nextDir, 'app-build-manifest.json')
const budgetPath = path.join(rootDir, 'bundle-budget.json')

// Regressions under 5% (or under 2KB for tiny routes) are normal churn from dependency
// bumps and shouldn't fail CI. A hard cap catches a route quietly ballooning even if it
// never regresses against its own history in one jump.
const REGRESSION_TOLERANCE = 0.05
const MIN_SLACK_BYTES = 2048
const HARD_CAP_BYTES = 200 * 1024

// Only the fields this script actually reads - the real manifest has more.
const buildManifestSchema = z.object({
  pages: z.record(z.string(), z.array(z.string())),
})
const budgetFileSchema = z.record(z.string(), z.number())

if (!existsSync(manifestPath)) {
  console.error('No .next/app-build-manifest.json found. Run `npm run build` first.')
  process.exit(1)
}

const manifest = buildManifestSchema.parse(JSON.parse(readFileSync(manifestPath, 'utf8')))
/** @type {Map<string, number>} */
const gzipSizeCache = new Map()

/** @param {string} relativeChunkPath */
function gzipSize(relativeChunkPath) {
  const cached = gzipSizeCache.get(relativeChunkPath)
  if (cached !== undefined) return cached
  const absolute = path.join(nextDir, relativeChunkPath)
  const size = gzipSync(readFileSync(absolute)).length
  gzipSizeCache.set(relativeChunkPath, size)
  return size
}

const routes = Object.keys(manifest.pages)
  .filter((route) => route.endsWith('/page'))
  .sort()

/** @type {Record<string, number>} */
const current = {}
for (const route of routes) {
  const files = manifest.pages[route] ?? []
  current[route] = files.reduce((sum, file) => sum + gzipSize(file), 0)
}

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(1)} kB`
}

/** @param {Record<string, number>} budget */
function printTable(budget) {
  const rows = routes.map((route) => {
    const size = current[route] ?? 0
    const baseline = budget[route]
    const delta =
      typeof baseline === 'number' ? (((size - baseline) / baseline) * 100).toFixed(1) : null
    return { route, size, baseline, delta }
  })

  const routeWidth = Math.max(...rows.map((r) => r.route.length), 'Route'.length)
  console.log(`${'Route'.padEnd(routeWidth)}  Gzipped First Load JS  vs. baseline`)
  for (const row of rows) {
    const sizeCol = formatKb(row.size).padStart(10)
    const deltaCol =
      row.delta === null ? 'new' : `${row.delta.startsWith('-') ? '' : '+'}${row.delta}%`
    console.log(`${row.route.padEnd(routeWidth)}  ${sizeCol}             ${deltaCol}`)
  }
}

const shouldUpdate = process.argv.includes('--update')

if (shouldUpdate || !existsSync(budgetPath)) {
  writeFileSync(budgetPath, `${JSON.stringify(current, null, 2)}\n`)
  console.log(shouldUpdate ? 'Bundle budget updated.\n' : 'No baseline yet - writing one now.\n')
  printTable(current)
  process.exit(0)
}

const budget = budgetFileSchema.parse(JSON.parse(readFileSync(budgetPath, 'utf8')))
printTable(budget)

let failed = false
/** @type {string[]} */
const failures = []

for (const route of routes) {
  const size = current[route] ?? 0
  const baseline = budget[route]

  if (size > HARD_CAP_BYTES) {
    failed = true
    failures.push(`${route}: ${formatKb(size)} exceeds the ${formatKb(HARD_CAP_BYTES)} hard cap`)
    continue
  }

  if (typeof baseline !== 'number') continue // new route, nothing to regress against yet

  const allowed = Math.max(baseline * (1 + REGRESSION_TOLERANCE), baseline + MIN_SLACK_BYTES)
  if (size > allowed) {
    failed = true
    failures.push(
      `${route}: ${formatKb(size)} regressed past baseline ${formatKb(baseline)} (allowed up to ${formatKb(allowed)})`,
    )
  }
}

if (failed) {
  console.error('\nBundle size budget exceeded:')
  for (const failure of failures) console.error(`  - ${failure}`)
  console.error(
    '\nIf this growth is expected, run `node scripts/check-bundle-size.js --update` and commit the updated bundle-budget.json.',
  )
  process.exit(1)
}

console.log('\nBundle size within budget.')
