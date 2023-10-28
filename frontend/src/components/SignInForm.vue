<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue'
import type { Ref } from 'vue'
import { useRoute } from 'vue-router'
import { ErrorMessage, Field, Form } from 'vee-validate'
import { storeToRefs } from 'pinia'
import * as yup from 'yup'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const route = useRoute()

const schema = yup.object({
  username: yup.string().required(),
  password: yup.string().required(),
})

const form: Ref<any> = ref(null)

const { signInErrors } = storeToRefs(authStore)

watchEffect(() => {
  if (signInErrors.value) form.value?.setErrors(signInErrors.value)
})

watch(
  () => route.path,
  () => {
    if (form.value) form.value.resetForm({ values: form.value.getValues() })
  },
)

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

    <div class="actions">
      <button type="submit" class="button">Sign in</button>
      <RouterLink to="/register" class="button">Register</RouterLink>
    </div>
  </Form>
</template>

<style scoped>
form {
  display: flex;
  align-items: flex-start;
  height: 3rem;
}

.fields {
  display: flex;
  margin-top: 0.3rem;
}

.fields + .actions {
  margin-left: 0.5rem;
}

.field + .field,
button[type='submit'] + * {
  margin-left: 0.5rem;
}

@media (--small-viewport) {
  form {
    display: grid;
    margin-bottom: 3rem;
  }

  .fields {
    grid-row-start: 1;
    margin-bottom: 0.5rem;
  }

  .field {
    max-width: 9rem;
    margin-right: 0;
  }

  .actions {
    grid-row-start: 2;
    display: flex;
    justify-content: end;
  }
}
</style>
