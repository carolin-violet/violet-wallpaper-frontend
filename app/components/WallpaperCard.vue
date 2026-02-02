<template>
  <div
    class="wallpaper-card group relative overflow-hidden rounded-[1.4rem] bg-white/80 dark:bg-slate-950/90 w-full min-w-0 max-w-full border border-slate-200/70 dark:border-slate-800/80 shadow-[0_18px_50px_rgba(15,23,42,0.14)]"
    @click="handleClick"
  >
    <!-- 图片容器：固定比例，大图展示 -->
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

      <div class="absolute inset-0 pointer-events-none">
        <!-- 悬浮信息面板 -->
        <div
          class="wallpaper-hover-panel"
          @click.stop
        >
          <div class="flex items-center gap-3">
            <div class="flex-1 min-w-0">
              <p class="wallpaper-hover-title">
                {{ displayTitle }}
              </p>

              <!-- 统计信息 + 分类 -->
              <div class="wallpaper-hover-meta">
                <span
                  class="wallpaper-hover-meta-item"
                >
                  <UIcon
                    name="i-lucide-eye"
                    class="w-3 h-3"
                  />
                  <span>{{ wallpaper.view_count || 0 }}</span>
                </span>
                <span
                  class="wallpaper-hover-meta-item"
                >
                  <UIcon
                    name="i-lucide-download"
                    class="w-3 h-3"
                  />
                  <span>{{ wallpaper.download_count || 0 }}</span>
                </span>
                <span
                  v-if="wallpaper.category"
                  class="wallpaper-hover-meta-item"
                >
                  <UIcon
                    name="i-lucide-folder"
                    class="w-3 h-3"
                  />
                  <span>{{ categoryName }}</span>
                </span>
              </div>
            </div>

            <UButton
              icon="i-lucide-eye"
              color="neutral"
              variant="ghost"
              size="xs"
              class="shrink-0 rounded-full h-8 w-8 flex items-center justify-center bg-slate-50 text-slate-900 hover:bg-slate-100 border border-slate-200/80 shadow-[0_8px_24px_rgba(15,23,42,0.45)] cursor-pointer"
              @click.stop="handleView"
            />
          </div>

          <!-- 标签（即使没有标签也保留高度以保证卡片对齐） -->
          <div class="wallpaper-hover-tags">
            <template v-if="wallpaper.tags && wallpaper.tags.length > 0">
              <span
                v-for="tag in wallpaper.tags.slice(0, 3)"
                :key="tag"
              >
                {{ tag }}
              </span>
              <span v-if="wallpaper.tags.length > 3">
                +{{ wallpaper.tags.length - 3 }}
              </span>
            </template>
          </div>
        </div>
      </div>

      <!-- 分辨率标签 -->
      <div
        v-if="wallpaper.width && wallpaper.height"
        class="absolute top-2.5 right-2.5 inline-flex items-center gap-1 rounded-full bg-slate-950/85 text-[11px] font-medium text-slate-50 px-2.5 py-1 shadow-[0_12px_30px_rgba(15,23,42,0.75)] backdrop-blur-md"
      >
        {{ wallpaper.width }} × {{ wallpaper.height }}
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

// 标题展示文案：避免过长文件名破坏布局
const displayTitle = computed(() => {
  const name = props.wallpaper.original_filename || '未命名壁纸'

  if (name.length <= 28) {
    return name
  }

  const dotIndex = name.lastIndexOf('.')
  if (dotIndex > 0) {
    const ext = name.slice(dotIndex)
    const base = name.slice(0, dotIndex)
    const trimmedBase = base.length > 20 ? `${base.slice(0, 18)}…` : base
    return `${trimmedBase}${ext}`
  }

  return `${name.slice(0, 24)}…`
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
