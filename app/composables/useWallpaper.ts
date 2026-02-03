/**
 * 壁纸相关的 composable
 */

import type { TagResponse } from '~/api/generated'
import { getApiClient } from '~/api/client'

export const useWallpaper = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 获取壁纸列表
   * @param baseURL 可选，SSR/useAsyncData 等无 Nuxt 上下文时由调用方传入，避免 getApiClient 内 useRuntimeConfig 报错
   */
  const getWallpapers = async (
    params?: {
      pageNum?: number
      pageSize?: number
      format?: string | null
      minWidth?: number | null
      maxWidth?: number | null
      minHeight?: number | null
      maxHeight?: number | null
      originalFilename?: string | null
      deviceType?: number | null
      status?: number | null
      category?: string | null
      tags?: string[] | null
    },
    baseURL?: string
  ) => {
    try {
      loading.value = true
      error.value = null

      const api = await getApiClient(baseURL)
      const response
        = await api.PicturesService.listWallpapersApiPicturesListGet({
          pageNum: params?.pageNum || 1,
          pageSize: params?.pageSize || 20,
          format: params?.format,
          minWidth: params?.minWidth,
          maxWidth: params?.maxWidth,
          minHeight: params?.minHeight,
          maxHeight: params?.maxHeight,
          originalFilename: params?.originalFilename,
          deviceType: params?.deviceType,
          status: params?.status,
          category: params?.category,
          tags: params?.tags
        })

      return response
    } catch (err: any) {
      error.value = err.message || '获取壁纸列表失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取标签列表（调用 TagsService.listTagsApiTagsListGet）
   * @param baseURL 可选，SSR/useAsyncData 等无 Nuxt 上下文时由调用方传入
   */
  const getTags = async (baseURL?: string): Promise<TagResponse[]> => {
    try {
      const api = await getApiClient(baseURL)
      const response = await api.TagsService.listTagsApiTagsListGet()

      // 处理不同的响应格式
      if (Array.isArray(response)) {
        return response as TagResponse[]
      }
      // 处理 { data: TagResponse[] } 格式
      if (response && typeof response === 'object' && 'data' in response) {
        return (response as { data: TagResponse[] }).data
      }
      // 处理 { total: number, records: TagResponse[] } 格式（分页响应）
      if (response && typeof response === 'object' && 'records' in response) {
        return (response as { records: TagResponse[] }).records
      }
      return []
    } catch (err: unknown) {
      console.error('获取标签列表失败:', err)
      return []
    }
  }

  /**
   * 增加预览次数
   */
  const incrementView = async (pictureId: number) => {
    try {
      const api = await getApiClient()
      await api.PicturesService.incrementPictureViewApiPicturesPictureIdViewPost(
        {
          pictureId
        }
      )
    } catch (err: any) {
      console.error('增加预览次数失败:', err)
    }
  }

  /**
   * 根据 ID 获取单个壁纸详情
   * @param pictureId 壁纸 ID
   * @param baseURL 可选，SSR/useAsyncData 等无 Nuxt 上下文时由调用方传入
   */
  const getWallpaperById = async (
    pictureId: number,
    baseURL?: string
  ) => {
    try {
      loading.value = true
      error.value = null

      const api = await getApiClient(baseURL)
      const response
        = await api.PicturesService.getPictureApiPicturesPictureIdGet({
          pictureId
        })

      return response
    } catch (err: any) {
      error.value = err.message || '获取壁纸详情失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 下载图片
   * 返回图片 Blob 流
   */
  const downloadPicture = async (pictureId: number): Promise<Blob> => {
    try {
      const config = useRuntimeConfig()
      const isDev = import.meta.dev
      const baseURL = isDev
        ? '' // 使用相对路径，通过 Nuxt 代理
        : config.public.apiBaseUrl || 'http://127.0.0.1:8203'

      // 直接使用 axios 下载图片流，确保返回 Blob
      const { default: axios } = await import('axios')
      const response = await axios.get(
        `${baseURL}/api/pictures/${pictureId}/download`,
        {
          responseType: 'blob'
        }
      )

      return response.data as Blob
    } catch (err: any) {
      error.value = err.message || '下载图片失败'
      throw err
    }
  }

  return {
    loading,
    error,
    getWallpapers,
    getWallpaperById,
    getTags,
    incrementView,
    downloadPicture
  }
}
