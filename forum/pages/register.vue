<script setup lang="ts">
import { ErrorMessage, Form, Field } from 'vee-validate'
import { storeToRefs } from 'pinia'
import * as yup from 'yup'
import { useAuthStore } from '~/stores/auth'
import { useUsersStore } from '~/stores/users'
import type { Account } from '~/types'

const authStore = useAuthStore()
const usersStore = useUsersStore()

const schema = yup.object({
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password'), undefined], 'passwords must match'),
})

const form: Ref<any> = ref(null)

const register = async ({ username, email, password }: any) => {
  form.value?.validate()

  const { error } = await usersStore.createUser({ username, email, password })

  if (!error.value) navigateTo({ name: 'index' })
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
  display: grid;
  align-items: center;
  width: 30%;

  @media (--large-viewport) {
    width: 40%;
  }

  @media (--medium-viewport) {
    width: 60%;
  }

  @media (--small-viewport) {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}

label {
  grid-column: 1;
}

.field {
  grid-column: span 2;

  @media (--small-viewport) {
    margin-bottom: 1rem;
  }
}

.actions {
  grid-column: 3;
  grid-row: 5;
  justify-self: end;

  @media (--small-viewport) {
    align-self: end;
  }
}
</style>
