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
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password'), undefined], 'passwords must match'),
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

  <div class="wrapper" data-testid="registration-form">
    <Form
      ref="form"
      class="form"
      @submit="register"
      :validation-schema="schema"
      v-slot="{ errors, meta }"
    >
      <label for="username">Username</label>
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

      <label for="email">Email</label>
      <div class="field">
        <Field name="email" v-slot="{ field, errors }">
          <input
            v-bind="field"
            type="email"
            placeholder="Email"
            :class="{ invalid: !!errors.length }"
          />
        </Field>
        <ErrorMessage name="email" />
      </div>

      <label for="password">Password</label>
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

      <label for="passwordConfirmation">Password (again)</label>
      <div class="field">
        <Field name="passwordConfirmation" v-slot="{ field, errors }">
          <input
            v-bind="field"
            type="password"
            placeholder="Password"
            :class="{ invalid: !!errors.length }"
          />
        </Field>
        <ErrorMessage name="passwordConfirmation" />
      </div>

      <div class="actions">
        <button
          type="submit"
          class="button"
          :disabled="meta.touched && !!Object.keys(errors).length"
        >
          Register
        </button>
      </div>
    </Form>
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.form {
  width: 30vw;
  display: grid;
  align-items: center;
}

@media (--large-viewport) {
  .form {
    width: 40vw;
  }
}

@media (--medium-viewport) {
  .form {
    width: 60vw;
  }
}

@media (--small-viewport) {
  .form {
    display: flex;
    flex-direction: column;
    align-items: start;
    width: 100%;
  }

  .field {
    margin-bottom: 1rem;
  }

  .actions {
    align-self: end;
  }
}

label {
  grid-column-start: 1;
}

.field {
  grid-column-start: 2;
  grid-column-end: 4;
}

.actions {
  grid-column-start: 3;
  grid-row-start: 5;
  justify-self: end;
}
</style>
