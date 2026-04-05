import { getApiClient } from '~/api/client'

interface DictionaryItem {
  code: string
  name: string
  type?: number
  [key: string]: any
}

export const useDictionary = () => {
  const runtimeConfig = useRuntimeConfig()
  const dictionaries = useState<DictionaryItem[]>('dictionaries', () => [])
  const loading = useState<boolean>('dictionaries-loading', () => false)
  const error = useState<string | null>('dictionaries-error', () => null)
  const getItemType = (item: DictionaryItem): number | null => {
    const rawType = item.type ?? item.dict_type ?? item.dictionary_type ?? item.category_type
    if (rawType === null || rawType === undefined || rawType === '') {
      return null
    }

    const normalized = Number(rawType)
    return Number.isNaN(normalized) ? null : normalized
  }

  const normalizeDictionaryList = (response: unknown): DictionaryItem[] => {
    if (Array.isArray(response)) {
      return response as DictionaryItem[]
    }

    if (!response || typeof response !== 'object') {
      return []
    }

    if ('records' in response && Array.isArray((response as { records?: unknown }).records)) {
      return (response as { records: DictionaryItem[] }).records
    }

    if ('data' in response && Array.isArray((response as { data?: unknown }).data)) {
      return (response as { data: DictionaryItem[] }).data
    }

    if (
      'data' in response
      && (response as { data?: unknown }).data
      && typeof (response as { data?: unknown }).data === 'object'
      && 'records' in ((response as { data: Record<string, unknown> }).data)
      && Array.isArray(((response as { data: { records?: unknown } }).data.records))
    ) {
      return (response as { data: { records: DictionaryItem[] } }).data.records
    }

    return []
  }

  const getDictionaries = async (baseURL?: string, type?: number) => {
    if (dictionaries.value.length > 0) {
      if (type === undefined) {
        return dictionaries.value
      }

      const typedCached = dictionaries.value.filter(item => getItemType(item) === type)
      if (typedCached.length > 0) {
        return typedCached
      }
    }

    if (loading.value) {
      while (loading.value) {
        await new Promise(resolve => setTimeout(resolve, 50))
      }

      if (type !== undefined) {
        const typedCached = dictionaries.value.filter(item => getItemType(item) === type)
        if (typedCached.length > 0) {
          return typedCached
        }
      } else if (dictionaries.value.length > 0) {
        return dictionaries.value
      }
    }

    try {
      loading.value = true
      error.value = null

      const api = await getApiClient(baseURL)

      let response: unknown
      if (type !== undefined) {
        const { default: axios } = await import('axios')
        const isDev = import.meta.dev
        const apiBase = baseURL || (isDev ? '' : runtimeConfig.public.apiBaseUrl || 'http://wallpaper-backend.carolin-violet.cn:8000')
        const url = `${apiBase}/api/dictionaries/?type=${type}`
        const axiosResponse = await axios.get(url)
        response = axiosResponse.data
      } else {
        response = await api.DictionariesService.getAllDictionariesApiDictionariesGet()
      }

      let data: DictionaryItem[] = normalizeDictionaryList(response)

      if (type !== undefined) {
        const typed = data.filter(item => getItemType(item) === type)
        data = typed.length > 0 ? typed : data
      }

      if (type === undefined) {
        dictionaries.value = data
      }

      return data
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '获取字典数据失败'
      error.value = message
      console.error('获取字典数据失败:', message)
      return []
    } finally {
      loading.value = false
    }
  }

  const getDictionariesByType = async (
    type: number,
    baseURL?: string
  ): Promise<DictionaryItem[]> => {
    return getDictionaries(baseURL, type)
  }

  const getDictionaryName = (code: string | null | undefined): string => {
    if (!code) return ''
    const item = dictionaries.value.find(item => item.code === code)
    return item?.name_cn || item?.name || code
  }

  const getDictionaryItem = (
    code: string | null | undefined
  ): DictionaryItem | null => {
    if (!code) return null
    return dictionaries.value.find(item => item.code === code) || null
  }

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
