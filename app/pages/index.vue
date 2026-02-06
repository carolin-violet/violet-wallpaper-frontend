<template>
  <div class="mx-auto max-w-10xl px-2 sm:px-4 py-8">
    <!-- 筛选区域 -->
    <div class="mb-8">
      <div class="flex flex-wrap gap-4 items-center">
        <!-- 设备类型 -->
        <USelectMenu
          v-model="filters.deviceType"
          :items="deviceTypeOptions"
          value-key="value"
          placeholder="设备类型"
          class="w-40"
        />

        <!-- 分类 -->
        <USelectMenu
          v-model="filters.category"
          :items="categoryOptions"
          value-key="value"
          placeholder="分类"
          class="w-40"
        />

        <!-- 标签 -->
        <USelectMenu
          v-model="selectedTags"
          :items="tagOptions"
          value-key="value"
          placeholder="标签"
          multiple
          class="w-48"
        />

        <!-- 清除筛选 -->
        <UButton
          v-if="hasActiveFilters"
          variant="ghost"
          color="neutral"
          @click="clearFilters"
        >
          清除筛选
        </UButton>
      </div>
    </div>

    <!-- 壁纸网格 -->
    <WallpaperGrid
      :wallpapers="wallpapers"
      :loading="loading"
      :tags-map="tagsMap"
      @card-click="handleCardClick"
      @download="handleDownload"
      @view="handleView"
    />

    <!-- 分页 -->
    <div
      v-if="totalPages > 1"
      class="mt-10 flex justify-center"
    >
      <div
        class="inline-flex items-center gap-2 rounded-full bg-white/85 dark:bg-slate-950/90 px-4 sm:px-5 py-2 shadow-[0_18px_55px_rgba(15,23,42,0.22)] text-[11px] text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl"
      >
        <UButton
          icon="i-lucide-arrow-left"
          size="xs"
          color="neutral"
          variant="ghost"
          class="rounded-full h-8 w-8 border border-slate-200/80 dark:border-slate-800/80"
          :disabled="currentPage <= 1 || loading"
          @click="goPrevPage"
        />

        <div class="flex items-center gap-1">
          <template
            v-for="(item, index) in paginationItems"
            :key="index"
          >
            <UButton
              v-if="typeof item === 'number'"
              :label="String(item)"
              size="xs"
              :color="item === currentPage ? 'primary' : 'neutral'"
              :variant="item === currentPage ? 'solid' : 'ghost'"
              class="rounded-full min-w-8 h-8 justify-center px-0.5 text-[11px]"
              :disabled="loading"
              @click="changePage(item)"
            />
            <span
              v-else
              class="px-1 text-slate-400 dark:text-slate-500"
            >
              ...
            </span>
          </template>
        </div>

        <div class="hidden sm:flex items-center gap-1 ml-2">
          <UInput
            v-model="inputPage"
            size="xs"
            class="w-16 h-8 text-center text-[11px] rounded-full bg-slate-100/80 dark:bg-slate-900/70 border-slate-200/80 dark:border-slate-800/80"
            :disabled="loading"
            placeholder="跳转"
            @keyup.enter="handleJump"
          />
          <UButton
            size="xs"
            color="neutral"
            variant="soft"
            class="rounded-full h-8 px-3 text-[11px]"
            :disabled="loading"
            @click="handleJump"
          >
            Go
          </UButton>
        </div>

        <div
          class="ml-1 pl-3 border-l border-slate-200/80 dark:border-slate-700/70 text-slate-500 dark:text-slate-300/90 hidden sm:flex items-center gap-1"
        >
          <span>第</span>
          <span class="font-semibold text-[11px]">{{ currentPage }}</span>
          <span>/</span>
          <span class="text-[11px]">{{ totalPages }}</span>
        </div>

        <UButton
          icon="i-lucide-arrow-right"
          size="xs"
          color="neutral"
          variant="ghost"
          class="rounded-full h-8 w-8 border border-slate-200/80 dark:border-slate-800/80"
          :disabled="currentPage >= totalPages || loading"
          @click="goNextPage"
        />
      </div>
    </div>

    <!-- 错误提示 -->
    <UAlert
      v-if="error"
      color="error"
      variant="soft"
      :title="error"
      class="mt-4"
    />
  </div>
</template>

<script setup lang="ts">
import type { PictureResponseInfo, TagResponse } from '~/api/generated'

const {
  getWallpapers,
  getTags,
  incrementView,
  downloadPicture,
  loading: wallpaperLoading,
  error
} = useWallpaper()

const pageSize = 12

// 在 setup 中取 baseURL，传入 useAsyncData fetcher，避免 fetcher 内调用 useRuntimeConfig() 报错
// 服务端必须用绝对 URL，否则 Node/axios 会报 Invalid URL；仅客户端在 dev 下可用相对路径走代理
const config = useRuntimeConfig()
const defaultApiBase = (config.public.apiBaseUrl as string) || 'http://127.0.0.1:8203'
const ssrBaseURL = import.meta.server
  ? defaultApiBase
  : (import.meta.dev ? '' : defaultApiBase)

// SSR：首屏壁纸、标签、字典在服务端请求
const { data: initialWallpapers, pending: initialPending } = useAsyncData(
  'index-wallpapers',
  () => getWallpapers({ pageNum: 1, pageSize }, ssrBaseURL)
)

const { data: tagsData } = useAsyncData<TagResponse[]>(
  'index-tags',
  () => getTags(ssrBaseURL)
)

// 获取字典数据（包括分类 type=0）
const { getDictionariesByType } = useDictionary()
const { data: categoryDictData } = useAsyncData(
  'index-categories',
  () => getDictionariesByType(0, ssrBaseURL)
)

useAsyncData('index-dictionaries', async () => {
  const { getDictionaries } = useDictionary()
  await getDictionaries(ssrBaseURL)
  return null
})

// 状态：首屏数据同步到 ref，便于客户端筛选/分页
const wallpapers = ref<PictureResponseInfo[]>([])
const tags = ref<TagResponse[]>([])
const tagsMap = ref<Record<number, string[]>>({})
const searchQuery = ref('')
const selectedTags = ref<string[]>([])
const currentPage = ref(1)
const total = ref(0)

// 筛选器
const filters = ref({
  deviceType: null as number | null,
  category: null as string | null,
  tags: null as string[] | null
})

watch(
  initialWallpapers,
  (v) => {
    if (v?.records) {
      wallpapers.value = v.records
      total.value = v.total ?? v.records.length
      currentPage.value = v.page_num ?? 1
    }
  },
  { immediate: true }
)

watch(
  tagsData,
  (v) => {
    tags.value = Array.isArray(v) ? v : []
  },
  { immediate: true }
)

// 合并 SSR 与客户端 loading
const loading = computed(() => initialPending.value || wallpaperLoading.value)

// 设备类型选项
const deviceTypeOptions = [
  { label: '全部', value: null },
  { label: 'PC端', value: 1 },
  { label: '移动端', value: 2 },
  { label: '头像', value: 3 }
]

// 标签选项：来自 TagsService.listTagsApiTagsListGet，按点击次数倒序
const tagOptions = computed(() =>
  tags.value.map((tag: TagResponse) => ({
    label: tag.name,
    value: tag.name
  }))
)

// 分类选项：来自字典接口，type=0
const categoryOptions = computed(() => {
  const options = [
    { label: '全部', value: null as string | null }
  ]
  if (categoryDictData.value && Array.isArray(categoryDictData.value)) {
    const categoryItems = categoryDictData.value.map(
      (item: {
        name_cn?: string
        name?: string
        code?: string
      }) => ({
        label: item.name_cn || item.name || item.code || '',
        value: (item.code || item.name) as string
      })
    )
    options.push(...categoryItems)
  }
  return options
})

// 是否有激活的筛选
const hasActiveFilters = computed(() => {
  return (
    filters.value.deviceType !== null
    || filters.value.category !== null
    || (selectedTags.value && selectedTags.value.length > 0)
  )
})

const totalPages = computed(() => {
  if (!total.value) return 1
  return Math.max(1, Math.ceil(total.value / pageSize))
})

const inputPage = ref('')

// 客户端：加载壁纸（筛选、分页）
const loadWallpapers = async (page = 1) => {
  try {
    wallpaperLoading.value = true

    const response = await getWallpapers({
      pageNum: page,
      pageSize: pageSize,
      deviceType: filters.value.deviceType,
      category: filters.value.category || null,
      tags: selectedTags.value.length > 0 ? selectedTags.value : null,
      originalFilename: searchQuery.value || null
    })

    if (response) {
      const newWallpapers = response.records || []
      wallpapers.value = newWallpapers
      total.value = response.total ?? newWallpapers.length
      currentPage.value = page
    }
  } catch (err) {
    console.error('加载壁纸失败:', err)
  } finally {
    wallpaperLoading.value = false
  }
}

const changePage = (page: number) => {
  if (page === currentPage.value || page < 1 || page > totalPages.value) return
  loadWallpapers(page)
}

const goPrevPage = () => {
  if (currentPage.value > 1) {
    changePage(currentPage.value - 1)
  }
}

const goNextPage = () => {
  if (currentPage.value < totalPages.value) {
    changePage(currentPage.value + 1)
  }
}

const paginationItems = computed<(number | 'ellipsis')[]>(() => {
  const items: (number | 'ellipsis')[] = []
  const totalPageCount = totalPages.value
  const current = currentPage.value

  if (totalPageCount <= 7) {
    for (let i = 1; i <= totalPageCount; i += 1) {
      items.push(i)
    }
    return items
  }

  items.push(1)

  const start = Math.max(2, current - 2)
  const end = Math.min(totalPageCount - 1, current + 2)

  if (start > 2) {
    items.push('ellipsis')
  }

  for (let i = start; i <= end; i += 1) {
    items.push(i)
  }

  if (end < totalPageCount - 1) {
    items.push('ellipsis')
  }

  items.push(totalPageCount)

  return items
})

const handleJump = () => {
  const raw = inputPage.value.trim()
  if (!raw) return
  const parsed = Number.parseInt(raw, 10)
  if (Number.isNaN(parsed)) return
  const target = Math.min(totalPages.value, Math.max(1, parsed))
  inputPage.value = String(target)
  changePage(target)
}

const handleSearch = () => {
  currentPage.value = 1
  loadWallpapers(1)
}

const clearFilters = () => {
  filters.value = {
    deviceType: null,
    category: null,
    tags: null
  }
  selectedTags.value = []
  searchQuery.value = ''
  currentPage.value = 1
  loadWallpapers(1)
}

watch(
  [() => filters.value.deviceType, () => filters.value.category, selectedTags],
  () => {
    currentPage.value = 1
    loadWallpapers(1)
  },
  { deep: true }
)

const handleCardClick = (wallpaper: PictureResponseInfo) => {
  navigateTo(`/wallpaper/${wallpaper.id}`)
}

const handleDownload = async (wallpaper: PictureResponseInfo) => {
  try {
    const blob = await downloadPicture(wallpaper.id)
    const filename = wallpaper.original_filename || `wallpaper-${wallpaper.id}`
    downloadBlobAsFile(blob, filename)
  } catch (err) {
    console.error('下载失败:', err)
  }
}

const handleView = async (wallpaper: PictureResponseInfo) => {
  await incrementView(wallpaper.id)
  navigateTo(`/wallpaper/${wallpaper.id}`)
}
</script>
