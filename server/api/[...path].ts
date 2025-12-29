/**
 * API 代理路由
 * 将所有 /api/* 请求代理到后端服务器
 * 此文件位于 server/api/[...path].ts，会自动处理 /api/* 的所有请求
 */

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const target = config.public.apiBaseUrl || 'http://127.0.0.1:8203'

  // 获取路径参数（catch-all 路由）
  const path = getRouterParam(event, 'path') || ''

  // 构建完整的请求 URL（注意：path 已经包含了完整的路径，如 "pictures/list"）
  const url = `${target}/api/${path}`

  // 获取查询参数
  const query = getQuery(event)
  const queryString = new URLSearchParams(
    query as Record<string, string>
  ).toString()
  const fullUrl = queryString ? `${url}?${queryString}` : url

  // 获取请求方法
  const method = getMethod(event)

  // 获取请求体（仅对非 GET/HEAD 请求）
  let body: any = undefined
  if (method !== 'GET' && method !== 'HEAD') {
    try {
      body = await readBody(event)
    } catch {
      // 忽略读取 body 的错误
    }
  }

  // 获取请求头
  const headers: Record<string, string> = {}
  const requestHeaders = getHeaders(event)

  // 复制必要的请求头，排除一些不需要的
  const excludeHeaders = [
    'host',
    'connection',
    'content-length',
    'content-type'
  ]
  for (const [key, value] of Object.entries(requestHeaders)) {
    const lowerKey = key.toLowerCase()
    if (!excludeHeaders.includes(lowerKey)) {
      headers[key] = value as string
    }
  }

  // 设置 Content-Type（如果需要）
  if (body && !headers['content-type']) {
    headers['content-type'] = 'application/json'
  }

  try {
    // 发送请求到后端
    const response = await $fetch.raw(fullUrl, {
      method: method as any,
      headers,
      body: body ? JSON.stringify(body) : undefined
    })

    // 设置响应头
    for (const [key, value] of Object.entries(response.headers)) {
      setHeader(event, key, value)
    }

    // 返回响应数据
    return response._data
  } catch (error: any) {
    // 处理错误
    const statusCode = error.statusCode || error.status || 500
    const statusMessage = error.statusMessage || error.message || 'Proxy Error'

    throw createError({
      statusCode,
      statusMessage,
      data: error.data || error.message
    })
  }
})
