<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import type { Ref } from 'vue'
import { ErrorMessage, Field, Form } from 'vee-validate'
import { storeToRefs } from 'pinia'
import * as yup from 'yup'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const schema = yup.object({
  username: yup.string().required(),
  password: yup.string().required(),
})

const form: Ref<any> = ref(null)

const { signInErrors } = storeToRefs(authStore)

watchEffect(() => {
  if (signInErrors.value) form.value?.setErrors(signInErrors.value)
})

const signIn = async ({ username, password }: any) => {
  await authStore.signIn({ username, password })
}
</script>

<template>
  <Form ref="form" @submit="signIn" :validation-schema="schema">
    <div class="fields">
      <div class="field">
        <Field name="username" v-slot="{ field, errors }">
          <input
            v-bind="field"
            type="text"
            placeholder="Username"
            :class="{ invalid: !!errors.length }"
          />
        </Field>
        <ErrorMessage name="username" />
      </div>

      <div class="field">
        <Field name="password" v-slot="{ field, errors }">
          <input
            v-bind="field"
            type="password"
            placeholder="Password"
            :class="{ invalid: !!errors.length }"
          />
        </Field>
        <ErrorMessage name="password" />
      </div>

      <ErrorMessage name="non_field_errors" />
    </div>

    <button type="submit" class="button">Sign in</button>
  </Form>
</template>

<style scoped>
form {
  display: flex;
  align-items: flex-start;
}

.fields {
  display: flex;
  margin-top: 0.3rem;
}

.field,
button[type='submit'] {
  margin-right: 0.5rem;
}
</style>
