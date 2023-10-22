<script setup lang="ts">
import { ref } from 'vue'
import { useThreadStore } from '@/stores/thread'

const props = defineProps({
  postId: {
    type: Number,
    required: true,
  },
})

const threadStore = useThreadStore()

const body = ref('')

const reply = async () => {
  await threadStore.reply({
    postId: props.postId,
    body: body.value,
  })

  body.value = ''
}
</script>
<template>
  <form @submit.prevent="reply">
    <textarea v-model="body" placeholder="Reply"></textarea>
    <button type="submit">Submit</button>
  </form>
</template>
