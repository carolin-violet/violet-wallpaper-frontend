/**
 * 字典相关的 composable
 */

import { getApiClient } from '~/api/client'

interface DictionaryItem {
  code: string
  name: string
  [key: string]: any
}

// 使用 useState 创建全局共享状态，避免多次请求
const dictionaries = useState<DictionaryItem[]>('dictionaries', () => [])
const loading = useState<boolean>('dictionaries-loading', () => false)
const error = useState<string | null>('dictionaries-error', () => null)

export const useDictionary = () => {
  /**
   * 获取字典数据
   * 使用全局共享状态，多个组件调用时只会请求一次
   */
  const getDictionaries = async () => {
    // 如果已有数据，直接返回
    if (dictionaries.value.length > 0) {
      return dictionaries.value
    }

    // 如果正在加载，等待加载完成
    if (loading.value) {
      // 等待加载完成
      while (loading.value) {
        await new Promise(resolve => setTimeout(resolve, 50))
      }
      return dictionaries.value
    }

    try {
      loading.value = true
      error.value = null

      const api = await getApiClient()
      const response
        = await api.DictionariesService.getAllDictionariesApiDictionariesGet()

      // 处理响应数据，可能是数组或对象
      let data: DictionaryItem[] = []
      if (Array.isArray(response)) {
        data = response
      } else if (
        response
        && typeof response === 'object'
        && 'records' in response
      ) {
        data = (response as any).records
      }
      dictionaries.value = data
      return data
    } catch (err: any) {
      error.value = err.message || '获取字典数据失败'
      console.error('获取字典数据失败:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * 根据 code 获取字典项的中文名称
   */
  const getDictionaryName = (code: string | null | undefined): string => {
    // console.log("dictionaries.value", dictionaries.value);
    if (!code) return ''
    const item = dictionaries.value.find(item => item.code === code)
    return item?.name_cn || code
  }

  /**
   * 根据 code 获取字典项
   */
  const getDictionaryItem = (
    code: string | null | undefined
  ): DictionaryItem | null => {
    if (!code) return null
    return dictionaries.value.find(item => item.code === code) || null
  }

  /**
   * 初始化字典数据（在组件挂载时调用）
   */
  const initDictionaries = async () => {
    await getDictionaries()
  }

  return {
    dictionaries: readonly(dictionaries),
    loading: readonly(loading),
    error: readonly(error),
    getDictionaries,
    getDictionaryName,
    getDictionaryItem,
    initDictionaries
  }
}
