import { tryUseNuxtApp } from '#app'

type GeneratedApiModule = typeof import('./generated')

let isInitialized = false
let generatedModules: GeneratedApiModule | null = null

function normalizeBaseURL(value: string): string {
  return value.replace(/\/+$/, '')
}

function requireRuntimeApiBaseURL(): string {
  const nuxtApp = tryUseNuxtApp()
  const configBaseURL = nuxtApp?.$config?.public?.apiBaseUrl

  if (typeof configBaseURL === 'string' && configBaseURL.trim().length > 0) {
    return normalizeBaseURL(configBaseURL.trim())
  }

  throw new Error('Missing API_BASE_URL: please set runtimeConfig.public.apiBaseUrl in production')
}

function resolveBaseURL(overrideBaseURL?: string) {
  if (overrideBaseURL !== undefined) {
    return normalizeBaseURL(overrideBaseURL)
  }

  if (import.meta.dev) {
    return ''
  }

  return requireRuntimeApiBaseURL()
}

function getErrorCode(error: unknown): string | undefined {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return undefined
  }

  const code = (error as { code?: unknown }).code
  return typeof code === 'string' ? code : undefined
}

async function initApiClient(overrideBaseURL?: string) {
  if (!isInitialized) {
    try {
      generatedModules = await import('./generated')

      if (!generatedModules || !generatedModules.OpenAPI) {
        throw new Error('Generated OpenAPI client not found. Run `pnpm run generate:api` first.')
      }

      if (
        !generatedModules.PicturesService
        || !generatedModules.TagsService
        || !generatedModules.DictionariesService
      ) {
        throw new Error('Generated API services not found. Run `pnpm run generate:api:url` first.')
      }

      const baseURL = resolveBaseURL(overrideBaseURL)
      generatedModules.OpenAPI.BASE = baseURL
      generatedModules.OpenAPI.VERSION = '1.0.0'
      generatedModules.OpenAPI.WITH_CREDENTIALS = false
      generatedModules.OpenAPI.CREDENTIALS = 'include'

      isInitialized = true
    } catch (error: unknown) {
      if (getErrorCode(error) === 'ERR_MODULE_NOT_FOUND') {
        throw new Error('API client not generated. Run `pnpm run generate:api` first.')
      }
      throw error
    }
  }

  return generatedModules
}

export async function getApiClient(baseURL?: string) {
  const modules = await initApiClient(baseURL)

  if (!modules) {
    throw new Error('Failed to initialize API client')
  }

  if (modules.OpenAPI) {
    modules.OpenAPI.BASE = resolveBaseURL(baseURL)
  }

  if (!modules.PicturesService || !modules.TagsService || !modules.DictionariesService) {
    throw new Error('Generated API services not found. Run `pnpm run generate:api` first.')
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
