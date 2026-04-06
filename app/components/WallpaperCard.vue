<template>
  <div
    class="wallpaper-card group relative w-full max-w-full min-w-0 overflow-hidden rounded-[1.4rem] border border-violet-200/70 bg-white/80 shadow-[0_18px_50px_rgba(15,23,42,0.14)] dark:border-violet-900/70 dark:bg-slate-950/90"
    @click="handleClick"
  >
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
          class="h-12 w-12 text-gray-400"
        />
      </div>

      <div
        v-if="wallpaper.is_featured === 1"
        class="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-violet-400/95 px-2.5 py-1 text-[11px] font-semibold text-violet-950 shadow-[0_12px_30px_rgba(15,23,42,0.55)] backdrop-blur-md"
      >
        <UIcon
          name="i-lucide-sparkles"
          class="h-3 w-3"
        />
        精选
      </div>

      <div class="pointer-events-none absolute inset-0">
        <div
          class="wallpaper-hover-panel"
          @click.stop
        >
          <div class="flex items-center gap-3">
            <div class="min-w-0 flex-1">
              <p class="wallpaper-hover-title">
                {{ displayTitle }}
              </p>

              <div class="wallpaper-hover-meta">
                <span class="wallpaper-hover-meta-item">
                  <UIcon
                    name="i-lucide-eye"
                    class="h-3 w-3"
                  />
                  <span>{{ wallpaper.view_count || 0 }}</span>
                </span>
                <span class="wallpaper-hover-meta-item">
                  <UIcon
                    name="i-lucide-download"
                    class="h-3 w-3"
                  />
                  <span>{{ wallpaper.download_count || 0 }}</span>
                </span>
                <span
                  v-if="wallpaper.category"
                  class="wallpaper-hover-meta-item"
                >
                  <UIcon
                    name="i-lucide-folder"
                    class="h-3 w-3"
                  />
                  <span>{{ categoryName }}</span>
                </span>
              </div>
            </div>

            <UButton
              icon="i-lucide-eye"
              color="primary"
              variant="soft"
              size="xs"
              class="h-8 w-8 shrink-0 cursor-pointer rounded-full border border-violet-200/90 bg-violet-50 text-violet-900 shadow-[0_8px_24px_rgba(61,31,120,0.38)] hover:bg-violet-100"
              @click.stop="handleView"
            />
          </div>

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

      <div
        v-if="wallpaper.width && wallpaper.height"
        class="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-slate-950/85 px-2.5 py-1 text-[11px] font-medium text-slate-50 shadow-[0_12px_30px_rgba(15,23,42,0.75)] backdrop-blur-md"
      >
        {{ wallpaper.width }} × {{ wallpaper.height }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PictureResponseInfo } from '~/api/generated'

interface Props {
  wallpaper: PictureResponseInfo
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: [wallpaper: PictureResponseInfo]
  download: [wallpaper: PictureResponseInfo]
  view: [wallpaper: PictureResponseInfo]
}>()

const { getDictionaryName } = useDictionary()

const categoryName = computed(() => {
  return getDictionaryName(props.wallpaper.category)
})

const displayTitle = computed(() => {
  const name = props.wallpaper.original_filename || '未命名壁纸'

  if (name.length <= 28) {
    return name
  }

  const dotIndex = name.lastIndexOf('.')
  if (dotIndex > 0) {
    const ext = name.slice(dotIndex)
    const base = name.slice(0, dotIndex)
    const trimmedBase = base.length > 20 ? `${base.slice(0, 18)}...` : base
    return `${trimmedBase}${ext}`
  }

  return `${name.slice(0, 24)}...`
})

const handleClick = () => {
  emit('click', props.wallpaper)
}

const handleView = () => {
  emit('view', props.wallpaper)
}
</script>

<style scoped>
.wallpaper-card {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
}
</style>
