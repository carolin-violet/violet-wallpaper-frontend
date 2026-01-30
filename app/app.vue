<script setup lang="ts">
import { ConfigProvider } from 'reka-ui'

useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: 'zh-CN'
  }
})

const title = 'Violet Wallpaper - 精美壁纸分享'
const description
  = '发现和下载精美的高质量壁纸，涵盖PC端、移动端和头像等多种类型。'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterCard: 'summary_large_image'
})

// Reka UI SSR 水合：注入 Nuxt 的 useId，避免服务端/客户端 id 不一致导致的水合错误
// 见 https://reka-ui.com/docs/utilities/config-provider#hydration-issue-vue-3-5
const useIdForReka = () => useId()
</script>

<template>
  <ConfigProvider :use-id="useIdForReka">
    <UApp>
    <UHeader>
      <template #left>
        <NuxtLink
          to="/"
          class="flex items-center gap-2"
        >
          <UIcon
            name="i-lucide-image"
            class="w-6 h-6 text-primary"
          />
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
        <ClientOnly>
          <UColorModeButton />
        </ClientOnly>
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
  </ConfigProvider>
</template>
