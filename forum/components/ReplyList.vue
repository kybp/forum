<script setup lang="ts">
import { usePostsStore } from '@/stores/posts'

type Props = {
  postId: number
}

const props = defineProps<Props>()

const postsStore = usePostsStore()

if (!postsStore.findRepliesByPost(props.postId)) {
  await postsStore.getReplies(props.postId)
}

const replies = computed(() => postsStore.findRepliesByPost(props.postId))
</script>

<template>
  <ReplyDetail
    v-for="(reply, i) in replies"
    :key="`reply-${i}`"
    :data-testid="`reply-${i}`"
    :reply="reply"
    class="reply"
  />
</template>

<style scoped>
.reply + .reply {
  margin-top: 2rem;
}
</style>
