<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useThreadStore } from '@/stores/thread'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const threadStore = useThreadStore()
const userStore = useUserStore()

const threadId = +route.params.id

const thread = computed(() => threadStore.thread(threadId))
if (!thread.value) threadStore.fetchThread(threadId)

const user = computed(() => {
  return thread.value ? userStore.user(thread.value.author_id) : null
})

watchEffect(() => {
  if (thread.value && !user.value) userStore.fetchUser(thread.value.author_id)
})
</script>
<template>
  <h1 v-if="thread" data-testid="title">{{ thread.title }}</h1>
  <div v-else>Loading...</div>

  <div v-if="user" data-testid="author">{{ user.username }}</div>
  <div v-else>Loading...</div>

  <div v-if="thread" data-testid="body">{{ thread.body }}</div>
  <div v-else>Loading...</div>
</template>
