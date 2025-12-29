// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  // 忽略的文件和目录
  ignores: [
    'node_modules/',
    '.nuxt/',
    '.output/',
    'dist/',
    '.nitro/',
    '.cache/',
    '*.min.js',
    '*.bundle.js',
    'app/api/generated/',
    'pnpm-lock.yaml',
    'bun.lock',
    'package-lock.json',
    'yarn.lock',
    '.DS_Store',
    '*.log',
    '.env',
    '.env.local'
  ],
  // 自定义规则配置
  rules: {
    // 允许示例文件中使用未使用的变量
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }
    ],
    // 允许在特定情况下使用 any 类型（需要添加注释说明原因）
    '@typescript-eslint/no-explicit-any': [
      'warn',
      {
        ignoreRestArgs: true
      }
    ]
  }
})
