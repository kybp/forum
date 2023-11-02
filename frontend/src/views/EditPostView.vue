<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import PostForm from '@/components/PostForm.vue'
import { useThreadStore } from '@/stores/thread'

const route = useRoute()
const router = useRouter()
const threadStore = useThreadStore()

const postId = computed(() => +route.params.id)

const post = computed(() => threadStore.thread(postId.value))
if (!post.value) threadStore.fetchThread(postId.value)

const { postErrors } = storeToRefs(threadStore)

const updatePost = async ({ title, body, tags }: any) => {
  const thread = await threadStore.updatePost({
    id: postId.value,
    title,
    body,
    tags,
  })
  if (!thread) return

  router.push({
    name: 'thread detail',
    params: { id: postId.value },
  })
}
</script>

<template>
  <PostForm @submit="updatePost" :initial-value="post" :errors="postErrors" />
</template>
