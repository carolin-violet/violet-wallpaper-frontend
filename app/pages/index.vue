<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 搜索和筛选区域 -->
    <div class="mb-8 space-y-4">
      <!-- 搜索框 -->
      <UInput
        v-model="searchQuery"
        placeholder="搜索壁纸..."
        icon="i-lucide-search"
        size="lg"
        class="max-w-md"
        @keyup.enter="handleSearch"
      />

      <!-- 筛选器 -->
      <div class="flex flex-wrap gap-4 items-center">
        <!-- 设备类型 -->
        <USelectMenu
          v-model="filters.deviceType"
          :options="deviceTypeOptions"
          placeholder="设备类型"
          class="w-40"
        />

        <!-- 分类 -->
        <UInput
          v-model="filters.category"
          placeholder="分类"
          class="w-40"
        />

        <!-- 标签 -->
        <USelectMenu
          v-model="selectedTags"
          :options="tagOptions"
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
      :loading-more="loadingMore"
      :has-more="hasMore"
      :tags-map="tagsMap"
      @load-more="loadMore"
      @card-click="handleCardClick"
      @download="handleDownload"
      @view="handleView"
    />

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
import type { PictureResponseInfo } from '~/api/generated/services/PicturesService'

const {
  getWallpapers,
  getTags,
  incrementView,
  downloadPicture,
  loading: wallpaperLoading,
  error
} = useWallpaper()

const pageSize = 20

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

const { data: tagsData } = useAsyncData(
  'index-tags',
  () => getTags(ssrBaseURL)
)

useAsyncData('index-dictionaries', async () => {
  const { getDictionaries } = useDictionary()
  await getDictionaries(ssrBaseURL)
  return null
})

// 状态：首屏数据同步到 ref，便于客户端筛选/加载更多
const wallpapers = ref<PictureResponseInfo[]>([])
const tags = ref<any[]>([])
const tagsMap = ref<Record<number, string[]>>({})
const searchQuery = ref('')
const selectedTags = ref<string[]>([])
const loadingMore = ref(false)
const hasMore = ref(false)
const currentPage = ref(1)

// 筛选器
const filters = ref({
  deviceType: null as number | null,
  category: '',
  tags: null as string[] | null
})

watch(
  initialWallpapers,
  (v) => {
    if (v?.records) {
      wallpapers.value = v.records
      hasMore.value = v.records.length === pageSize
      currentPage.value = 1
    }
  },
  { immediate: true }
)

watch(
  tagsData,
  (v) => {
    if (Array.isArray(v)) {
      tags.value = v
    } else if (v && typeof v === 'object') {
      tags.value = (v as any).data ?? (v as any).tags ?? []
    } else {
      tags.value = []
    }
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

// 标签选项
const tagOptions = computed(() => {
  if (!tags.value || tags.value.length === 0) return []

  return tags.value.map((tag: any) => {
    const name
      = typeof tag === 'string' ? tag : tag.name || tag.label || String(tag)
    return { label: name, value: name }
  })
})

// 是否有激活的筛选
const hasActiveFilters = computed(() => {
  return (
    filters.value.deviceType !== null
    || filters.value.category !== ''
    || (selectedTags.value && selectedTags.value.length > 0)
  )
})

// 客户端：加载壁纸（筛选、加载更多）
const loadWallpapers = async (page = 1, append = false) => {
  try {
    if (page === 1) {
      wallpaperLoading.value = true
    } else {
      loadingMore.value = true
    }

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
      if (append) {
        wallpapers.value = [...wallpapers.value, ...newWallpapers]
      } else {
        wallpapers.value = newWallpapers
      }
      hasMore.value = newWallpapers.length === pageSize
      currentPage.value = page
    }
  } catch (err) {
    console.error('加载壁纸失败:', err)
  } finally {
    wallpaperLoading.value = false
    loadingMore.value = false
  }
}

const loadMore = () => {
  if (!loadingMore.value && hasMore.value) {
    loadWallpapers(currentPage.value + 1, true)
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadWallpapers(1, false)
}

const clearFilters = () => {
  filters.value = {
    deviceType: null,
    category: '',
    tags: null
  }
  selectedTags.value = []
  searchQuery.value = ''
  currentPage.value = 1
  loadWallpapers(1, false)
}

watch(
  [() => filters.value.deviceType, () => filters.value.category, selectedTags],
  () => {
    currentPage.value = 1
    loadWallpapers(1, false)
  },
  { deep: true }
)

const handleCardClick = (wallpaper: PictureResponseInfo) => {
  navigateTo(`/wallpaper/${wallpaper.id}`)
}

const handleDownload = async (wallpaper: PictureResponseInfo) => {
  try {
    const blob = await downloadPicture(wallpaper.id)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    const filename = wallpaper.original_filename || `wallpaper-${wallpaper.id}`
    let downloadFilename = filename
    if (!filename.includes('.')) {
      const extension = blob.type.split('/')[1] || 'jpg'
      downloadFilename = `${filename}.${extension}`
    }
    link.download = downloadFilename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (err) {
    console.error('下载失败:', err)
  }
}

const handleView = async (wallpaper: PictureResponseInfo) => {
  await incrementView(wallpaper.id)
  navigateTo(`/wallpaper/${wallpaper.id}`)
}
</script>
