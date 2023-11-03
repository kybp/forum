<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'

import PostBody from '@/components/PostBody.vue'
import PostTag from '@/components/PostTag.vue'
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue'
import ReactionList from '@/components/ReactionList.vue'
import ReplyForm from '@/components/ReplyForm.vue'
import ReplyList from '@/components/ReplyList.vue'
import { useAuthStore } from '@/stores/auth'
import { useThreadStore } from '@/stores/thread'
import { useUserStore } from '@/stores/user'
import { formatDate } from '@/utils'

const route = useRoute()
const authStore = useAuthStore()
const threadStore = useThreadStore()
const userStore = useUserStore()

const { account } = storeToRefs(authStore)

const postId = +route.params.id

const thread = computed(() => threadStore.thread(postId))
if (!thread.value) threadStore.fetchThread(postId)

const userIsAuthor = computed(() => {
  return account.value && account.value.id === thread.value?.author
})

const deletePost = () => {
  if (thread.value) threadStore.deletePost(thread.value)
}

const author = computed(() => {
  return thread.value ? userStore.user(thread.value.author) : null
})

watchEffect(() => {
  if (thread.value?.author && !author.value) {
    userStore.fetchUser(thread.value.author)
  }
})

const createReply = async ({ postId, body, onSuccess }: any) => {
  if (await threadStore.createReply({ postId, body })) {
    onSuccess()
  }
}
</script>
<template>
  <div class="header">
    <h1 class="title" v-if="thread" data-testid="title">{{ thread.title }}</h1>
    <LoadingPlaceholder v-else />

    <RouterLink
      v-if="userIsAuthor"
      :to="{ name: 'edit post', params: { id: postId } }"
      class="button"
    >
      Edit
    </RouterLink>
    <button v-if="userIsAuthor" @click="deletePost" class="button">
      Delete
    </button>
  </div>

  <div class="author" v-if="author" data-testid="author">
    {{ author.username }}
  </div>
  <LoadingPlaceholder v-else />

  <div v-if="thread?.date_edited" class="edited note" data-testid="edited">
    Updated {{ formatDate(thread.date_edited) }}
  </div>

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

  <ReplyForm
    class="reply-form"
    v-if="authStore.isSignedIn"
    @submit="createReply"
    :post-id="postId"
  />

  <ReplyList v-if="thread" :post-id="thread.id" />
</template>

<style scoped>
.header {
  display: flex;

  .button {
    margin-left: 1rem;
    align-self: center;
  }
}

.title {
  line-height: normal;
  display: inline-block;
}

.author {
  font-size: 0.75rem;
  padding-left: 2rem;

  &::before {
    content: 'by ';
  }
}

.edited {
  margin-left: 0.2rem;
}

.body {
  display: block;
  margin: 1.5rem 0;
  padding-left: 1rem;
}

.tags {
  display: flex;
  width: 100%;
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
