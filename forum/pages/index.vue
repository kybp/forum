<script setup lang="ts">
import ThreadList from '@/components/ThreadList.vue'
import { usePostsStore } from '@/stores/posts'

const postsStore = usePostsStore()

const { postList } = storeToRefs(postsStore)

await postsStore.getPostList()
</script>

<template>
  <main>
    <div class="meta">
      <h1>Threads</h1>
    </div>
    <div class="thread-list">
      <ThreadList :threads="postList" />
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  gap: 2rem;

  @media (--small-viewport) {
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
  padding-top: 0.5rem;
}
</style>
