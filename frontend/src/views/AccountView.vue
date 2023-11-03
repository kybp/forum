<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const { themes } = storeToRefs(authStore)

authStore.fetchThemes()

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

const updateTheme = ({ target: { value } }: any) => {
  authStore.updateAccount({ theme: value })
}
</script>

<template>
  <h1>Account Settings</h1>

  <div class="theme-select">
    <label for="theme">Theme</label>
    <select
      name="theme"
      :value="authStore.account?.theme"
      @change="updateTheme"
    >
      <option v-for="theme in themes" :key="theme">{{ theme }}</option>
    </select>
  </div>

  <div class="delete-wrapper">
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
.delete-wrapper {
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
