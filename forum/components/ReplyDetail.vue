<script setup lang="ts">
import type { Reply } from '@/api'
import { useAuthStore } from '@/stores/auth'
import { usePostsStore } from '@/stores/posts'
import { useUsersStore } from '@/stores/users'

type Props = {
  reply: Reply
}

const props = defineProps<Props>()

const authStore = useAuthStore()
const postsStore = usePostsStore()
const usersStore = useUsersStore()

const { account } = storeToRefs(authStore)

const userIsAuthor = computed(
  () => account.value && account.value.id === props.reply.author,
)

const author = computed(() => usersStore.findUser(props.reply.author))

if (!author.value) usersStore.getUser(props.reply.author)

const deleteReply = () => postsStore.deleteReply(props.reply)

const editRoute = computed(() => ({
  name: 'edit-reply',
  params: { postId: props.reply.post, replyId: props.reply.id },
}))
</script>

<template>
  <div class="reply">
    <div v-if="author" class="author" data-testid="author">
      <img :src="author.avatar" class="avatar" />
      <span class="username">{{ author.username }}</span>
    </div>

    <MarkdownBody :value="reply.body" class="body" data-testid="body" />

    <ArticleDates :article="reply" />

    <div v-if="userIsAuthor" class="actions">
      <NuxtLink :to="editRoute" class="button">Edit</NuxtLink>

      <button v-if="userIsAuthor" @click="deleteReply" class="button">
        Delete
      </button>
    </div>
  </div>
</template>

<style scoped>
.reply {
  display: block;

  .author {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .body {
    display: block;
    margin-left: 1rem;
  }

  .actions {
    display: flex;
    gap: 0.5rem;
  }
}
</style>
