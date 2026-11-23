import { build } from 'esbuild'
import { cp } from 'node:fs/promises'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const dependencies = Object.keys(require('./package.json').dependencies)
await build({
  entryPoints: ['apps/api/src/main.ts'],
  outfile: 'dist/api/main.cjs',
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node22',
  tsconfig: 'apps/api/tsconfig.json',
  external: dependencies.filter((name) => name !== '@legado/domain'),
})
await cp('apps/api/migrations', 'dist/api/migrations', { recursive: true })
