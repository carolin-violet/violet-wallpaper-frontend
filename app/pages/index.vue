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
  loading,
  error
} = useWallpaper()

// 状态
const wallpapers = ref<PictureResponseInfo[]>([])
const tags = ref<any[]>([])
const tagsMap = ref<Record<number, string[]>>({})
const searchQuery = ref('')
const selectedTags = ref<string[]>([])
const loadingMore = ref(false)
const hasMore = ref(false)
const currentPage = ref(1)
const pageSize = 20

// 筛选器
const filters = ref({
  deviceType: null as number | null,
  category: '',
  tags: null as string[] | null
})

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
    // 处理不同的标签数据结构
    const name
      = typeof tag === 'string' ? tag : tag.name || tag.label || String(tag)
    return {
      label: name,
      value: name
    }
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

// 加载壁纸列表
const loadWallpapers = async (page = 1, append = false) => {
  try {
    if (page === 1) {
      loading.value = true
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
    // console.log("response", response);
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
    loading.value = false
    loadingMore.value = false
  }
}

// 加载更多
const loadMore = () => {
  if (!loadingMore.value && hasMore.value) {
    loadWallpapers(currentPage.value + 1, true)
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadWallpapers(1, false)
}

// 清除筛选
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

// 监听筛选变化
watch(
  [() => filters.value.deviceType, () => filters.value.category, selectedTags],
  () => {
    currentPage.value = 1
    loadWallpapers(1, false)
  },
  { deep: true }
)

// 卡片点击
const handleCardClick = (wallpaper: PictureResponseInfo) => {
  navigateTo(`/wallpaper/${wallpaper.id}`)
}

// 下载
const handleDownload = async (wallpaper: PictureResponseInfo) => {
  try {
    const blob = await downloadPicture(wallpaper.id)

    // 创建下载链接
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url

    // 从响应头或文件名获取文件扩展名
    const filename = wallpaper.original_filename || `wallpaper-${wallpaper.id}`
    // 如果文件名没有扩展名，尝试从 blob type 推断
    let downloadFilename = filename
    if (!filename.includes('.')) {
      const extension = blob.type.split('/')[1] || 'jpg'
      downloadFilename = `${filename}.${extension}`
    }

    link.download = downloadFilename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // 释放 URL 对象
    window.URL.revokeObjectURL(url)

    console.log('下载壁纸:', wallpaper.id)
  } catch (err) {
    console.error('下载失败:', err)
  }
}

// 查看详情
const handleView = async (wallpaper: PictureResponseInfo) => {
  await incrementView(wallpaper.id)
  navigateTo(`/wallpaper/${wallpaper.id}`)
}

// 加载标签列表
const loadTags = async () => {
  try {
    const response = await getTags()
    if (Array.isArray(response)) {
      tags.value = response
    } else if (response && typeof response === 'object') {
      // 如果是对象，尝试提取数组
      tags.value = (response as any).data || (response as any).tags || []
    } else {
      tags.value = []
    }
  } catch (err) {
    console.error('加载标签失败:', err)
    tags.value = []
  }
}

// 初始化
onMounted(() => {
  loadWallpapers()
  loadTags()
})
</script>
