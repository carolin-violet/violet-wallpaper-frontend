/**
 * API 代理路由：将 /api/* 请求转发到后端服务。
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiBaseUrl = String(config.public.apiBaseUrl || '').trim()
  if (!apiBaseUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: '缺少 API_BASE_URL 配置'
    })
  }
  const target = apiBaseUrl.replace(/\/+$/, '')

  const path = getRouterParam(event, 'path') || ''
  const url = `${target}/api/${path}`
  const query = getQuery(event) as Record<string, string | string[]>
  const method = getMethod(event)

  const headers: Record<string, string> = {}
  const requestHeaders = getHeaders(event)
  const excludeHeaders = ['host', 'connection', 'content-length', 'transfer-encoding']

  for (const [key, value] of Object.entries(requestHeaders)) {
    const normalizedKey = key.toLowerCase()
    if (!excludeHeaders.includes(normalizedKey) && typeof value === 'string') {
      headers[key] = value
    }
  }

  let body: string | Buffer | undefined
  if (method !== 'GET' && method !== 'HEAD') {
    const rawBody = await readRawBody(event, false)
    body = rawBody === null ? undefined : rawBody
  }

  try {
    const response = await $fetch.raw(url, {
      method,
      query,
      headers,
      body
    })

    response.headers.forEach((value, key) => {
      setHeader(event, key, value)
    })

    return response._data
  } catch (error: unknown) {
    const errorObject = error as {
      statusCode?: number
      status?: number
      statusMessage?: string
      message?: string
      data?: unknown
    }

    throw createError({
      statusCode: errorObject.statusCode || errorObject.status || 500,
      statusMessage: errorObject.statusMessage || errorObject.message || 'Proxy Error',
      data: errorObject.data || errorObject.message
    })
  }
})
