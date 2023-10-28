<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

import PostBody from '@/components/PostBody.vue'
import PostTag from '@/components/PostTag.vue'
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue'
import ReactionList from '@/components/ReactionList.vue'
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
  return thread.value ? userStore.user(thread.value.author) : null
})

watchEffect(() => {
  if (thread.value && !author.value) userStore.fetchUser(thread.value.author)
})
</script>
<template>
  <h1 class="title" v-if="thread" data-testid="title">{{ thread.title }}</h1>
  <LoadingPlaceholder v-else />

  <div class="author" v-if="author" data-testid="author">
    {{ author.username }}
  </div>
  <LoadingPlaceholder v-else />

  <PostBody
    v-if="thread"
    :value="thread.body"
    class="body"
    data-testid="body"
  />
  <LoadingPlaceholder v-else />

  <div class="extras">
    <ul v-if="thread" class="tags" data-testid="tags">
      <li v-for="tag in thread.tags" :key="tag">
        <PostTag :value="tag" />
      </li>
    </ul>

    <ReactionList class="reaction-list" v-if="thread" :thread="thread" />
  </div>

  <ReplyForm class="reply-form" v-if="authStore.isSignedIn" :post-id="postId" />

  <ReplyList v-if="thread" :post-id="thread.id" />
</template>

<style scoped>
.title {
  line-height: normal;
}

.author {
  font-size: 0.75rem;
  padding-left: 2rem;
}

.author::before {
  content: 'by ';
}

.body {
  display: block;
  margin: 1rem 0;
  padding-left: 1rem;
}

.tags {
  display: flex;
  width: 100%;
}

ul.tags {
  margin-bottom: 0.5rem;
}

.extras {
  display: flex;
  width: 60vw;
  align-items: center;
  margin-bottom: 1rem;
}

.reaction-list {
  margin-left: 2rem;
}

.reply-form {
  margin-bottom: 1rem;
}
</style>
