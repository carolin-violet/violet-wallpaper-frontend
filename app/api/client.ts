/**
 * API 客户端封装
 * 基于 openapi-typescript-codegen 生成的客户端进行二次封装
 *
 * 注意：首次使用前需要先运行 `bun run generate:api` 生成 API 客户端代码
 */

let isInitialized = false
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let generatedModules: Record<string, any> | null = null

/**
 * 初始化 API 客户端配置
 * @param overrideBaseURL 外部传入的 baseURL，用于 useAsyncData 等无 Nuxt 上下文的场景，避免内部调用 useRuntimeConfig()
 */
async function initApiClient(overrideBaseURL?: string) {
  if (!isInitialized) {
    try {
      generatedModules = await import('./generated')

      if (!generatedModules || !generatedModules.OpenAPI) {
        throw new Error(
          '未找到生成的 OpenAPI 客户端，请先运行 `bun run generate:api` 生成 API 代码'
        )
      }

      const baseURL
        = overrideBaseURL !== undefined
          ? overrideBaseURL
          : (() => {
              const config = useRuntimeConfig()
              const isDev = import.meta.dev
              return isDev
                ? ''
                : config.public.apiBaseUrl || 'http://127.0.0.1:8203'
            })()

      generatedModules.OpenAPI.BASE = baseURL
      generatedModules.OpenAPI.VERSION = '1.0.0'
      generatedModules.OpenAPI.WITH_CREDENTIALS = false
      generatedModules.OpenAPI.CREDENTIALS = 'include'

      isInitialized = true
    } catch (error: unknown) {
      const err = error as { code?: string }
      if (err.code === 'ERR_MODULE_NOT_FOUND') {
        throw new Error(
          'API 客户端未生成，请先运行 `bun run generate:api` 生成 API 代码'
        )
      }
      throw error
    }
  }

  return generatedModules
}

/**
 * 获取 API 客户端
 * @param baseURL 可选，传入时在无 Nuxt 上下文（如 useAsyncData fetcher）中也可安全初始化，避免 useRuntimeConfig() 报错
 */
export async function getApiClient(baseURL?: string) {
  const modules = await initApiClient(baseURL)

  if (baseURL && modules?.OpenAPI) {
    modules.OpenAPI.BASE = baseURL
  }

  // 返回服务类对象
  return {
    OpenAPI: modules?.OpenAPI,
    PicturesService: modules?.PicturesService,
    TagsService: modules?.TagsService,
    DictionariesService: modules?.DictionariesService,
    DefaultService: modules?.DefaultService
  }
}

/**
 * 设置 API 认证 token
 */
export async function setApiToken(token: string) {
  const modules = await initApiClient()
  if (modules?.OpenAPI) {
    modules.OpenAPI.TOKEN = token
  }
}

/**
 * 清除 API 认证 token
 */
export async function clearApiToken() {
  const modules = await initApiClient()
  if (modules?.OpenAPI) {
    modules.OpenAPI.TOKEN = undefined
  }
}

/**
 * 设置自定义请求头
 */
export async function setApiHeaders(headers: Record<string, string>) {
  const modules = await initApiClient()
  if (modules?.OpenAPI) {
    modules.OpenAPI.HEADERS = headers
  }
}
