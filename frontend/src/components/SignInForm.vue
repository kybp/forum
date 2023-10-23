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
    <Field name="username" type="text" placeholder="Username" />
    <ErrorMessage name="username" />

    <Field name="password" type="password" placeholder="Password" />
    <ErrorMessage name="password" />

    <button type="submit">Sign in</button>

    <ErrorMessage name="non_field_errors" />
  </Form>
</template>
