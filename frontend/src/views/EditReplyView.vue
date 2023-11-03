<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue'
import ReplyForm from '@/components/ReplyForm.vue'
import { useThreadStore } from '@/stores/thread'

const route = useRoute()
const router = useRouter()
const threadStore = useThreadStore()

const postId = computed(() => +route.params.postId)
const replyId = computed(() => +route.params.replyId)

const { replyErrors } = storeToRefs(threadStore)

const post = computed(() => threadStore.thread(postId.value))
if (!post.value) threadStore.fetchThread(postId.value)

const reply = computed(() => threadStore.allReplies[replyId.value])
if (!reply.value) threadStore.fetchReplies(postId.value)

const updateReply = async ({ body }: any) => {
  const reply = await threadStore.updateReply({
    id: replyId.value,
    postId: postId.value,
    body,
  })
  if (!reply) return

  router.push({
    name: 'thread detail',
    params: { id: postId.value },
  })
}
</script>

<template>
  <div class="wrapper">
    <h1 v-if="post">Editing reply to {{ post.title }}</h1>
    <LoadingPlaceholder v-else />

    <ReplyForm
      v-if="reply"
      @submit="updateReply"
      :initial-value="reply"
      :post-id="reply.post"
      :errors="replyErrors"
    />
    <LoadingPlaceholder v-else />
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
