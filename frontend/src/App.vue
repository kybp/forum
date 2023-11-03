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
      <RouterLink to="/formatting">Formatting</RouterLink>
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

  @media (--small-viewport) {
    justify-content: space-between;
    margin-bottom: 5rem;
  }
}

nav {
  display: flex;
  gap: 0.5rem;

  @media (--small-viewport) {
    flex-direction: column;
  }
}

nav a {
  color: var(--color-text);

  &.router-link-exact-active {
    color: var(--f-blue-5);
  }
}
</style>
