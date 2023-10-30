<script setup lang="ts">
import { computed } from 'vue'
import PostBody from '@/components/PostBody.vue'
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  reply: {
    type: Object,
    required: true,
  },
  dataTestid: String,
})

const userStore = useUserStore()

const author = computed(() => userStore.user(props.reply.author))

if (!author.value) userStore.fetchUser(props.reply.author)
</script>

<template>
  <div class="reply" :data-testid="dataTestid">
    <div v-if="author" class="author" data-testid="author">
      <UserAvatar :user="author" class="avatar" />
      <span class="username">{{ author.username }}</span>
    </div>
    <LoadingPlaceholder v-else />

    <PostBody :value="reply.body" class="body" data-testid="body" />
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
}
</style>
