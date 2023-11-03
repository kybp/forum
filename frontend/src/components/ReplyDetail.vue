<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import ArticleDates from '@/components/ArticleDates.vue'
import PostBody from '@/components/PostBody.vue'
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue'
import { useAuthStore } from '@/stores/auth'
import { useThreadStore, type Reply } from '@/stores/thread'
import { useUserStore } from '@/stores/user'

type Props = {
  reply: Reply
}

const props = defineProps<Props>()

const authStore = useAuthStore()
const threadStore = useThreadStore()
const userStore = useUserStore()

const { account } = storeToRefs(authStore)

const userIsAuthor = computed(
  () => account.value && account.value.id === props.reply.author,
)

const author = computed(() => userStore.user(props.reply.author))

if (!author.value) userStore.fetchUser(props.reply.author)

const deleteReply = () => threadStore.deleteReply(props.reply)

const editRoute = computed(() => ({
  name: 'edit reply',
  params: { postId: props.reply.post, replyId: props.reply.id },
}))
</script>

<template>
  <div class="reply">
    <div v-if="author" class="author" data-testid="author">
      <img :src="author.avatar" class="avatar" />
      <span class="username">{{ author.username }}</span>
    </div>
    <LoadingPlaceholder v-else />

    <PostBody :value="reply.body" class="body" data-testid="body" />

    <ArticleDates :article="reply" />

    <div v-if="userIsAuthor" class="actions">
      <RouterLink :to="editRoute" class="button">Edit</RouterLink>

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
