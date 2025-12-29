<template>
  <div
    class="group relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
    @click="handleClick"
  >
    <!-- 图片容器 -->
    <div class="relative aspect-video w-full overflow-hidden">
      <NuxtImg
        v-if="wallpaper.thumbnail_url"
        :src="wallpaper.thumbnail_url"
        :alt="wallpaper.original_filename || '壁纸'"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700"
      >
        <UIcon name="i-lucide-image" class="w-12 h-12 text-gray-400" />
      </div>

      <!-- 悬停遮罩 -->
      <div
        class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
      >
        <div class="flex gap-2">
          <UButton
            icon="i-lucide-download"
            color="neutral"
            variant="solid"
            size="sm"
            :loading="downloading"
            @click.stop="handleDownload"
          />
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
          <p v-else class="text-sm text-gray-500 dark:text-gray-400">
            未命名壁纸
          </p>
        </div>
      </div>

      <!-- 标签 -->
      <div v-if="tags && tags.length > 0" class="mt-2 flex flex-wrap gap-1">
        <UBadge
          v-for="tag in tags.slice(0, 3)"
          :key="tag"
          color="primary"
          variant="subtle"
          size="xs"
        >
          {{ tag }}
        </UBadge>
        <UBadge
          v-if="tags.length > 3"
          color="neutral"
          variant="subtle"
          size="xs"
        >
          +{{ tags.length - 3 }}
        </UBadge>
      </div>

      <!-- 统计信息 -->
      <div
        class="mt-2 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400"
      >
        <div class="flex items-center gap-1">
          <UIcon name="i-lucide-eye" class="w-3 h-3" />
          <span>{{ wallpaper.view_count || 0 }}</span>
        </div>
        <div v-if="wallpaper.category" class="flex items-center gap-1">
          <UIcon name="i-lucide-folder" class="w-3 h-3" />
          <span>{{ wallpaper.category }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PictureResponseInfo } from "~/api/generated/services/PicturesService";

interface Props {
  wallpaper: PictureResponseInfo;
  tags?: string[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  click: [wallpaper: PictureResponseInfo];
  download: [wallpaper: PictureResponseInfo];
  view: [wallpaper: PictureResponseInfo];
}>();

const { downloadPicture } = useWallpaper();
const downloading = ref(false);
const showPreview = ref(false);

const handleClick = () => {
  emit("click", props.wallpaper);
};

const handleDownload = async () => {
  if (!props.wallpaper.id) return;

  try {
    downloading.value = true;
    const response = await downloadPicture(props.wallpaper.id);

    // 如果响应包含下载 URL，则触发下载
    if (response && typeof response === "object" && "url" in response) {
      const downloadUrl = (response as { url?: string }).url;
      if (downloadUrl) {
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download =
          props.wallpaper.original_filename ||
          `wallpaper-${props.wallpaper.id}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else if (props.wallpaper.webp_url || props.wallpaper.thumbnail_url) {
      // 如果没有返回下载 URL，使用 webp_url 或 thumbnail_url
      const imageUrl =
        props.wallpaper.webp_url || props.wallpaper.thumbnail_url;
      if (imageUrl) {
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download =
          props.wallpaper.original_filename ||
          `wallpaper-${props.wallpaper.id}`;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }

    emit("download", props.wallpaper);
  } catch (err) {
    console.error("下载失败:", err);
    // 可以在这里显示错误提示
  } finally {
    downloading.value = false;
  }
};

const handleView = () => {
  showPreview.value = true;
  emit("view", props.wallpaper);
};
</script>
