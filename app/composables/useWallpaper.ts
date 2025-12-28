/**
 * 壁纸相关的 composable
 */

import { getApiClient } from "~/api/client";

export const useWallpaper = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * 获取壁纸列表
   */
  const getWallpapers = async (params?: {
    pageNum?: number;
    pageSize?: number;
    format?: string | null;
    minWidth?: number | null;
    maxWidth?: number | null;
    minHeight?: number | null;
    maxHeight?: number | null;
    originalFilename?: string | null;
    deviceType?: number | null;
    status?: number | null;
    category?: string | null;
    tags?: string[] | null;
  }) => {
    try {
      loading.value = true;
      error.value = null;

      const api = await getApiClient();
      const response = await api.PicturesService.listWallpapersApiPicturesListGet({
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
        tags: params?.tags,
      });

      return response;
    } catch (err: any) {
      error.value = err.message || "获取壁纸列表失败";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * 获取标签列表
   */
  const getTags = async () => {
    try {
      const api = await getApiClient();
      const response = await api.TagsService.listTagsApiTagsListGet();

      // 处理响应数据，可能是数组或对象
      if (Array.isArray(response)) {
        return response;
      }
      if (response && typeof response === 'object' && 'data' in response) {
        return (response as any).data;
      }
      return [];
    } catch (err: any) {
      console.error("获取标签列表失败:", err);
      return [];
    }
  };

  /**
   * 增加预览次数
   */
  const incrementView = async (pictureId: number) => {
    try {
      const api = await getApiClient();
      await api.PicturesService.incrementPictureViewApiPicturesPictureIdViewPost({
        pictureId,
      });
    } catch (err: any) {
      console.error("增加预览次数失败:", err);
    }
  };

  /**
   * 下载图片
   */
  const downloadPicture = async (pictureId: number) => {
    try {
      const api = await getApiClient();
      const response = await api.PicturesService.downloadPictureApiPicturesPictureIdDownloadGet({
        pictureId,
      });
      return response;
    } catch (err: any) {
      error.value = err.message || "下载图片失败";
      throw err;
    }
  };

  return {
    loading,
    error,
    getWallpapers,
    getTags,
    incrementView,
    downloadPicture,
  };
};

