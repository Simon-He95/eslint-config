// @ts-check
import styleMigrate from '@stylistic/eslint-plugin-migrate'
import simon_he from './dist/index.js'

export default simon_he(
  {
    vue: true,
    typescript: true,
    ignores: [
      'fixtures',
      '_fixtures',
    ],
  },
  {
    files: ['src/**/*.ts'],
    rules: {
      'sort-keys/sort-keys-fix': 'error',
    },
  },
  {
    files: ['src/configs/*.ts'],
    plugins: {
      'style-migrate': styleMigrate,
    },
    rules: {
      'style-migrate/migrate': ['error', { namespaceTo: 'style' }],
    },
  },
)
