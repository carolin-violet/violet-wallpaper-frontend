# OpenAPI / Swagger 集成文档

本项目已集成 **OpenAPI TypeScript Codegen**，支持从后端 Swagger 文档自动生成 TypeScript API 客户端。

## 功能特性

- ✅ 从 Swagger/OpenAPI 文档自动生成 TypeScript 类型和 API 客户端
- ✅ 支持本地文件或远程 URL 生成
- ✅ 完整的 TypeScript 类型支持
- ✅ 基于 Axios 的 HTTP 客户端
- ✅ 认证 Token 管理
- ✅ 与 Nuxt 4 完美集成

## 生成 API 客户端

### 方式一：从本地 OpenAPI 文件生成

1. 将后端 Swagger 文档导出为 JSON 格式，保存为 `openapi.config.json`（或修改脚本中的文件路径）

2. 运行生成命令：

```bash
pnpm run generate:api
```

### 方式二：从远程 Swagger URL 生成

如果后端提供了 Swagger 文档访问地址（如 `http://127.0.0.1:8203/openapi.json`），可直接从 URL 生成：

```bash
pnpm run generate:api:url
```

或者指定自定义 URL：

```bash
node scripts/generate-api.mjs --input=http://127.0.0.1:8203/openapi.json
```

## 使用生成的 API 客户端

生成的 API 客户端代码位于 `app/api/generated/` 目录。在组件或页面中使用：

```typescript
import { getApiClient } from "~/api/client";

// 获取 API 客户端实例
const api = await getApiClient();

// 调用 API（示例，实际方法名取决于你的 Swagger 文档）
const response = await api.someService.getSomeData({ ...params });
```

### 在 Vue 组件中使用

```vue
<script setup lang="ts">
import { getApiClient } from "~/api/client";

// 在 setup 中调用
const api = await getApiClient();
const data = await api.someService.getSomeData({ ... });
</script>
```

### 在 Composable 中使用

```typescript
// composables/useApi.ts
import { getApiClient } from "~/api/client";

export const useApi = async () => {
  const api = await getApiClient();
  return api;
};
```

## 配置 API 基础地址

### 方式一：环境变量（推荐）

在项目根目录创建 `.env` 文件（或 `.env.local`）：

```env
API_BASE_URL=http://127.0.0.1:8203
```

### 方式二：Nuxt 配置

在 `nuxt.config.ts` 中直接配置 `runtimeConfig.public.apiBaseUrl`：

```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || "http://127.0.0.1:8203",
    },
  },
});
```

## 认证 Token 设置

如果 API 需要认证，可以使用封装的工具函数：

```typescript
import { setApiToken, clearApiToken } from "~/api/client";

// 设置 token
await setApiToken("your-token-here");

// 清除 token
await clearApiToken();
```

### 设置自定义请求头

```typescript
import { setApiHeaders } from "~/api/client";

await setApiHeaders({
  "X-Custom-Header": "value",
  Authorization: "Bearer token",
});
```

## 项目结构

```
app/api/
  ├── generated/          # 自动生成的 API 客户端代码（运行生成命令后出现）
  ├── client.ts          # API 客户端封装工具
  └── example.ts         # 使用示例

scripts/
  └── generate-api.mjs   # API 生成脚本

openapi.config.json      # OpenAPI 配置文件模板
```

## 常见问题

### 1. 生成失败：找不到 OpenAPI 文档

**问题**：运行 `pnpm run generate:api` 时提示找不到文件。

**解决**：

- 确保 `openapi.config.json` 文件存在于项目根目录
- 或者使用 `pnpm run generate:api:url` 从远程 URL 生成
- 检查文件路径是否正确

### 2. API 客户端未初始化错误

**问题**：使用 `getApiClient()` 时提示未初始化。

**解决**：

- 确保已运行 `pnpm run generate:api` 生成 API 客户端代码
- 检查 `app/api/generated/` 目录是否存在且包含生成的文件
- 使用 `await getApiClient()` 而不是同步调用

### 3. 类型错误

**问题**：TypeScript 提示找不到生成的类型。

**解决**：

- 重新运行生成命令
- 检查 `app/api/generated/` 目录中的类型定义文件
- 重启 TypeScript 服务器（VS Code: Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"）

### 4. 如何更新 API 客户端

当后端 API 发生变化时，只需重新运行生成命令：

```bash
pnpm run generate:api
```

或

```bash
pnpm run generate:api:url
```

生成工具会自动覆盖旧的代码。

## 相关资源

- [OpenAPI TypeScript Codegen 文档](https://github.com/ferdikoomen/openapi-typescript-codegen)
- [OpenAPI 规范](https://swagger.io/specification/)
- [Nuxt 官方文档](https://nuxt.com)
