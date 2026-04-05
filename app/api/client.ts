import { tryUseNuxtApp } from '#app'

let isInitialized = false
let generatedModules: Record<string, any> | null = null

function resolveBaseURL(overrideBaseURL?: string) {
  if (overrideBaseURL !== undefined) {
    return overrideBaseURL
  }

  if (import.meta.dev) {
    return ''
  }

  const nuxtApp = tryUseNuxtApp()
  const configBaseURL = nuxtApp?.$config?.public?.apiBaseUrl
  return configBaseURL || 'http://127.0.0.1:8203'
}

async function initApiClient(overrideBaseURL?: string) {
  if (!isInitialized) {
    try {
      generatedModules = await import('./generated')

      if (!generatedModules || !generatedModules.OpenAPI) {
        throw new Error('未找到生成的 OpenAPI 客户端，请先运行 `pnpm run generate:api` 生成 API 代码')
      }

      if (
        !generatedModules.PicturesService
        || !generatedModules.TagsService
        || !generatedModules.DictionariesService
      ) {
        throw new Error('API 服务类未找到，请确保已运行 `pnpm run generate:api:url` 从后端生成完整的 API 代码')
      }

      const baseURL = resolveBaseURL(overrideBaseURL)
      generatedModules.OpenAPI.BASE = baseURL
      generatedModules.OpenAPI.VERSION = '1.0.0'
      generatedModules.OpenAPI.WITH_CREDENTIALS = false
      generatedModules.OpenAPI.CREDENTIALS = 'include'

      isInitialized = true
    } catch (error: unknown) {
      const err = error as { code?: string }
      if (err.code === 'ERR_MODULE_NOT_FOUND') {
        throw new Error('API 客户端未生成，请先运行 `pnpm run generate:api` 生成 API 代码')
      }
      throw error
    }
  }

  return generatedModules
}

export async function getApiClient(baseURL?: string) {
  const modules = await initApiClient(baseURL)

  if (!modules) {
    throw new Error('API 客户端初始化失败')
  }

  if (modules.OpenAPI) {
    modules.OpenAPI.BASE = resolveBaseURL(baseURL)
  }

  if (!modules.PicturesService || !modules.TagsService || !modules.DictionariesService) {
    throw new Error('API 服务类未找到，请确保已运行 `pnpm run generate:api` 生成完整的 API 代码')
  }

  return {
    OpenAPI: modules.OpenAPI,
    PicturesService: modules.PicturesService,
    TagsService: modules.TagsService,
    DictionariesService: modules.DictionariesService,
    DefaultService: modules.DefaultService
  }
}

export async function setApiToken(token: string) {
  const modules = await initApiClient()
  if (modules?.OpenAPI) {
    modules.OpenAPI.TOKEN = token
  }
}

export async function clearApiToken() {
  const modules = await initApiClient()
  if (modules?.OpenAPI) {
    modules.OpenAPI.TOKEN = undefined
  }
}

export async function setApiHeaders(headers: Record<string, string>) {
  const modules = await initApiClient()
  if (modules?.OpenAPI) {
    modules.OpenAPI.HEADERS = headers
  }
}
