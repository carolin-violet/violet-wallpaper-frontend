/**
 * OpenAPI 代码生成脚本（Node.js 版本）
 * 支持从本地文件或远程 URL 生成 TypeScript API 客户端。
 *
 * 当输入为 URL 时，会先下载到临时文件再生成，避免解析 $ref 时的 HTTP 请求问题。
 */

import { existsSync, mkdirSync, rmSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

const args = process.argv.slice(2)
const input = args.find(arg => arg.startsWith('--input='))?.split('=')[1]
const output = args.find(arg => arg.startsWith('--output='))?.split('=')[1] || './app/api/generated'
const client = args.find(arg => arg.startsWith('--client='))?.split('=')[1] || 'axios'
if (!input) {
  console.error('❌ 错误: 请提供 --input 参数（OpenAPI 文档路径或 URL）')
  console.log('\n使用方法:')
  console.log('  node scripts/generate-api.mjs --input=./openapi.json')
  console.log('  node scripts/generate-api.mjs --input=http://127.0.0.1:8203/openapi.json')
  process.exit(1)
}
const isUrl = input.startsWith('http://') || input.startsWith('https://')
const isFile = !isUrl && existsSync(input)
if (!isUrl && !isFile) {
  console.error(`❌ 错误: 输入文件不存在: ${input}`)
  process.exit(1)
}
let actualInput = input
let tempFilePath = null
if (isUrl) {
  try {
    const res = await fetch(input)
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    }
    const json = await res.json()
    const tempDir = join(tmpdir(), 'violet-wallpaper-openapi')
    mkdirSync(tempDir, { recursive: true })
    tempFilePath = join(tempDir, 'openapi.json')
    await writeFile(tempFilePath, JSON.stringify(json, null, 2), 'utf8')
    actualInput = tempFilePath
  } catch (err) {
    console.error(`❌ 无法从 URL 获取 OpenAPI 文档: ${input}`)
    console.error(err instanceof Error ? err.message : err)
    process.exit(1)
  }
}
console.log('📦 开始生成 API 客户端...')
console.log(`   输入: ${input}${tempFilePath ? ' (已下载到临时文件)' : ''}`)
console.log(`   输出: ${output}`)
console.log(`   客户端: ${client}\n`)
try {
  const child = spawn(
    'pnpm',
    [
      'exec',
      'openapi',
      '--input',
      actualInput,
      '--output',
      output,
      '--client',
      client,
      '--useOptions',
      '--useUnionTypes'
    ],
    { stdio: 'inherit', shell: process.platform === 'win32' }
  )
  const exitCode = await new Promise((resolve) => {
    child.on('close', code => resolve(code ?? 1))
  })
  if (tempFilePath) {
    try {
      rmSync(tempFilePath, { force: true })
    } catch {
      // ignore
    }
  }
  if (exitCode === 0) {
    console.log('\n✅ API 客户端生成成功！')
    console.log(`   输出目录: ${output}`)
  } else {
    console.error(`\n❌ 生成失败，退出码: ${exitCode}`)
    process.exit(1)
  }
} catch (error) {
  if (tempFilePath) {
    try {
      rmSync(tempFilePath, { force: true })
    } catch {
      // ignore
    }
  }
  console.error('❌ 生成过程中出现错误:', error)
  process.exit(1)
}
