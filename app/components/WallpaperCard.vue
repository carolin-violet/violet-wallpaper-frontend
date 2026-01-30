<template>
  <div
    class="group relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] w-full min-w-0 max-w-full"
    @click="handleClick"
  >
    <!-- 图片容器：固定比例，图片填满并裁剪 -->
    <div class="wallpaper-image-container">
      <NuxtImg
        v-if="wallpaper.thumbnail_url"
        :src="wallpaper.thumbnail_url"
        :alt="wallpaper.original_filename || '壁纸'"
        class="wallpaper-image"
      />
      <div
        v-else
        class="wallpaper-image-placeholder"
      >
        <UIcon
          name="i-lucide-image"
          class="w-12 h-12 text-gray-400"
        />
      </div>

      <!-- 悬停遮罩 -->
      <div
        class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
      >
        <div class="flex gap-2">
          <!-- <UButton
            icon="i-lucide-download"
            color="neutral"
            variant="solid"
            size="sm"
            @click.stop="handleDownload"
          /> -->
          <UButton
            icon="i-lucide-eye"
            color="neutral"
            variant="solid"
            size="sm"
            @click.stop="handleView"
          />
        </div>
      </div>

      <!-- 分辨率标签 -->
      <div
        v-if="wallpaper.width && wallpaper.height"
        class="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm"
      >
        {{ wallpaper.width }} × {{ wallpaper.height }}
      </div>
    </div>

    <!-- 信息区域 -->
    <div class="p-3">
      <div class="flex items-start justify-between gap-2">
        <div class="flex-1 min-w-0">
          <p
            v-if="wallpaper.original_filename"
            class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate"
          >
            {{ wallpaper.original_filename }}
          </p>
          <p
            v-else
            class="text-sm text-gray-500 dark:text-gray-400"
          >
            未命名壁纸
          </p>
        </div>
      </div>
      <!-- 标签 -->
      <div
        v-if="wallpaper.tags && wallpaper.tags.length > 0"
        class="mt-2 flex flex-wrap gap-1"
      >
        <UBadge
          v-for="tag in wallpaper.tags.slice(0, 3)"
          :key="tag"
          color="primary"
          variant="subtle"
          size="xs"
        >
          {{ tag }}
        </UBadge>
        <UBadge
          v-if="wallpaper.tags.length > 3"
          color="neutral"
          variant="subtle"
          size="xs"
        >
          +{{ wallpaper.tags.length - 3 }}
        </UBadge>
      </div>

      <!-- 统计信息 -->
      <div
        class="mt-2 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400"
      >
        <div class="flex items-center gap-1">
          <UIcon
            name="i-lucide-eye"
            class="w-3 h-3"
          />
          <span>{{ wallpaper.view_count || 0 }}</span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon
            name="i-lucide-download"
            class="w-3 h-3"
          />
          <span>{{ wallpaper.download_count || 0 }}</span>
        </div>
        <div
          v-if="wallpaper.category"
          class="flex items-center gap-1"
        >
          <UIcon
            name="i-lucide-folder"
            class="w-3 h-3"
          />
          <span>{{ categoryName }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PictureResponseInfo } from '~/api/generated/services/PicturesService'

interface Props {
  wallpaper: PictureResponseInfo
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: [wallpaper: PictureResponseInfo]
  download: [wallpaper: PictureResponseInfo]
  view: [wallpaper: PictureResponseInfo]
}>()

const { incrementView } = useWallpaper()
const { getDictionaryName, initDictionaries } = useDictionary()

// 初始化字典数据
onMounted(() => {
  initDictionaries()
})

// 计算 category 的中文名称
const categoryName = computed(() => {
  return getDictionaryName(props.wallpaper.category)
})

const handleClick = () => {
  emit('click', props.wallpaper)
}

// const handleDownload = () => {
//   // 只触发事件，让父组件处理下载逻辑
//   emit("download", props.wallpaper);
// };

const handleView = async () => {
  // 增加预览次数
  if (props.wallpaper.id) {
    await incrementView(props.wallpaper.id)
  }
  // 触发 view 事件，让父组件显示预览弹窗
  emit('view', props.wallpaper)
}
</script>

