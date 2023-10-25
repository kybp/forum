<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'
import SignInForm from '@/components/SignInForm.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const signOut = () => authStore.signOut()
</script>

<template>
  <div class="wrapper">
    <button v-if="user" @click="signOut" class="button">Sign out</button>
    <div v-else class="forms">
      <SignInForm />
      <RouterLink to="/register" class="button">Register</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.wrapper,
.forms {
  display: flex;
  height: 3rem;
  align-items: flex-start;
}
</style>
