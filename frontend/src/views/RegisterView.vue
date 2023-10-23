<script setup lang="ts">
import { ErrorMessage, Form, Field } from 'vee-validate'
import { ref, watchEffect } from 'vue'
import type { Ref } from 'vue'
import { storeToRefs } from 'pinia'
import * as yup from 'yup'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const schema = yup.object({
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
})

const form: Ref<any> = ref(null)

const { registerErrors } = storeToRefs(authStore)

watchEffect(() => {
  if (registerErrors.value) form.value?.setErrors(registerErrors.value)
})

const register = async ({ username, email, password }: any) => {
  await authStore.clearRegisterErrors()
  form.value?.validate()
  await authStore.register({ username, email, password })
}
</script>

<template>
  <h1>Register</h1>

  <Form ref="form" @submit="register" :validation-schema="schema">
    <Field name="username" type="text" placeholder="Username" />
    <ErrorMessage name="username" />

    <Field name="email" type="email" placeholder="Email" />
    <ErrorMessage name="email" />

    <Field name="password" type="password" placeholder="Password" />
    <ErrorMessage name="password" />

    <button type="submit">Register</button>
  </Form>
</template>
