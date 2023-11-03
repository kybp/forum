<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'
import SignInForm from '@/components/SignInForm.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const { account } = storeToRefs(authStore)

const signOut = () => authStore.signOut()
</script>

<template>
  <div class="wrapper">
    <RouterLink v-if="account" to="/account" data-testid="account-link">
      {{ account.username }}
    </RouterLink>
    <button v-if="account" @click="signOut" class="button">Sign out</button>
    <div v-else class="forms">
      <SignInForm />
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  gap: 0.5rem;
}
</style>
