<script setup lang="ts">
import { usePostsStore } from '~/stores/posts'

definePageMeta({
  middleware: 'check-signed-in',
  name: 'edit-reply',
})

const route = useRoute()
const postsStore = usePostsStore()

const postId = +route.params.postId
const replyId = +route.params.replyId

const post = computed(() => postsStore.findPost(postId))
if (!post.value) postsStore.getPost(postId)

const reply = computed(() => postsStore.findReply(replyId))
if (!reply.value) postsStore.getReplies(postId)

const updateReply = async ({ body, onSuccess, onError }: any) => {
  const { data: reply, error } = await postsStore.updateReply({
    id: replyId,
    postId,
    body,
  })

  if (error.value) onError(error.value)
  else onSuccess()

  if (!reply.value) return

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
