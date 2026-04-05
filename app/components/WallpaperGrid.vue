<template>
  <div class="w-full">
    <div
      v-if="loading"
      :style="listStyle"
    >
      <div
        v-for="i in 12"
        :key="i"
        class="wallpaper-grid-col"
        :style="itemStyle"
      >
        <div class="aspect-4/3 w-full animate-pulse rounded-[1.25rem] bg-violet-100 dark:bg-violet-950/40" />
      </div>
    </div>

    <div
      v-else
      class="w-full"
    >
      <div
        v-if="wallpapers && wallpapers.length > 0"
        :style="listStyle"
      >
        <div
          v-for="wallpaper in wallpapers"
          :key="wallpaper.id"
          class="wallpaper-grid-col"
          :style="itemStyle"
        >
          <WallpaperCard
            :wallpaper="wallpaper"
            :tags="getTagsForWallpaper(wallpaper)"
            @click="handleCardClick"
            @download="handleDownload"
            @view="handleView"
          />
        </div>
      </div>

      <div
        v-else
        class="flex flex-col items-center justify-center py-20 text-center"
      >
        <UIcon
          name="i-lucide-image-off"
          class="mb-4 h-16 w-16 text-violet-300"
        />
        <p class="text-violet-500 dark:text-violet-300/80">
          暂无壁纸
        </p>
      </div>
    </div>

    <UModal
      v-model="showPreview"
      class="wallpaper-preview-modal"
      :ui="{
        wrapper: 'fixed inset-0 z-[9999] h-screen w-screen max-w-none',
        overlay: 'fixed inset-0 z-[9999] bg-black/50',
        content: 'fixed inset-0 z-[9999] m-0 flex h-full w-full max-w-none items-center justify-center'
      }"
    >
      <UCard
        v-if="previewWallpaper"
        class="m-auto flex h-[95vh] max-h-[95vh] min-h-0 w-[95vw] max-w-[95vw] flex-col"
        :ui="{ body: 'flex flex-1 min-h-0 flex-col overflow-hidden', header: 'flex-shrink-0' }"
        @click.stop
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">
              {{ previewWallpaper.original_filename || '壁纸预览' }}
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

        <div class="flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-800">
          <NuxtImg
            v-if="previewWallpaper.webp_url"
            :src="previewWallpaper.webp_url"
            :alt="previewWallpaper.original_filename || '壁纸'"
            class="h-full w-full object-contain"
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
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { PictureResponseInfo } from '~/api/generated'

interface Props {
  wallpapers: PictureResponseInfo[]
  loading?: boolean
  tagsMap?: Record<number, string[]>
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
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

const handleCardClick = (wallpaper: PictureResponseInfo) => {
  emit('card-click', wallpaper)
}

const handleDownload = (wallpaper: PictureResponseInfo) => {
  emit('download', wallpaper)
}

const showPreview = ref(false)
const previewWallpaper = ref<PictureResponseInfo | null>(null)
const isClosing = ref(false)
const viewportWidth = ref(1920)

const getColumnCount = (width: number) => {
  if (width < 900) return 1
  if (width < 1280) return 2
  if (width < 1800) return 3
  return 4
}

const columnCount = computed(() => getColumnCount(viewportWidth.value))

const listStyle = computed(() => 'display:flex;flex-wrap:wrap;width:100%;gap:1.25rem;align-items:flex-start;')

const itemStyle = computed(() => {
  if (columnCount.value <= 1) return 'flex:0 0 100%;max-width:100%;min-width:0;'
  if (columnCount.value === 2) return 'flex:0 0 calc(50% - 0.625rem);max-width:calc(50% - 0.625rem);min-width:0;'
  if (columnCount.value === 3) return 'flex:0 0 calc(33.333333% - 0.833333rem);max-width:calc(33.333333% - 0.833333rem);min-width:0;'
  return 'flex:0 0 calc(25% - 0.9375rem);max-width:calc(25% - 0.9375rem);min-width:0;'
})

const updateViewportWidth = () => {
  viewportWidth.value = window.innerWidth || 1920
}

onMounted(() => {
  updateViewportWidth()
  window.addEventListener('resize', updateViewportWidth, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateViewportWidth)
})

const handleView = (wallpaper: PictureResponseInfo) => {
  if (isClosing.value) {
    return
  }
  previewWallpaper.value = wallpaper
  showPreview.value = true
}

const closePreview = () => {
  isClosing.value = true
  showPreview.value = false
  setTimeout(() => {
    previewWallpaper.value = null
    isClosing.value = false
  }, 300)
}
</script>

<style scoped>
.wallpaper-grid-col > * {
  width: 100%;
  min-width: 0;
}
</style>

<style>
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

.wallpaper-preview-modal [data-headlessui-state] > div:first-child,
.wallpaper-preview-modal [role="dialog"] > div:first-child {
  inset: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
}

.wallpaper-preview-modal [data-headlessui-state] > div:last-child,
.wallpaper-preview-modal [role="dialog"] > div:last-child {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}
</style>
