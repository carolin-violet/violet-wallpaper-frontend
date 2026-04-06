import type { TagResponse } from '~/api/generated'
import { getApiClient } from '~/api/client'

export const useWallpaper = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

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
      isFeatured?: number | null
      category?: string | null
      tags?: string[] | null
    },
    baseURL?: string
  ) => {
    try {
      loading.value = true
      error.value = null

      const api = await getApiClient(baseURL)
      return await api.PicturesService.listWallpapersApiPicturesListGet({
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
        isFeatured: params?.isFeatured,
        category: params?.category,
        tags: params?.tags
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '获取壁纸列表失败'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getTags = async (baseURL?: string): Promise<TagResponse[]> => {
    try {
      const api = await getApiClient(baseURL)
      const response = await api.TagsService.listTagsApiTagsListGet()

      if (Array.isArray(response)) {
        return response as TagResponse[]
      }

      if (response && typeof response === 'object' && 'data' in response) {
        return (response as { data: TagResponse[] }).data
      }

      if (response && typeof response === 'object' && 'records' in response) {
        return (response as { records: TagResponse[] }).records
      }

      return []
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '获取标签列表失败'
      console.error('获取标签列表失败:', message)
      return []
    }
  }

  const incrementView = async (pictureId: number) => {
    try {
      const api = await getApiClient()
      await api.PicturesService.incrementPictureViewApiPicturesPictureIdViewPost({
        pictureId
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '增加预览次数失败'
      console.error('增加预览次数失败:', message)
    }
  }

  const getWallpaperById = async (
    pictureId: number,
    baseURL?: string
  ) => {
    try {
      loading.value = true
      error.value = null

      const api = await getApiClient(baseURL)
      return await api.PicturesService.getPictureApiPicturesPictureIdGet({ pictureId })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '获取壁纸详情失败'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  const downloadPicture = async (pictureId: number): Promise<Blob> => {
    try {
      const api = await getApiClient()
      const baseURL = api.OpenAPI.BASE
      const { default: axios } = await import('axios')
      const response = await axios.get(`${baseURL}/api/pictures/${pictureId}/download`, {
        responseType: 'blob'
      })

      return response.data as Blob
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '下载图片失败'
      error.value = message
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
