<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 加载状态 -->
    <div
      v-if="loading"
      class="flex justify-center items-center min-h-[60vh]"
    >
      <UIcon
        name="i-lucide-loader-2"
        class="w-8 h-8 animate-spin text-primary"
      />
    </div>

    <!-- 错误状态 -->
    <UAlert
      v-else-if="error"
      color="error"
      variant="soft"
      :title="error"
    />

    <!-- 壁纸详情 -->
    <div
      v-else-if="wallpaper"
      class="max-w-6xl mx-auto"
    >
      <!-- 返回按钮 -->
      <UButton
        variant="ghost"
        icon="i-lucide-arrow-left"
        class="mb-6"
        @click="goBack"
      >
        返回
      </UButton>

      <!-- 主要内容 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 图片区域 -->
        <div class="lg:col-span-2">
          <div
            class="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800"
          >
            <NuxtImg
              v-if="wallpaper && (wallpaper.webp_url || wallpaper.thumbnail_url || wallpaper.url)"
              :src="wallpaper.webp_url || wallpaper.thumbnail_url || wallpaper.url"
              :alt="wallpaper.original_filename || '壁纸'"
              class="w-full h-auto"
              loading="lazy"
            />
            <div
              v-else
              class="aspect-video flex items-center justify-center bg-gray-200 dark:bg-gray-700"
            >
              <UIcon
                name="i-lucide-image"
                class="w-16 h-16 text-gray-400"
              />
            </div>
          </div>
          <!-- 操作按钮 -->
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

        <!-- 信息区域 -->
        <div class="space-y-6">
          <!-- 基本信息 -->
          <UCard>
            <template #header>
              <h2 class="text-xl font-semibold">
                壁纸信息
              </h2>
            </template>

            <div class="space-y-4">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  文件名
                </p>
                <p class="font-medium">
                  {{ wallpaper.original_filename || "未命名" }}
                </p>
              </div>

              <div v-if="wallpaper.width && wallpaper.height">
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  分辨率
                </p>
                <p class="font-medium">
                  {{ wallpaper.width }} × {{ wallpaper.height }} px
                </p>
              </div>

              <div v-if="categoryName">
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
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
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
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
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  预览次数
                </p>
                <p class="font-medium flex items-center gap-1">
                  <UIcon
                    name="i-lucide-eye"
                    class="w-4 h-4"
                  />
                  {{ wallpaper.view_count || 0 }}
                </p>
              </div>
            </div>
          </UCard>

          <!-- 标签 -->
          <UCard v-if="tags && tags.length > 0">
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
const { getDictionaryName, initDictionaries } = useDictionary()

const id = computed(() => Number(route.params.id))

const config = useRuntimeConfig()
const defaultApiBase = (config.public.apiBaseUrl as string) || 'http://127.0.0.1:8203'
const ssrBaseURL = import.meta.server
  ? defaultApiBase
  : (import.meta.dev ? '' : defaultApiBase)

// SSR：使用详情接口获取单个壁纸
const {
  data: wallpaper,
  pending: loading,
  error: fetchError
} = useAsyncData(
  () => `wallpaper-${route.params.id}`,
  async () => {
    const pid = id.value
    if (!pid || isNaN(pid)) {
      throw new Error('无效的壁纸ID')
    }

    try {
      const response = await getWallpaperById(pid, ssrBaseURL)
      return response
    } catch (err: any) {
      console.error('获取壁纸详情失败:', err)
      throw err
    }
  },
  { watch: [id] }
)

const error = computed(() => {
  if (fetchError.value) {
    return fetchError.value.message || '获取壁纸详情失败'
  }
  return null
})

// 仅客户端：增加预览次数（不在 SSR 中调用，避免每次请求都 +1）、初始化字典
onMounted(() => {
  initDictionaries()
  if (id.value && wallpaper.value) {
    incrementView(id.value)
  }
})

// 分类中文名（来自字典）
const categoryName = computed(() => getDictionaryName(wallpaper.value?.category))

// 获取设备类型名称
const getDeviceTypeName = (type: number | null) => {
  const map: Record<number, string> = {
    1: 'PC端',
    2: '移动端',
    3: '头像'
  }
  return type ? map[type] || '未知' : '未知'
}

const tags = computed(() => wallpaper.value?.tags ?? [])

const handleDownload = async () => {
  if (!wallpaper.value) return
  try {
    const blob = await downloadPicture(wallpaper.value.id)
    const filename = wallpaper.value.original_filename || `wallpaper-${wallpaper.value.id}`
    downloadBlobAsFile(blob, filename)
  } catch (err) {
    console.error('下载失败:', err)
  }
}

const handleShare = () => {
  if (typeof navigator !== 'undefined' && navigator.share && wallpaper.value) {
    navigator.share({
      title: wallpaper.value.original_filename || '壁纸',
      url: window.location.href
    })
  } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
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
