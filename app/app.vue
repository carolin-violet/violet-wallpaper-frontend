<script setup lang="ts">
useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: 'zh-CN'
  }
})

const title = 'Violet Wallpaper - 紫罗兰壁纸美学'
const description = '发现并下载高质量壁纸，覆盖 PC、移动端与头像等多种类型。'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <UHeader class="border-b border-violet-200/60 dark:border-violet-900/60 bg-white/75 dark:bg-slate-950/80 backdrop-blur-xl">
      <template #left>
        <NuxtLink
          to="/"
          class="group flex items-center gap-2"
        >
          <UIcon
            name="i-lucide-flower-2"
            class="h-6 w-6 text-violet-500 transition-transform duration-300 group-hover:rotate-12"
          />
          <span class="text-lg font-semibold tracking-wide text-slate-800 dark:text-slate-100">Violet Wallpaper</span>
        </NuxtLink>

        <nav class="ml-8 hidden items-center gap-4 md:flex">
          <NuxtLink
            to="/"
            class="text-sm font-medium text-slate-600 transition-colors hover:text-violet-600 dark:text-slate-300 dark:hover:text-violet-300"
          >
            首页
          </NuxtLink>
        </nav>
      </template>

      <template #right>
        <ClientOnly>
          <UColorModeButton />
        </ClientOnly>
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <USeparator icon="i-lucide-sparkles" />

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          Violet Wallpaper · © {{ new Date().getFullYear() }}
        </p>
      </template>
    </UFooter>
  </UApp>
</template>
