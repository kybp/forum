<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'

import ArticleDates from '@/components/ArticleDates.vue'
import CollapsibleMenu from '@/components/CollapsibleMenu.vue'
import MarkdownBody from '@/components/MarkdownBody.vue'
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
    <h1 class="title" v-if="thread" data-testid="thread-detail-title">
      {{ thread.title }}
    </h1>
    <LoadingPlaceholder v-else />

    <CollapsibleMenu v-if="userIsAuthor" class="menu">
      <RouterLink
        :to="{ name: 'edit post', params: { id: postId } }"
        class="button"
      >
        Edit
      </RouterLink>
      <button @click="deletePost" class="button">Delete</button>
    </CollapsibleMenu>
  </div>

  <div class="author" v-if="author" data-testid="author">
    {{ author.username }}
  </div>
  <LoadingPlaceholder v-else />

  <MarkdownBody
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

  <ArticleDates v-if="thread" :article="thread" />

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
  justify-content: space-between;
  align-items: center;

  @media (--small-viewport) {
    margin-top: 0;
  }
}

.menu .button {
  margin-left: 0.5rem;

  @media (--small-viewport) {
    margin-left: 0;
  }
}

.title {
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
