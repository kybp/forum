<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue'
import ReplyForm from '@/components/ReplyForm.vue'
import ReplyList from '@/components/ReplyList.vue'
import { useAuthStore } from '@/stores/auth'
import { useThreadStore } from '@/stores/thread'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const authStore = useAuthStore()
const threadStore = useThreadStore()
const userStore = useUserStore()

const postId = +route.params.id

const thread = computed(() => threadStore.thread(postId))
if (!thread.value) threadStore.fetchThread(postId)

const author = computed(() => {
  return thread.value ? userStore.user(thread.value.author_id) : null
})

watchEffect(() => {
  if (thread.value && !author.value) userStore.fetchUser(thread.value.author_id)
})
</script>
<template>
  <h1 v-if="thread" data-testid="title">{{ thread.title }}</h1>
  <LoadingPlaceholder v-else />

  <div v-if="author" data-testid="author">{{ author.username }}</div>
  <LoadingPlaceholder v-else />

  <div v-if="thread" data-testid="body">{{ thread.body }}</div>
  <LoadingPlaceholder v-else />

  <ReplyForm v-if="authStore.isSignedIn" :post-id="postId" />

  <ReplyList v-if="thread" :post-id="thread.id" />
</template>
