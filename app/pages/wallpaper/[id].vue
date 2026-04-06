<template>
  <div class="container mx-auto px-4 py-8">
    <div
      v-if="loading"
      class="flex min-h-[60vh] items-center justify-center"
    >
      <UIcon
        name="i-lucide-loader-2"
        class="h-8 w-8 animate-spin text-primary"
      />
    </div>

    <UAlert
      v-else-if="error"
      color="error"
      variant="soft"
      :title="error"
    />

    <div
      v-else-if="wallpaper"
      class="mx-auto max-w-6xl"
    >
      <UButton
        variant="ghost"
        icon="i-lucide-arrow-left"
        class="mb-6"
        @click="goBack"
      >
        返回
      </UButton>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div class="lg:col-span-2">
          <div class="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
            <NuxtImg
              v-if="imageSrc"
              :src="imageSrc"
              :alt="wallpaper.original_filename || '壁纸'"
              class="h-auto w-full"
              loading="lazy"
            />
            <div
              v-else
              class="flex aspect-video items-center justify-center bg-gray-200 dark:bg-gray-700"
            >
              <UIcon
                name="i-lucide-image"
                class="h-16 w-16 text-gray-400"
              />
            </div>
          </div>

          <div class="mt-4 flex gap-4">
            <UButton
              icon="i-lucide-download"
              size="lg"
              @click="handleDownload"
            >
              下载原图
            </UButton>
            <UButton
              icon="i-lucide-share-2"
              variant="outline"
              size="lg"
              @click="handleShare"
            >
              分享
            </UButton>
          </div>
        </div>

        <div class="space-y-6">
          <UCard>
            <template #header>
              <h2 class="text-xl font-semibold">
                壁纸信息
              </h2>
            </template>

            <div class="space-y-4">
              <div>
                <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">
                  文件名
                </p>
                <p class="font-medium">
                  {{ wallpaper.original_filename || '未命名' }}
                </p>
              </div>

              <div v-if="wallpaper.width && wallpaper.height">
                <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">
                  分辨率
                </p>
                <p class="font-medium">
                  {{ wallpaper.width }} × {{ wallpaper.height }} px
                </p>
              </div>

              <div v-if="categoryName">
                <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">
                  分类
                </p>
                <UBadge
                  color="primary"
                  variant="soft"
                >
                  {{ categoryName }}
                </UBadge>
              </div>

              <div v-if="wallpaper.device_type">
                <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">
                  设备类型
                </p>
                <UBadge
                  color="neutral"
                  variant="soft"
                >
                  {{ getDeviceTypeName(wallpaper.device_type) }}
                </UBadge>
              </div>

              <div>
                <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">
                  浏览次数
                </p>
                <p class="flex items-center gap-1 font-medium">
                  <UIcon
                    name="i-lucide-eye"
                    class="h-4 w-4"
                  />
                  {{ wallpaper.view_count || 0 }}
                </p>
              </div>
            </div>
          </UCard>

          <UCard v-if="tags.length > 0">
            <template #header>
              <h2 class="text-xl font-semibold">
                标签
              </h2>
            </template>

            <div class="flex flex-wrap gap-2">
              <UBadge
                v-for="tag in tags"
                :key="tag"
                color="primary"
                variant="soft"
                class="cursor-pointer"
                @click="searchByTag(tag)"
              >
                {{ tag }}
              </UBadge>
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const { getWallpaperById, downloadPicture, incrementView } = useWallpaper()
const { getDictionaryName, getDictionariesByType, initDictionaries } = useDictionary()

interface CategoryDictionaryItem {
  code?: string
  name?: string
  name_cn?: string
}

interface WallpaperDetail {
  id: number
  original_filename?: string | null
  width?: number | null
  height?: number | null
  webp_url?: string | null
  thumbnail_url?: string | null
  url?: string | null
  category?: string | null
  device_type?: number | null
  view_count?: number | null
  tags?: string[]
}

const id = computed(() => Number(route.params.id))

const { data: categoryDictData } = useAsyncData(
  'wallpaper-detail-categories',
  () => getDictionariesByType(0)
)

const {
  data: wallpaper,
  pending: loading,
  error: fetchError
} = useAsyncData<WallpaperDetail>(
  () => `wallpaper-${route.params.id}`,
  async () => {
    const pid = id.value
    if (!pid || Number.isNaN(pid)) {
      throw new Error('无效的壁纸 ID')
    }

    const response = await getWallpaperById(pid)
    return response as WallpaperDetail
  },
  { watch: [id] }
)

const error = computed(() => {
  if (fetchError.value) {
    return fetchError.value.message || '获取壁纸详情失败'
  }
  return null
})

onMounted(() => {
  initDictionaries()
  if (id.value && wallpaper.value) {
    incrementView(id.value)
  }
})

const imageSrc = computed(() => {
  if (!wallpaper.value) {
    return ''
  }

  return wallpaper.value.webp_url || wallpaper.value.thumbnail_url || wallpaper.value.url || ''
})

const categoryName = computed(() => {
  const categoryCode = wallpaper.value?.category
  if (!categoryCode) {
    return ''
  }

  const normalizedCode = String(categoryCode).trim()
  const localCategory = categoryDictData.value?.find(
    (item: CategoryDictionaryItem) => String(item.code ?? '').trim() === normalizedCode
  )

  return localCategory?.name_cn || localCategory?.name || getDictionaryName(categoryCode)
})

const getDeviceTypeName = (type: number | null | undefined) => {
  const map: Record<number, string> = {
    1: 'PC端',
    2: '移动端',
    3: '头像'
  }

  if (!type) {
    return '未知'
  }

  return map[type] || '未知'
}

const tags = computed(() => wallpaper.value?.tags ?? [])

const handleDownload = async () => {
  if (!wallpaper.value) {
    return
  }

  try {
    const blob = await downloadPicture(wallpaper.value.id)
    const filename = wallpaper.value.original_filename || `wallpaper-${wallpaper.value.id}`
    downloadBlobAsFile(blob, filename)
  } catch (err) {
    console.error('下载失败:', err)
  }
}

const handleShare = () => {
  if (!wallpaper.value || typeof navigator === 'undefined') {
    return
  }

  if (navigator.share) {
    navigator.share({
      title: wallpaper.value.original_filename || '壁纸',
      url: window.location.href
    })
    return
  }

  if (navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href)
  }
}

const searchByTag = (tag: string) => {
  router.push({ path: '/', query: { tag } })
}

const goBack = () => {
  router.back()
}
</script>
