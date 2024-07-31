<script setup lang="ts">
import type { Thread } from '~/types'

type Props = {
  threads: Thread[] | null
}

defineProps<Props>()
</script>
<template>
  <div v-if="(threads?.length ?? 0) === 0">
    Nothing yet! Try posting a thread.
  </div>
  <ul v-else class="thread-list">
    <li v-for="thread in threads" :key="thread.id" data-testid="thread">
      <NuxtLink :to="`/threads/${thread.id}`">
        {{ thread.title }}
      </NuxtLink>

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
li {
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
