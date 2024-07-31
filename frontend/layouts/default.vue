<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const className = computed(() => {
  const theme = authStore.account?.theme

  return theme ? `${theme}-theme` : ''
})

useHead({
  htmlAttrs: {
    class: className,
  },
})
</script>

<template>
  <div class="app">
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
  </div>
</template>

<style scoped>
.app {
  padding: 0.5rem 1rem;
  display: block;
}

header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;

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
</style>
