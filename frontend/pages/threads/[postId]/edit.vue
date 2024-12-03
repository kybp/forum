<script setup lang="ts">
import { usePostsStore } from '~/stores/posts'

definePageMeta({
  middleware: 'check-signed-in',
})

const route = useRoute()
const postsStore = usePostsStore()

const postId = computed(() => +route.params.postId)

const post = computed(() => postsStore.findPost(postId.value))
if (!post.value) postsStore.getPost(postId.value)

const updatePost = async ({ title, body, tags, onSuccess, onError }: any) => {
  const { data: post, error } = await postsStore.updatePost({
    id: postId.value,
    title,
    body,
    tags,
  })

  if (error.value) onError(error.value)
  else onSuccess()

  if (!post.value) return

  navigateTo({
    name: 'threads-id',
    params: { id: postId.value },
  })
}
</script>

<template>
  <Title>Editing Thread</Title>
  <h1>Editing Thread</h1>
  <PostForm @submit="updatePost" :initial-value="post" />
</template>
