<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const username = ref('')
const email = ref('')
const password = ref('')

const register = () =>
  authStore.register({
    username: username.value,
    email: email.value,
    password: password.value,
  })
</script>

<template>
  <h1>Register</h1>

  <form @submit.prevent>
    <input type="text" placeholder="Username" required v-model="username" />
    <input type="email" placeholder="Email" required v-model="email" />
    <input type="password" placeholder="Password" required v-model="password" />
    <button type="submit" @click="register">Register</button>
  </form>
</template>
