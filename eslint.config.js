import js from '@eslint/js'
import { apiBoundaries } from './tools/eslint/api-boundaries.js'
import { boundaries } from './tools/eslint/fsd.js'
import stylistic from '@stylistic/eslint-plugin'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['.nx/**', 'dist/**', 'test-results/**', 'playwright-report/**'] },
  {
    files: ['**/*.{js,ts,tsx}'],
    plugins: { '@stylistic': stylistic },
    rules: { '@stylistic/max-len': ['error', { code: 120, tabWidth: 2 }] },
  },
  {
    files: ['apps/{web,admin}/src/**/*.{ts,tsx}', 'worker/**/*.ts', 'tests/**/*.ts'],
    plugins: { fsd: { rules: { boundaries } } },
    rules: { 'fsd/boundaries': 'error' },
  },
  {
    files: ['apps/api/src/**/*.ts'],
    plugins: { api: { rules: { boundaries: apiBoundaries } } },
    rules: { 'api/boundaries': 'error' },
  },
  {
    files: ['tools/eslint/*.js'],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['apps/web/public/*.js', 'eslint.config.js'],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.browser },
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
)
