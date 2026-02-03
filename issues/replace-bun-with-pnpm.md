## 背景

项目原先以 Bun 作为默认运行与脚本执行环境（`bun install` / `bun run dev` / `bunx` 等）。现统一切换为 **pnpm + Node.js**，避免 Bun 环境差异导致的 Nuxt 启动/依赖解析问题。

## 目标

- 默认包管理器与运行指令统一为 **pnpm**
- OpenAPI 生成脚本不依赖 Bun（可用 Node.js 直接执行）
- 清理 Bun 相关锁文件与文档说明

## 执行计划（精简版）

1. **改造 API 生成脚本**
   - 文件：`scripts/generate-api.ts`
   - 调整：移除 `bun` 运行时与 `spawn`/`Bun.write`，改为 Node.js 内置能力（`child_process.spawn`、`fs/promises.writeFile`）。
   - 命令：将 `bunx openapi-typescript-codegen` 替换为 `pnpm exec openapi-typescript-codegen`。

2. **更新项目脚本**
   - 文件：`package.json`
   - 调整：`generate:api` / `generate:api:url` 从 `bun run ...` 改为 `node scripts/generate-api.ts ...`

3. **更新文档与提示文案**
   - 文件：`README.md`、`docs/OPENAPI.md`、`docs/WALLPAPER_SITE.md`、`docs/COMPATIBILITY_ISSUES.md`、`app/api/client.ts`、`app/api/example.ts`、`app/api/generated/.gitkeep`、`AGENTS.md`
   - 调整：将所有 `bun ...` 改为 `pnpm ...`（以及 `bun update` 改为 `pnpm up`）。

4. **清理 Bun 锁文件**
   - 文件：`bun.lock`
   - 调整：删除；保留并使用 `pnpm-lock.yaml` 作为唯一锁文件。

5. **验证**
   - `pnpm install`
   - `pnpm dev`
   - `pnpm run generate:api:url`

