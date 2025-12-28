<template>
  <div>
    <!-- 加载状态 -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <div
        v-for="i in 10"
        :key="i"
        class="rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse aspect-[16/9]"
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
      <UIcon name="i-lucide-image-off" class="w-16 h-16 text-gray-400 mb-4" />
      <p class="text-gray-500 dark:text-gray-400">暂无壁纸</p>
    </div>

    <!-- 加载更多按钮 -->
    <div
      v-if="hasMore && !loading"
      class="flex justify-center mt-8"
    >
      <UButton
        :loading="loadingMore"
        @click="loadMore"
        size="lg"
        variant="outline"
      >
        加载更多
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PictureResponseInfo } from "~/api/generated/services/PicturesService";

interface Props {
  wallpapers: PictureResponseInfo[];
  loading?: boolean;
  loadingMore?: boolean;
  hasMore?: boolean;
  tagsMap?: Record<number, string[]>;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  loadingMore: false,
  hasMore: false,
});

const emit = defineEmits<{
  "load-more": [];
  "card-click": [wallpaper: PictureResponseInfo];
  download: [wallpaper: PictureResponseInfo];
  view: [wallpaper: PictureResponseInfo];
}>();

const getTagsForWallpaper = (wallpaper: PictureResponseInfo): string[] => {
  if (props.tagsMap && wallpaper.id) {
    return props.tagsMap[wallpaper.id] || [];
  }
  return [];
};

const loadMore = () => {
  emit("load-more");
};

const handleCardClick = (wallpaper: PictureResponseInfo) => {
  emit("card-click", wallpaper);
};

const handleDownload = (wallpaper: PictureResponseInfo) => {
  emit("download", wallpaper);
};

const handleView = (wallpaper: PictureResponseInfo) => {
  emit("view", wallpaper);
};
</script>

