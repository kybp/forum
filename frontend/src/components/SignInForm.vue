<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const username = ref('')
const password = ref('')

const authStore = useAuthStore()

const signIn = () =>
  authStore.signIn({
    username: username.value,
    password: password.value,
  })
</script>

<template>
  <form @submit.prevent>
    <input type="text" placeholder="Username" required v-model="username" />
    <input type="password" placeholder="Password" required v-model="password" />
    <button type="submit" @click="signIn">Sign in</button>
  </form>
</template>
