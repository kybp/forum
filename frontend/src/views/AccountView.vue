<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const isOpen = ref(false)
const password = ref('')
const error = ref<string | null>(null)

const deleteAccount = async () => {
  if (!authStore.account) throw new Error('Not signed in')

  await authStore.signIn({
    username: authStore.account.username,
    password: password.value,
  })

  if (authStore.signInErrors) {
    error.value = authStore.signInErrors.non_field_errors[0]
  } else {
    authStore.deleteAccount()
  }
}
</script>

<template>
  <div class="wrapper">
    <button
      @click="isOpen = true"
      :disabled="isOpen"
      class="button open-confirm"
    >
      Delete Account
    </button>
    <div v-if="isOpen" class="confirm-delete">
      <input v-model="password" type="password" placeholder="Password" />
      <span v-if="error" role="alert">{{ error }}</span>
      <button class="confirm button" @click="deleteAccount">
        Delete Forever
      </button>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  max-width: 50vw;
}

.open-confirm.button {
  align-self: start;
  margin-right: 0.5rem;
}

.confirm-delete {
  display: flex;
  flex-direction: column;

  .confirm.button {
    margin-top: 0.2rem;
  }
}
</style>
