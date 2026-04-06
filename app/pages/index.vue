<template>
  <div class="relative mx-auto max-w-[1780px] px-2 py-8 sm:px-4">
    <div class="pointer-events-none absolute -left-12 top-0 h-56 w-56 rounded-full bg-violet-300/30 blur-3xl" />
    <div class="pointer-events-none absolute -right-8 top-24 h-52 w-52 rounded-full bg-fuchsia-300/20 blur-3xl" />

    <section class="relative z-10 mb-8 overflow-hidden rounded-[2rem] border border-violet-200/70 bg-white/75 p-4 shadow-[0_22px_70px_rgba(88,49,165,0.16)] backdrop-blur-2xl dark:border-violet-900/70 dark:bg-slate-950/70 sm:p-6">
      <div class="absolute -right-8 -top-10 h-28 w-40 rotate-12 rounded-full bg-violet-300/25 blur-2xl" />
      <div class="absolute -left-4 -bottom-8 h-24 w-32 rounded-full bg-fuchsia-300/15 blur-2xl" />

      <div class="relative mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-lg font-semibold tracking-wide text-slate-800 dark:text-violet-100 sm:text-xl">
            紫罗兰永恒花园 · 壁纸筛选台
          </h1>
          <p class="mt-1 text-xs text-slate-500 dark:text-violet-200/80 sm:text-sm">
            更柔和的视觉层次，更明确的筛选反馈，更快找到你想要的画面。
          </p>
        </div>

        <ClientOnly>
          <div class="flex flex-wrap items-center gap-2 text-xs">
            <span class="inline-flex items-center rounded-full border border-violet-200/80 bg-violet-50/70 px-3 py-1 text-violet-700 dark:border-violet-700/70 dark:bg-violet-900/40 dark:text-violet-100">
              共 {{ total }} 张
            </span>
            <span class="inline-flex items-center rounded-full border border-fuchsia-200/80 bg-fuchsia-50/70 px-3 py-1 text-fuchsia-700 dark:border-fuchsia-700/70 dark:bg-fuchsia-900/40 dark:text-fuchsia-100">
              已启用 {{ activeFilterCount }} 项筛选
            </span>
          </div>
          <template #fallback>
            <div class="flex flex-wrap items-center gap-2 text-xs">
              <span class="inline-flex items-center rounded-full border border-violet-200/80 bg-violet-50/70 px-3 py-1 text-violet-700 dark:border-violet-700/70 dark:bg-violet-900/40 dark:text-violet-100">
                共 0 张
              </span>
              <span class="inline-flex items-center rounded-full border border-fuchsia-200/80 bg-fuchsia-50/70 px-3 py-1 text-fuchsia-700 dark:border-fuchsia-700/70 dark:bg-fuchsia-900/40 dark:text-fuchsia-100">
                已启用 0 项筛选
              </span>
            </div>
          </template>
        </ClientOnly>
      </div>

      <div class="relative grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div class="rounded-2xl border border-violet-200/70 bg-white/85 p-3 shadow-[0_8px_20px_rgba(76,29,149,0.08)] dark:border-violet-900/70 dark:bg-slate-900/60">
          <div class="mb-2 flex items-center justify-between">
            <p class="text-xs font-medium text-slate-500 dark:text-violet-200/80">
              设备类型
            </p>
            <UButton
              v-if="filters.deviceType !== null"
              size="xs"
              color="neutral"
              variant="ghost"
              class="h-6 px-2 text-[11px]"
              @click="clearDeviceType"
            >
              清空
            </UButton>
          </div>
          <USelectMenu
            v-model="filters.deviceType"
            :items="deviceTypeOptions"
            value-key="value"
            placeholder="选择设备类型"
            class="w-full"
          />
        </div>

        <div class="rounded-2xl border border-violet-200/70 bg-white/85 p-3 shadow-[0_8px_20px_rgba(76,29,149,0.08)] dark:border-violet-900/70 dark:bg-slate-900/60">
          <div class="mb-2 flex items-center justify-between">
            <p class="text-xs font-medium text-slate-500 dark:text-violet-200/80">
              精选状态
            </p>
            <UButton
              v-if="filters.isFeatured !== null"
              size="xs"
              color="neutral"
              variant="ghost"
              class="h-6 px-2 text-[11px]"
              @click="clearFeatured"
            >
              清空
            </UButton>
          </div>
          <USelectMenu
            v-model="filters.isFeatured"
            :items="featuredOptions"
            value-key="value"
            placeholder="是否精选"
            class="w-full"
          />
        </div>

        <div class="rounded-2xl border border-violet-200/70 bg-white/85 p-3 shadow-[0_8px_20px_rgba(76,29,149,0.08)] dark:border-violet-900/70 dark:bg-slate-900/60">
          <div class="mb-2 flex items-center justify-between">
            <p class="text-xs font-medium text-slate-500 dark:text-violet-200/80">
              分类
            </p>
            <UButton
              v-if="filters.category !== null"
              size="xs"
              color="neutral"
              variant="ghost"
              class="h-6 px-2 text-[11px]"
              @click="clearCategory"
            >
              清空
            </UButton>
          </div>
          <USelectMenu
            v-model="filters.category"
            :items="categoryOptions"
            value-key="value"
            placeholder="选择分类"
            class="w-full"
          />
        </div>

        <div class="rounded-2xl border border-violet-200/70 bg-white/85 p-3 shadow-[0_8px_20px_rgba(76,29,149,0.08)] dark:border-violet-900/70 dark:bg-slate-900/60">
          <div class="mb-2 flex items-center justify-between">
            <p class="text-xs font-medium text-slate-500 dark:text-violet-200/80">
              标签（多选）
            </p>
            <UButton
              v-if="selectedTags.length > 0"
              size="xs"
              color="neutral"
              variant="ghost"
              class="h-6 px-2 text-[11px]"
              @click="clearTags"
            >
              清空
            </UButton>
          </div>
          <USelectMenu
            v-model="selectedTags"
            :items="tagOptions"
            value-key="value"
            placeholder="选择标签"
            multiple
            class="w-full"
          />
        </div>
      </div>

      <div class="relative mt-4 flex flex-wrap items-center justify-end gap-2">
        <div class="mr-auto hidden text-xs text-slate-500 dark:text-violet-200/80 sm:block">
          提示：可多选标签快速缩小范围
        </div>
        <ClientOnly>
          <div class="flex items-center gap-2">
            <UButton
              variant="soft"
              color="primary"
              icon="i-lucide-shuffle"
              :disabled="wallpapers.length === 0"
              @click="pickRandomWallpaper"
            >
              随机一张
            </UButton>
            <UButton
              v-if="hasActiveFilters"
              variant="outline"
              color="neutral"
              icon="i-lucide-rotate-ccw"
              @click="clearFilters"
            >
              重置筛选
            </UButton>
          </div>
        </ClientOnly>
      </div>
    </section>

    <div
      id="wallpaper-grid"
      class="scroll-mt-40"
    >
      <ClientOnly>
        <WallpaperGrid
          :wallpapers="wallpapers"
          :loading="loading"
          @card-click="handleCardClick"
          @download="handleDownload"
          @view="handleView"
        />
        <template #fallback>
          <div class="py-20 text-center text-sm text-violet-500 dark:text-violet-300/80">
            正在加载壁纸...
          </div>
        </template>
      </ClientOnly>
    </div>

    <ClientOnly>
      <div
        v-if="totalPages > 1"
        class="mt-10 flex justify-center"
      >
        <div class="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white/85 px-4 py-2 text-[11px] text-slate-800 shadow-[0_18px_55px_rgba(73,41,130,0.26)] backdrop-blur-xl dark:border-violet-900/80 dark:bg-slate-950/90 dark:text-slate-100 sm:px-5">
          <UButton
            icon="i-lucide-arrow-left"
            size="xs"
            color="primary"
            variant="ghost"
            class="h-8 w-8 rounded-full border border-violet-200/80 dark:border-violet-800/80"
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
                class="h-8 min-w-8 justify-center rounded-full px-0.5 text-[11px]"
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

          <div class="ml-2 hidden items-center gap-1 sm:flex">
            <UInput
              v-model="inputPage"
              size="xs"
              class="h-8 w-16 rounded-full border-violet-200/80 bg-violet-50/70 text-center text-[11px] dark:border-violet-800/80 dark:bg-slate-900/70"
              :disabled="loading"
              placeholder="跳转"
              @keyup.enter="handleJump"
            />
            <UButton
              size="xs"
              color="primary"
              variant="soft"
              class="h-8 rounded-full px-3 text-[11px]"
              :disabled="loading"
              @click="handleJump"
            >
              前往
            </UButton>
          </div>

          <div class="ml-1 hidden items-center gap-1 border-l border-violet-200/80 pl-3 text-slate-500 dark:border-violet-800/70 dark:text-violet-200/90 sm:flex">
            <span>第</span>
            <span class="text-[11px] font-semibold">{{ currentPage }}</span>
            <span>/</span>
            <span class="text-[11px]">{{ totalPages }}</span>
          </div>

          <UButton
            icon="i-lucide-arrow-right"
            size="xs"
            color="primary"
            variant="ghost"
            class="h-8 w-8 rounded-full border border-violet-200/80 dark:border-violet-800/80"
            :disabled="currentPage >= totalPages || loading"
            @click="goNextPage"
          />
        </div>
      </div>
    </ClientOnly>

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
  downloadPicture,
  loading: wallpaperLoading,
  error
} = useWallpaper()

const route = useRoute()
const router = useRouter()

const pageSize = 12

const { data: initialWallpapers, pending: initialPending } = useAsyncData(
  'index-wallpapers',
  () => {
    const featuredRaw = route.query.featured
    const featured = featuredRaw === '1' ? 1 : null
    return getWallpapers({ pageNum: 1, pageSize, isFeatured: featured })
  }
)

const { data: tagsData } = useAsyncData<TagResponse[]>(
  'index-tags',
  () => getTags()
)

const { getDictionariesByType, initDictionaries } = useDictionary()
const { data: categoryDictData } = useAsyncData(
  'index-categories',
  () => getDictionariesByType(0)
)

const wallpapers = ref<PictureResponseInfo[]>([])
const tags = ref<TagResponse[]>([])
const selectedTags = ref<string[]>([])
const currentPage = ref(1)
const total = ref(0)

const filters = ref({
  deviceType: null as number | null,
  isFeatured: null as number | null,
  category: null as string | null,
  tags: null as string[] | null
})

const parseTagQuery = (value: unknown): string[] => {
  const normalize = (input: string) => input.trim()
  const splitTags = (input: string) =>
    input
      .split(',')
      .map(normalize)
      .filter(Boolean)

  if (Array.isArray(value)) {
    return Array.from(new Set(value.flatMap(item => splitTags(String(item)))))
  }

  if (typeof value === 'string') {
    return Array.from(new Set(splitTags(value)))
  }

  return []
}

const isSameStringArray = (left: string[], right: string[]) => {
  if (left.length !== right.length) {
    return false
  }

  return left.every((item, index) => item === right[index])
}

watch(
  () => [route.query.featured, route.query.tag] as const,
  ([featuredRaw, tagRaw]) => {
    const nextFeatured = featuredRaw === '1' ? 1 : null
    const nextTags = parseTagQuery(tagRaw)

    if (filters.value.isFeatured !== nextFeatured) {
      filters.value.isFeatured = nextFeatured
    }

    if (!isSameStringArray(selectedTags.value, nextTags)) {
      selectedTags.value = nextTags
    }
  },
  { immediate: true }
)

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

const loading = computed(() => initialPending.value || wallpaperLoading.value)

const deviceTypeOptions = [
  { label: '全部', value: null },
  { label: 'PC端', value: 1 },
  { label: '移动端', value: 2 },
  { label: '头像', value: 3 }
]

const featuredOptions = [
  { label: '全部', value: null },
  { label: '精选', value: 1 }
]

const tagOptions = computed(() =>
  tags.value.map((tag: TagResponse) => ({
    label: tag.name,
    value: tag.name
  }))
)

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

const hasActiveFilters = computed(() => {
  return (
    filters.value.deviceType !== null
    || filters.value.isFeatured !== null
    || filters.value.category !== null
    || (selectedTags.value && selectedTags.value.length > 0)
  )
})

const activeFilterCount = computed(() => {
  let count = 0
  if (filters.value.deviceType !== null) count += 1
  if (filters.value.isFeatured !== null) count += 1
  if (filters.value.category !== null) count += 1
  if (selectedTags.value.length > 0) count += 1
  return count
})

const totalPages = computed(() => {
  if (!total.value) return 1
  return Math.max(1, Math.ceil(total.value / pageSize))
})

const inputPage = ref('')

const loadWallpapers = async (page = 1) => {
  try {
    wallpaperLoading.value = true

    const response = await getWallpapers({
      pageNum: page,
      pageSize,
      deviceType: filters.value.deviceType,
      isFeatured: filters.value.isFeatured,
      category: filters.value.category || null,
      tags: selectedTags.value.length > 0 ? selectedTags.value : null
    })

    if (response) {
      const newWallpapers = response.records || []
      wallpapers.value = newWallpapers
      total.value = response.total ?? newWallpapers.length
      currentPage.value = page

      if (import.meta.client && page > 1) {
        document.getElementById('wallpaper-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
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

const pickRandomWallpaper = () => {
  if (wallpapers.value.length === 0) return
  const random = wallpapers.value[Math.floor(Math.random() * wallpapers.value.length)]
  if (random?.id) {
    navigateTo(`/wallpaper/${random.id}`)
  }
}

const clearDeviceType = () => {
  filters.value.deviceType = null
}

const clearFeatured = () => {
  filters.value.isFeatured = null
}

const clearCategory = () => {
  filters.value.category = null
}

const clearTags = () => {
  selectedTags.value = []
}

const clearFilters = () => {
  filters.value = {
    deviceType: null,
    isFeatured: null,
    category: null,
    tags: null
  }

  selectedTags.value = []
}

watch(
  [() => filters.value.deviceType, () => filters.value.isFeatured, () => filters.value.category, selectedTags],
  () => {
    currentPage.value = 1

    const query: Record<string, string> = {}
    if (filters.value.isFeatured === 1) {
      query.featured = '1'
    }
    if (selectedTags.value.length > 0) {
      query.tag = selectedTags.value.join(',')
    }

    router.replace({ query })
    loadWallpapers(1)
  },
  { deep: true }
)

onMounted(() => {
  initDictionaries()
})

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

const handleView = (wallpaper: PictureResponseInfo) => {
  navigateTo(`/wallpaper/${wallpaper.id}`)
}
</script>
