<script setup lang="ts">
import { computed } from 'vue'
import ReplyDetail from '@/components/ReplyDetail.vue'
import { useThreadStore } from '@/stores/thread'

const props = defineProps({
  postId: {
    type: Number,
    required: true,
  },
})

const threadStore = useThreadStore()

threadStore.fetchReplies(props.postId)

const replies = computed(() => threadStore.replies(props.postId))
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
  margin-top: 1rem;
}
</style>
