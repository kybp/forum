<script setup lang="ts">
import { usePostsStore } from '~/stores/posts'

definePageMeta({
  middleware: 'check-signed-in',
})

const postsStore = usePostsStore()

const createPost = async ({ title, body, tags, onSuccess, onError }: any) => {
  const { data, error } = await postsStore.createPost({ title, body, tags })

  if (error.value) onError(error.value)
  else onSuccess()

  if (data.value === null) return

  navigateTo({
    name: 'threads-id',
    params: { id: data.value.id },
  })
}
</script>
<template>
  <h1>New Thread</h1>
  <PostForm @submit="createPost" />
</template>
