<script setup lang="ts">
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import PostForm from '@/components/PostForm.vue'
import { useThreadStore } from '@/stores/thread'

const router = useRouter()
const threadStore = useThreadStore()

const { postErrors } = storeToRefs(threadStore)

const postThread = async ({ title, body }: any) => {
  const thread = await threadStore.post({ title, body })
  if (!thread) return

  router.push({
    name: 'thread detail',
    params: { id: thread.id },
  })
}
</script>
<template>
  <PostForm @submit="postThread" :errors="postErrors" />
</template>
