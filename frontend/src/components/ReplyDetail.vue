<script setup lang="ts">
import { computed } from 'vue'
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
    <div v-if="author" data-testid="author">{{ author.username }}</div>
    <div v-else>Loading...</div>

    <div data-testid="body">{{ reply.body }}</div>
  </div>
</template>
