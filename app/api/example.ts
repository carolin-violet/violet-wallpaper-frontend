/**
 * API 使用示例
 * 此文件仅作为参考，实际使用时请根据生成的 API 客户端调整
 *
 * 使用前请确保已运行 `pnpm run generate:api` 生成 API 客户端代码
 */

import { getApiClient } from './client'

/**
 * 示例：调用 API 接口
 */
export async function exampleApiCall() {
  try {
    // 获取 API 客户端（异步初始化）
    const _api = await getApiClient()

    // 如果需要认证，设置 token
    // await setApiToken('your-token-here')

    // 调用 API（示例代码，实际方法名取决于你的 Swagger 文档）
    // 注意：生成后的 API 客户端结构会根据你的 Swagger 文档而定
    //
    // 示例 1: 调用服务方法
    // const response = await api.someService.getSomeData({
    //   param1: 'value1',
    //   param2: 'value2'
    // })
    //
    // 示例 2: 调用路径方法
    // const response = await api.get('/api/v1/users', { ...params })

    // return response
  } catch (error) {
    console.error('API 调用失败:', error)
    throw error
  }
}

/**
 * 在 Vue 组件中使用示例：
 *
 * <script setup lang="ts">
 * import { getApiClient } from '~/api/client'
 *
 * // 在 setup 中调用
 * const api = await getApiClient()
 * const data = await api.someService.getSomeData({ ... })
 * </script>
 *
 * 或在 composable 中使用：
 *
 * // composables/useApi.ts
 * export const useApi = async () => {
 *   const api = await getApiClient()
 *   return api
 * }
 */
