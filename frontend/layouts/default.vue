<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const className = computed(() => {
  const theme = authStore.account?.theme

  return theme ? `${theme}-theme` : ''
})

useHead({
  htmlAttrs: {
    class: className
  }
})
</script>

<template>
  <header>
    <nav>
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/formatting">Formatting</NuxtLink>
    </nav>
    <UserControls />
  </header>

  <div>
    <slot />
  </div>
</template>
