// @ts-check

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import love from 'eslint-config-love'
import eslintConfigPrettier from 'eslint-config-prettier'

export default tseslint.config(
  {
    ignores: [
      ".keystone/*"
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.strict,
  love,
  eslintConfigPrettier,
);