# 兼容性问题记录

本文档记录项目开发过程中遇到的兼容性问题和解决方案。

## 问题 1: @nuxt/ui 与 reka-ui 的 SSR 兼容性问题

### 问题描述

在使用 `@nuxt/ui` 4.2.1 版本时，启用 SSR（服务器端渲染）会导致运行时错误。

### 错误信息

```
Cannot read properties of null (reading 'ce')
at renderSlot (node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:3011:32)
at Proxy.<anonymous> (node_modules/reka-ui/dist/ConfigProvider/ConfigProvider.js:47:11)
at renderComponentRoot (node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:4473:16)
at renderComponentSubTree (node_modules/@vue/server-renderer/dist/server-renderer.cjs.js:754:28)
```

### 影响范围

- **版本**: `@nuxt/ui@4.2.1`
- **依赖**: `reka-ui@2.6.0`
- **影响**: 无法使用 SSR 功能，只能使用 SPA 模式

### 根本原因

`@nuxt/ui` 内部使用的 `reka-ui` 的 `ConfigProvider` 组件在服务器端渲染时，`currentRenderingInstance` 为 `null`，导致无法访问 `ce` 属性。这是 `reka-ui` 在 SSR 环境下的已知兼容性问题。

### 解决方案

**临时解决方案**：在 `nuxt.config.ts` 中禁用 SSR

```typescript
export default defineNuxtConfig({
  // 暂时禁用 SSR 以避免 reka-ui ConfigProvider 错误
  // 这是一个已知的 @nuxt/ui 4.2.1 与 reka-ui 的 SSR 兼容性问题
  ssr: false,
  
  // ... 其他配置
})
```

### 影响说明

**优点**：
- ✅ 应用可以正常运行
- ✅ 避免了 SSR 错误
- ✅ 开发体验不受影响

**缺点**：
- ❌ 无法使用 SSR，影响 SEO
- ❌ 首屏加载可能较慢（完全客户端渲染）
- ❌ 无法进行预渲染（prerender）

### 后续建议

1. **等待官方修复**：关注 `@nuxt/ui` 和 `reka-ui` 的更新，等待官方修复 SSR 兼容性问题

2. **升级版本**：定期检查是否有新版本发布，尝试升级到最新版本：
   ```bash
   pnpm up @nuxt/ui
   ```

3. **替代方案**：如果必须使用 SSR，可以考虑：
   - 使用其他 UI 组件库
   - 等待兼容性修复后再启用 SSR
   - 使用 `ClientOnly` 组件包裹有问题的组件（但 `UApp` 是根组件，无法包裹）

4. **监控问题**：
   - GitHub Issues: 关注 `@nuxt/ui` 和 `reka-ui` 的相关 issue
   - 定期检查更新日志

### 相关链接

- [Nuxt UI 官方文档](https://ui.nuxt.com)
- [Reka UI GitHub](https://github.com/reka-ui/reka-ui)
- [Nuxt SSR 文档](https://nuxt.com/docs/guide/concepts/rendering)

### 更新时间

- **首次记录**: 2025-01-15
- **最后更新**: 2025-01-15

---

## 问题 2: Google Fonts 网络连接超时

### 问题描述

在开发环境中，`@nuxt/fonts` 模块尝试从 Google Fonts 获取字体元数据时出现连接超时错误。

### 错误信息

```
ERROR  Could not initialize provider google. unifont will not be able to process fonts provided by this provider.
[GET] "https://fonts.google.com/metadata/fonts": <no response> fetch failed
[cause]: Connect Timeout Error (attempted address: fonts.google.com:443, timeout: 10000ms)
```

### 影响范围

- **模块**: `@nuxt/fonts` (通过 `@nuxt/ui` 引入)
- **影响**: 启动时会有警告/错误，但不影响应用运行

### 根本原因

网络环境无法访问 Google Fonts API，导致连接超时。

### 解决方案

在 `nuxt.config.ts` 中禁用 Google Fonts 提供程序：

```typescript
export default defineNuxtConfig({
  // 禁用 Google Fonts 提供程序以避免网络连接问题
  fonts: {
    providers: {
      google: false,
      googleicons: false,
    },
  },
  
  // ... 其他配置
})
```

同时，在 `app/assets/css/main.css` 中使用系统字体：

```css
@theme static {
  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
```

### 影响说明

**优点**：
- ✅ 避免了网络连接错误
- ✅ 使用系统字体，加载更快
- ✅ 无需网络请求

**缺点**：
- ❌ 无法使用 Google Fonts 的自定义字体
- ❌ 字体样式受系统限制

### 后续建议

1. **使用本地字体**：如果需要特定字体，可以下载字体文件并本地引用

2. **使用 CDN**：如果网络环境允许，可以使用国内字体 CDN

3. **配置代理**：在开发环境中配置代理来访问 Google Fonts

### 更新时间

- **首次记录**: 2025-01-15
- **最后更新**: 2025-01-15

---

## 问题记录模板

当遇到新的兼容性问题时，请按照以下格式记录：

```markdown
## 问题 N: [问题标题]

### 问题描述
[简要描述问题]

### 错误信息
```
[完整的错误堆栈信息]
```

### 影响范围
- **版本**: [相关版本号]
- **依赖**: [相关依赖]
- **影响**: [影响说明]

### 根本原因
[问题根本原因分析]

### 解决方案
[解决方案代码示例]

### 影响说明
**优点**：
- ✅ [优点1]
- ✅ [优点2]

**缺点**：
- ❌ [缺点1]
- ❌ [缺点2]

### 后续建议
1. [建议1]
2. [建议2]

### 相关链接
- [相关文档或链接]

### 更新时间
- **首次记录**: YYYY-MM-DD
- **最后更新**: YYYY-MM-DD
```

