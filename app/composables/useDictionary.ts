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
   * @param type 可选，字典类型，如 type=0 表示分类
   */
  const getDictionaries = async (baseURL?: string, type?: number) => {
    if (dictionaries.value.length > 0 && type === undefined) {
      return dictionaries.value
    }

    if (loading.value) {
      while (loading.value) {
        await new Promise(resolve => setTimeout(resolve, 50))
      }
      // 如果指定了 type，需要重新查询
      if (type !== undefined) {
        const allDicts = dictionaries.value
        return allDicts.filter((item: DictionaryItem) => item.type === type)
      }
      return dictionaries.value
    }

    try {
      loading.value = true
      error.value = null

      const api = await getApiClient(baseURL)

      // 如果指定了 type，直接使用 axios 调用带 type 参数的接口
      let response: any
      if (type !== undefined) {
        // 使用 axios 直接调用，因为生成的代码不支持 type 参数
        const { default: axios } = await import('axios')
        const config = useRuntimeConfig()
        const isDev = import.meta.dev
        const apiBase = baseURL || (isDev ? '' : config.public.apiBaseUrl || 'http://127.0.0.1:8203')
        const url = `${apiBase}/api/dictionaries/?type=${type}`
        const axiosResponse = await axios.get(url)
        response = axiosResponse.data
      } else {
        // 未指定 type，使用生成的客户端
        response = await api.DictionariesService.getAllDictionariesApiDictionariesGet()
      }

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

      // 如果指定了 type，只返回匹配的项（双重保险）
      if (type !== undefined) {
        data = data.filter((item: DictionaryItem) => item.type === type)
      }

      // 只在未指定 type 时缓存全部数据
      if (type === undefined) {
        dictionaries.value = data
      }
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
   * 根据 type 获取字典数据（如分类 type=0）
   * @param type 字典类型
   * @param baseURL 可选，SSR/useAsyncData 等无 Nuxt 上下文时由调用方传入
   */
  const getDictionariesByType = async (
    type: number,
    baseURL?: string
  ): Promise<DictionaryItem[]> => {
    return await getDictionaries(baseURL, type)
  }

  /**
   * 根据 code 获取字典项的中文名称
   */
  const getDictionaryName = (code: string | null | undefined): string => {
    // console.log("dictionaries.value", dictionaries.value);
    if (!code) return ''
    const item = dictionaries.value.find(item => item.code === code)
    return item?.name_cn || item?.name || code
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
    getDictionariesByType,
    getDictionaryName,
    getDictionaryItem,
    initDictionaries
  }
}
