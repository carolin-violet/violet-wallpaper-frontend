/**
 * 字典相关的 composable
 */

import { getApiClient } from '~/api/client'

interface DictionaryItem {
  code: string
  name: string
  [key: string]: any
}

export const useDictionary = () => {
  // useState 必须在 setup/plugin 上下文中调用，故放在 composable 内部；相同 key 仍会跨组件共享
  const dictionaries = useState<DictionaryItem[]>('dictionaries', () => [])
  const loading = useState<boolean>('dictionaries-loading', () => false)
  const error = useState<string | null>('dictionaries-error', () => null)
  /**
   * 获取字典数据
   * @param baseURL 可选，SSR/useAsyncData 等无 Nuxt 上下文时由调用方传入，避免 getApiClient 内 useRuntimeConfig 报错
   */
  const getDictionaries = async (baseURL?: string) => {
    if (dictionaries.value.length > 0) {
      return dictionaries.value
    }

    if (loading.value) {
      while (loading.value) {
        await new Promise(resolve => setTimeout(resolve, 50))
      }
      return dictionaries.value
    }

    try {
      loading.value = true
      error.value = null

      const api = await getApiClient(baseURL)
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
