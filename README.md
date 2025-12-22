## Violet Wallpaper Frontend（基于 Bun 的 Nuxt 项目）

本项目是使用 **Nuxt 4 + Nuxt UI** 构建的前端应用，已适配 **Bun** 运行环境。

- **框架**: Nuxt 4
- **UI**: Nuxt UI
- **运行环境**: Bun

更多关于 Nuxt UI 的信息可参考官方文档：`https://ui.nuxt.com`

## 前置条件

- 已安装 **Bun**（推荐使用最新版）  
  安装方式可参考 Bun 官方文档：`https://bun.sh`

## 安装依赖

在项目根目录执行：

```bash
bun install
```

这会根据 `package.json` 安装项目依赖并执行 `postinstall`（`nuxt prepare`）。

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
