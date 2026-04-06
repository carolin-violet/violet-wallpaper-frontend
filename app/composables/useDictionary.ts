import { getApiClient } from '~/api/client'

interface DictionaryItem {
  code: string
  name: string
  name_cn?: string
  dict_type?: number | string
  dictionary_type?: number | string
  category_type?: number | string
  type?: number
  [key: string]: unknown
}

let dictionariesRequestPromise: Promise<DictionaryItem[]> | null = null
const dictionariesByTypeRequestMap = new Map<number, Promise<DictionaryItem[]>>()

export const useDictionary = () => {
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

  const normalizeComparable = (value: unknown): string => {
    if (value === null || value === undefined) {
      return ''
    }
    return String(value).trim()
  }

  const requestDictionaries = async (baseURL?: string, type?: number): Promise<DictionaryItem[]> => {
    const api = await getApiClient(baseURL)
    const response = await api.DictionariesService.getAllDictionariesApiDictionariesGet({
      type: type ?? null
    })

    let data: DictionaryItem[] = normalizeDictionaryList(response)

    if (type !== undefined) {
      const typed = data.filter(item => getItemType(item) === type)
      data = typed.length > 0 ? typed : data
    }

    return data
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

    try {
      if (type === undefined) {
        if (!dictionariesRequestPromise) {
          loading.value = true
          error.value = null
          dictionariesRequestPromise = requestDictionaries(baseURL).finally(() => {
            dictionariesRequestPromise = null
          })
        }

        const data = await dictionariesRequestPromise
        dictionaries.value = data
        return data
      }

      const pendingTyped = dictionariesByTypeRequestMap.get(type)
      if (pendingTyped) {
        return await pendingTyped
      }

      loading.value = true
      error.value = null

      const typedRequest = requestDictionaries(baseURL, type).finally(() => {
        dictionariesByTypeRequestMap.delete(type)
      })

      dictionariesByTypeRequestMap.set(type, typedRequest)

      const data = await typedRequest
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

  const getDictionaryName = (code: string | number | null | undefined): string => {
    if (code === null || code === undefined || code === '') return ''

    const normalizedCode = normalizeComparable(code)
    const item = dictionaries.value.find(item => normalizeComparable(item.code) === normalizedCode)

    return item?.name_cn || item?.name || normalizedCode
  }

  const getDictionaryItem = (
    code: string | number | null | undefined
  ): DictionaryItem | null => {
    if (code === null || code === undefined || code === '') return null

    const normalizedCode = normalizeComparable(code)
    return dictionaries.value.find(item => normalizeComparable(item.code) === normalizedCode) || null
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
