<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import UserControls from '@/components/UserControls.vue'
import { useAuthStore } from '@/stores/auth'
import { useThreadStore } from '@/stores/thread'

const authStore = useAuthStore()
const threadStore = useThreadStore()

authStore.$subscribe(async () => {
  threadStore.allThreads = {}
  await threadStore.fetchThreadFilters()
  await threadStore.fetchThreadList()
})
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
    </nav>
    <UserControls />
  </header>

  <RouterView />
</template>

<style scoped>
header {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}
</style>
