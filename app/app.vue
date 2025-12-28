<script setup>
useHead({
  meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }],
  link: [{ rel: "icon", href: "/favicon.ico" }],
  htmlAttrs: {
    lang: "zh-CN",
  },
});

const title = "Violet Wallpaper - 精美壁纸分享";
const description =
  "发现和下载精美的高质量壁纸，涵盖PC端、移动端和头像等多种类型。";

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterCard: "summary_large_image",
});
</script>

<template>
  <UApp>
    <UHeader>
      <template #left>
        <NuxtLink to="/" class="flex items-center gap-2">
          <UIcon name="i-lucide-image" class="w-6 h-6 text-primary" />
          <span class="font-bold text-lg">Violet Wallpaper</span>
        </NuxtLink>

        <nav class="hidden md:flex items-center gap-4 ml-8">
          <NuxtLink
            to="/"
            class="text-sm font-medium hover:text-primary transition-colors"
          >
            首页
          </NuxtLink>
        </nav>
      </template>

      <template #right>
        <UColorModeButton />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <USeparator icon="i-simple-icons-nuxtdotjs" />

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          Violet Wallpaper • © {{ new Date().getFullYear() }}
        </p>
      </template>
    </UFooter>
  </UApp>
</template>
