<script setup lang="ts">
import { useThreadsStore } from '@/stores/threads'

definePageMeta({
  name: 'edit-reply'
})

const route = useRoute()
const postsStore = useThreadsStore()

const postId =  +route.params.postId
const replyId = +route.params.replyId

const post = computed(() => postsStore.findPost(postId))
if (!post.value) postsStore.getPost(postId)

const reply = computed(() => postsStore.findReply(replyId))
if (!reply.value) postsStore.getReplies(postId)

const errors = ref<any>(null)

const updateReply = async ({ body }: any) => {
  const { data: reply, error } = await postsStore.updateReply({
    id: replyId,
    postId: postId,
    body,
    })
    errors.value = error
  if (!reply) return

  navigateTo({
    name: 'threads-id',
    params: { id: postId },
  })
}
</script>

<template>
  <div class="wrapper">
    <h1 v-if="post">Editing reply to {{ post.title }}</h1>

    <ReplyForm
      v-if="reply"
      @submit="updateReply"
      :initial-value="reply"
      :post-id="reply.post"
      :errors="errors"
    />
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
