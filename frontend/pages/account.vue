<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

definePageMeta({
  middleware: 'check-signed-in',
})

const authStore = useAuthStore()

const { themes } = storeToRefs(authStore)

authStore.fetchThemes()

const isOpen = ref(false)
const password = ref('')
const error = ref<string | null>(null)

const deleteAccount = async () => {
  if (!authStore.account) throw new Error('Not signed in')

  const response = await authStore.signIn({
    username: authStore.account.username,
    password: password.value,
  })

  if (response.error.value) {
    error.value = response.error.value.data.non_field_errors[0]
  } else {
    authStore.deleteAccount()
  }
}

const updateTheme = ({ target: { value } }: any) => {
  authStore.updateAccount({ theme: value })
}
</script>

<template>
  <div class="wrapper">
    <Title>Account</Title>
    <h1>Account</h1>

    <div class="controls">
      <div class="theme-select">
        <label for="theme">Theme:</label>
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
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  gap: 2rem;

  @media (--small-viewport) {
    flex-direction: column;
    gap: 0;
  }

  h1 {
    display: inline-block;
  }

  .controls {
    margin-top: 1.2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    @media (--small-viewport) {
      margin-top: 0;
    }

    label + select {
      margin-left: 0.5rem;
    }

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
  }
}
</style>
