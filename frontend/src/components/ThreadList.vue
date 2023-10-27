<script setup lang="ts">
import { RouterLink } from 'vue-router'
import PostTag from '@/components/PostTag.vue'
import type { Thread } from '@/stores/thread'

type Props = {
  threads: Thread[]
}

defineProps<Props>()
</script>
<template>
  <div v-if="threads.length === 0">Nothing yet! Try posting a thread.</div>
  <ul v-else class="thread-list">
    <li v-for="thread in threads" :key="thread.id" data-testid="thread">
      <RouterLink :to="`threads/${thread.id}`">
        {{ thread.title }}
      </RouterLink>

      <div class="tags" data-testid="tags">
        <PostTag
          v-for="tag in thread.tags"
          :key="`${thread.id}-${tag}`"
          :value="tag"
        />
      </div>
    </li>
  </ul>
</template>

<style scoped>
ul {
  padding: 0;
}

li {
  margin: 0;
  list-style: none;
  display: flex;
  flex-direction: row;
  align-items: center;
}

li + li {
  margin-top: 0.5rem;
}

.tags {
  display: flex;
  flex-direction: row;
}
</style>
