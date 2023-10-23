<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Thread } from '@/stores/thread'

type Props = {
  threads: Thread[]
}

defineProps<Props>()
</script>
<template>
  <div v-if="threads.length === 0">Nothing yet! Try posting a thread.</div>
  <ul v-else class="thread-list">
    <li v-for="thread in threads" :key="thread.id">
      <RouterLink :to="`threads/${thread.id}`">
        {{ thread.title }}
      </RouterLink>
    </li>
  </ul>
</template>
