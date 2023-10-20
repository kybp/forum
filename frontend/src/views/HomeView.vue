<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const { user } = storeToRefs(authStore)
</script>

<template>
  <main>
    <RouterLink v-if="user" to="/post">New Thread</RouterLink>
  </main>
</template>
