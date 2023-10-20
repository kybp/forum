<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useThreadStore } from '@/stores/thread'

const router = useRouter()
const threadStore = useThreadStore()

const title = ref('')
const body = ref('')

const postThread = async () => {
  const thread = await threadStore.post({
    title: title.value,
    body: body.value,
  })

  router.push({
    name: 'thread detail',
    params: { id: thread.id },
  })
}
</script>
<template>
  <form @submit.prevent="postThread">
    <h2>New Thread</h2>
    <input type="text" placeholder="Title" v-model="title" />
    <input type="text" placeholder="Body" v-model="body" />
    <button type="submit">Submit</button>
  </form>
</template>
