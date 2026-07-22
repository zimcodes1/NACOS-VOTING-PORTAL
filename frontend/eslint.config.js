import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules', '.tanstack']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': ['error', {
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_',
        'ignoreRestSiblings': true
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // General JavaScript rules
      'no-console': 'off',
      'no-debugger': 'error',
      'no-alert': 'warn',
      'no-unused-vars': 'off', // Let TypeScript handle this
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-arrow-callback': 'error',

      // React specific rules
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true, allowExportNames: ['Route'] }],

      // Import rules
      'no-duplicate-imports': 'error',

      // Function rules
      'func-names': 'off',
      'no-empty-function': 'warn',

      // Code quality rules
      'eqeqeq': ['error', 'always'],
      'curly': 'off',
      'brace-style': ['error', '1tbs'],
      'comma-dangle': 'off',
      'quotes': 'off',
      'semi': 'off',
      'indent': 'off',
      'max-len': 'off',
      'no-trailing-spaces': 'off',
      'no-multiple-empty-lines': ['error', { 'max': 1 }],
    },
  },
])