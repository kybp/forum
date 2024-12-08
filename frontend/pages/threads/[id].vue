<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { usePostsStore } from '~/stores/posts'
import { useUsersStore } from '~/stores/users'

const authStore = useAuthStore()
const postsStore = usePostsStore()
const usersStore = useUsersStore()
const route = useRoute()

const postId = +route.params.id
let post = computed(() => postsStore.findPost(postId))
if (!post.value) await postsStore.getPost(postId)
await postsStore.getReplies(postId)

const title = ref<string | null>(null)

const { account } = storeToRefs(authStore)

const userIsAuthor = computed(() => {
  return account.value && account.value.id === post.value?.author
})

const author = computed(() => {
  return post.value ? usersStore.findUser(post.value.author) : null
})

watch(
  author,
  (value) => {
    if (post.value === null || post.value.author === null) return
    if (value === undefined) usersStore.getUser(post.value.author)
  },
  { immediate: true },
)

const createReply = async ({ postId, body, onSuccess, onError }: any) => {
  const { error } = await postsStore.createReply({ postId, body })

  if (error.value) onError(error.value)
  else onSuccess()
}

const deletePost = async () => {
  if (post.value === null) throw new Error('No post to delete')

  await postsStore.deletePost(post.value)
}
</script>

<template>
  <div class="header">
    <Title> {{ title ?? post?.title ?? 'Thread' }}</Title>
    <h1 class="title" data-testid="thread-detail-title">
      {{ title ?? post?.title ?? 'Viewing Thread' }}
    </h1>

    <CollapsibleMenu v-if="userIsAuthor" class="menu">
      <NuxtLink :to="`/threads/${postId}/edit`" class="button"> Edit </NuxtLink>
      <button @click="deletePost" class="button">Delete</button>
    </CollapsibleMenu>
  </div>

  <div class="author" v-if="author" data-testid="author">
    {{ author.username }}
  </div>

  <MarkdownPages
    v-if="post"
    :title="post.title"
    :value="post.body"
    @pageChange="title = $event.title"
  />

  <div class="extras">
    <ul v-if="post" class="tags" data-testid="tags">
      <li v-for="tag in post.tags" :key="tag">
        <PostTag :value="tag" />
      </li>
    </ul>

    <ReactionList class="reaction-list" v-if="post" :post="post" />
  </div>

  <ArticleDates v-if="post" :article="post" />

  <ReplyForm
    class="reply-form"
    v-if="authStore.isSignedIn"
    @submit="createReply"
    :post-id="postId"
  />

  <ReplyList v-if="post" :post-id="post.id" />
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
