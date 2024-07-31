<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const { account } = storeToRefs(authStore)

const signOut = () => authStore.signOut()
</script>

<template>
  <div class="wrapper">
    <NuxtLink v-if="account" to="/account" data-testid="account-link">
      {{ account.username }}
    </NuxtLink>
    <button v-if="account" @click="signOut" class="button">Sign out</button>
    <div v-else class="forms">
      <SignInForm />
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: inline-flex;
  gap: 0.5rem;

  button {
    align-self: start;
  }
}
</style>
