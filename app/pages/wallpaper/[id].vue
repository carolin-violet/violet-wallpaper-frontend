<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center min-h-[60vh]">
      <UIcon
        name="i-lucide-loader-2"
        class="w-8 h-8 animate-spin text-primary"
      />
    </div>

    <!-- 错误状态 -->
    <UAlert v-else-if="error" color="red" variant="soft" :title="error" />

    <!-- 壁纸详情 -->
    <div v-else-if="wallpaper" class="max-w-6xl mx-auto">
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
              v-if="wallpaper.webp_url"
              :src="wallpaper.webp_url"
              :alt="wallpaper.original_filename || '壁纸'"
              class="w-full h-auto"
              loading="lazy"
            />
            <div
              v-else
              class="aspect-video flex items-center justify-center bg-gray-200 dark:bg-gray-700"
            >
              <UIcon name="i-lucide-image" class="w-16 h-16 text-gray-400" />
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="mt-4 flex gap-4">
            <UButton icon="i-lucide-download" size="lg" @click="handleDownload">
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
              <h2 class="text-xl font-semibold">壁纸信息</h2>
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

              <div v-if="wallpaper.category">
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  分类
                </p>
                <UBadge color="primary" variant="soft">
                  {{ wallpaper.category }}
                </UBadge>
              </div>

              <div v-if="wallpaper.device_type">
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  设备类型
                </p>
                <UBadge color="gray" variant="soft">
                  {{ getDeviceTypeName(wallpaper.device_type) }}
                </UBadge>
              </div>

              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  预览次数
                </p>
                <p class="font-medium flex items-center gap-1">
                  <UIcon name="i-lucide-eye" class="w-4 h-4" />
                  {{ wallpaper.view_count || 0 }}
                </p>
              </div>
            </div>
          </UCard>

          <!-- 标签 -->
          <UCard v-if="tags && tags.length > 0">
            <template #header>
              <h2 class="text-xl font-semibold">标签</h2>
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
import type { PictureResponseInfo } from "~/api/generated/services/PicturesService";

const route = useRoute();
const router = useRouter();
const { getWallpapers, downloadPicture, incrementView, loading, error } =
  useWallpaper();

const wallpaper = ref<PictureResponseInfo | null>(null);
const tags = ref<string[]>([]);

// 获取设备类型名称
const getDeviceTypeName = (type: number | null) => {
  const map: Record<number, string> = {
    1: "PC端",
    2: "移动端",
    3: "头像",
  };
  return type ? map[type] || "未知" : "未知";
};

// 加载壁纸详情
const loadWallpaper = async () => {
  const id = Number(route.params.id);
  if (!id) {
    error.value = "无效的壁纸ID";
    return;
  }

  try {
    // 通过列表接口查找指定ID的壁纸
    // 注意：如果后端有单独的详情接口，应该使用详情接口
    const response = await getWallpapers({
      pageNum: 1,
      pageSize: 100,
    });

    if (response && response.records) {
      const found = response.records.find((w) => w.id === id);
      if (found) {
        wallpaper.value = found;
        // 增加预览次数
        await incrementView(id);
      } else {
        error.value = "壁纸不存在";
      }
    }
  } catch (err) {
    console.error("加载壁纸详情失败:", err);
  }
};

// 下载
const handleDownload = async () => {
  if (!wallpaper.value) return;

  try {
    await downloadPicture(wallpaper.value.id);
    // 这里可以添加实际的下载逻辑
    console.log("下载壁纸:", wallpaper.value.id);
  } catch (err) {
    console.error("下载失败:", err);
  }
};

// 分享
const handleShare = () => {
  if (navigator.share && wallpaper.value) {
    navigator.share({
      title: wallpaper.value.original_filename || "壁纸",
      url: window.location.href,
    });
  } else {
    // 复制链接到剪贴板
    navigator.clipboard.writeText(window.location.href);
    // 这里可以显示一个提示
  }
};

// 按标签搜索
const searchByTag = (tag: string) => {
  router.push({
    path: "/",
    query: { tag },
  });
};

// 返回
const goBack = () => {
  router.back();
};

// 初始化
onMounted(() => {
  loadWallpaper();
});

// 监听路由变化
watch(
  () => route.params.id,
  () => {
    loadWallpaper();
  }
);
</script>
