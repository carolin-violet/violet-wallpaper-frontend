<template>
  <div>
    <!-- 加载状态 -->
    <div
      v-if="loading"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
    >
      <div
        v-for="i in 10"
        :key="i"
        class="rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse aspect-video"
      />
    </div>

    <!-- 壁纸网格 -->
    <div
      v-else-if="wallpapers && wallpapers.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
    >
      <WallpaperCard
        v-for="wallpaper in wallpapers"
        :key="wallpaper.id"
        :wallpaper="wallpaper"
        :tags="getTagsForWallpaper(wallpaper)"
        @click="handleCardClick"
        @download="handleDownload"
        @view="handleView"
      />
    </div>

    <!-- 空状态 -->
    <div
      v-else
      class="flex flex-col items-center justify-center py-20 text-center"
    >
      <UIcon
        name="i-lucide-image-off"
        class="w-16 h-16 text-gray-400 mb-4"
      />
      <p class="text-gray-500 dark:text-gray-400">
        暂无壁纸
      </p>
    </div>

    <!-- 加载更多按钮 -->
    <div
      v-if="hasMore && !loading"
      class="flex justify-center mt-8"
    >
      <UButton
        size="lg"
        variant="outline"
        :loading="loadingMore"
        @click="loadMore"
      >
        加载更多
      </UButton>
    </div>

    <!-- 预览弹窗 -->
    <UModal
      v-model="showPreview"
      class="wallpaper-preview-modal"
      :ui="{
        wrapper: 'fixed inset-0 w-screen h-screen max-w-none z-[9999]',
        overlay: 'fixed inset-0 bg-black/50 z-[9999]',
        content:
          'fixed inset-0 w-full h-full max-w-none m-0 flex items-center justify-center z-[9999]'
      }"
    >
      <UCard
        v-if="previewWallpaper"
        class="w-[95vw] h-[95vh] max-w-[95vw] max-h-[95vh] flex flex-col m-auto"
        :ui="{ body: 'flex-1 overflow-hidden', header: 'flex-shrink-0' }"
        @click.stop
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">
              {{ previewWallpaper.original_filename || "壁纸预览" }}
            </h3>
            <UButton
              icon="i-lucide-x"
              color="neutral"
              variant="ghost"
              size="sm"
              @click.stop="closePreview"
            />
          </div>
        </template>

        <div
          class="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-800 overflow-hidden"
        >
          <NuxtImg
            v-if="previewWallpaper.webp_url"
            :src="previewWallpaper.webp_url"
            :alt="previewWallpaper.original_filename || '壁纸'"
            class="max-w-full max-h-full w-auto h-auto object-contain"
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
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { PictureResponseInfo } from '~/api/generated/services/PicturesService'

interface Props {
  wallpapers: PictureResponseInfo[]
  loading?: boolean
  loadingMore?: boolean
  hasMore?: boolean
  tagsMap?: Record<number, string[]>
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  loadingMore: false,
  hasMore: false
})

const emit = defineEmits<{
  'load-more': []
  'card-click': [wallpaper: PictureResponseInfo]
  'download': [wallpaper: PictureResponseInfo]
  'view': [wallpaper: PictureResponseInfo]
}>()

const getTagsForWallpaper = (wallpaper: PictureResponseInfo): string[] => {
  if (props.tagsMap && wallpaper.id) {
    return props.tagsMap[wallpaper.id] || []
  }
  return []
}

const loadMore = () => {
  emit('load-more')
}

const handleCardClick = (wallpaper: PictureResponseInfo) => {
  emit('card-click', wallpaper)
}

const handleDownload = (wallpaper: PictureResponseInfo) => {
  emit('download', wallpaper)
}

const showPreview = ref(false)
const previewWallpaper = ref<PictureResponseInfo | null>(null)
const isClosing = ref(false)

const handleView = (wallpaper: PictureResponseInfo) => {
  // 如果正在关闭，忽略新的预览请求
  if (isClosing.value) {
    return
  }
  previewWallpaper.value = wallpaper
  showPreview.value = true
  // 不向上传递 view 事件，避免导航到详情页
  // 预览次数已在 WallpaperCard 中增加
}

const closePreview = () => {
  isClosing.value = true
  showPreview.value = false
  // 延迟清空预览壁纸和关闭标志，避免关闭动画时内容消失
  setTimeout(() => {
    previewWallpaper.value = null
    isClosing.value = false
  }, 300)
}
</script>

<style>
/* 强制设置预览弹窗的 z-index 和定位 */
/* 使用全局样式确保样式生效，覆盖 UModal 的默认样式 */
.wallpaper-preview-modal,
.wallpaper-preview-modal [data-headlessui-state],
.wallpaper-preview-modal [data-headlessui-state] > div,
.wallpaper-preview-modal [role="dialog"],
.wallpaper-preview-modal [role="dialog"] > div {
  position: fixed !important;
  z-index: 9999 !important;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
}

/* 确保 wrapper 覆盖整个屏幕 */
.wallpaper-preview-modal [data-headlessui-state] > div:first-child,
.wallpaper-preview-modal [role="dialog"] > div:first-child {
  inset: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
}

/* 确保 content 区域正确居中 */
.wallpaper-preview-modal [data-headlessui-state] > div:last-child,
.wallpaper-preview-modal [role="dialog"] > div:last-child {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}
</style>
