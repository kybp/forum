<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue'
import ThreadList from '@/components/ThreadList.vue'
import { useAuthStore } from '@/stores/auth'
import { useThreadStore } from '@/stores/thread'
import { computed } from 'vue'

const authStore = useAuthStore()
const threadStore = useThreadStore()

const { user } = storeToRefs(authStore)

threadStore.fetchThreadList()

const threads = computed(() => threadStore.threads)
const loading = computed(() => threadStore.loadingThreadList)
</script>

<template>
  <main>
    <RouterLink v-if="user" to="/post">New Thread</RouterLink>
    <LoadingPlaceholder v-if="loading" />
    <ThreadList v-else :threads="threads" />
  </main>
</template>
