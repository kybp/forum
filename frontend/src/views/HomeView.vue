<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue'
import ThreadList from '@/components/ThreadList.vue'
import { useAuthStore } from '@/stores/auth'
import { useThreadStore } from '@/stores/thread'
import { computed } from 'vue'

const authStore = useAuthStore()
const threadStore = useThreadStore()

const { user } = storeToRefs(authStore)

threadStore.fetchThreadList()

const threads = computed(() => threadStore.threads)
const loading = computed(() => threadStore.loadingThreadList)
</script>

<template>
  <main>
    <div class="meta">
      <h1>Threads</h1>
      <RouterLink v-if="user" to="/post" class="button new-thread">
        New Thread
      </RouterLink>
    </div>
    <div class="thread-list">
      <LoadingPlaceholder v-if="loading" />
      <ThreadList v-else :threads="threads" />
    </div>
  </main>
</template>

<style scoped>
main {
  margin-top: 1rem;
  display: flex;
  gap: 2rem;
}

@media (--small-viewport) {
  main {
    flex-direction: column;
    gap: 0;
  }
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.button.new-thread {
  align-self: start;
}

.thread-list {
  padding-top: 0.6rem;
}
</style>
