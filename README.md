## Violet Wallpaper Frontend（基于 Bun 的 Nuxt 项目）

本项目是使用 **Nuxt 4 + Nuxt UI** 构建的前端应用，已适配 **Bun** 运行环境。

- **框架**: Nuxt 4
- **UI**: Nuxt UI
- **运行环境**: Bun

### 核心依赖版本

以下两个依赖为项目基石，升级或替换时需注意兼容性：

| 依赖 | 版本范围 | 说明 |
|------|----------|------|
| `nuxt` | ^4.2.2 | 应用框架，路由、SSR、构建等 |
| `@nuxt/ui` | ^4.2.1 | UI 组件库（基于 Reka UI + Tailwind） |

更多关于 Nuxt UI 的信息可参考官方文档：<https://ui.nuxt.com>

## 前置条件

- 已安装 **Bun**（推荐使用最新版）

### 安装 Bun

#### Windows

使用 PowerShell 执行以下命令：

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

或者使用 Scoop 安装：

```powershell
scoop install bun
```

#### macOS / Linux

使用 curl 安装：

```bash
curl -fsSL https://bun.sh/install | bash
```

或者使用 npm 全局安装：

```bash
npm install -g bun
```

#### 验证安装

安装完成后，在终端执行以下命令验证是否安装成功：

```bash
bun --version
```

更多安装方式可参考 Bun 官方文档：`https://bun.sh`

## 安装依赖

在项目根目录执行：

```bash
bun install
```

这会根据 `package.json` 安装项目依赖并执行 `postinstall`（`nuxt prepare`）。

## OpenAPI / Swagger 集成

本项目已集成 **OpenAPI TypeScript Codegen**，支持从后端 Swagger 文档自动生成 TypeScript API 客户端。

详细使用说明请参考：[OpenAPI 集成文档](./docs/OPENAPI.md)

## 启动开发服务器

启动本地开发环境（默认 `http://localhost:3000`）：

```bash
bun run dev
```

## 构建生产环境

构建生产包：

```bash
bun run build
```

## 预览生产构建

本地预览构建结果：

```bash
bun run preview
```

## 部署

构建完成后，可将生成的产物部署到任意支持 Node 运行环境的服务商。  
更详细的 Nuxt 部署说明可参考官方文档：`https://nuxt.com/docs/getting-started/deployment`
