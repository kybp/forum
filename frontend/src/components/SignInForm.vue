<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue'
import type { Ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { ErrorMessage, Field, Form } from 'vee-validate'
import { storeToRefs } from 'pinia'
import * as yup from 'yup'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const route = useRoute()
const router = useRouter()

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

  if (!authStore.signInErrors) {
    if (route.redirectedFrom) {
      router.push({ path: route.redirectedFrom.fullPath })
    } else if (!router.options.history.state.back) {
      router.push({ name: 'home' })
    }
  }
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
  height: 2rem;

  @media (--small-viewport) {
    display: grid;
  }

  @media (--medium-viewport) {
    display: grid;
    margin-bottom: 3rem;
  }

  .fields {
    display: flex;
    margin-top: 0.3rem;

    @media (--medium-viewport) {
      grid-row: 1;
      margin-bottom: 0.5rem;
    }

    @media (--small-viewport) {
      display: grid;
    }

    .field {
      @media (--medium-viewport) {
        max-width: 9rem;
        margin-right: 0;
      }

      @media (--small-viewport) {
        max-width: 100%;
      }

      & + .field {
        margin-left: 0.5rem;

        @media (--small-viewport) {
          margin-top: 0.3rem;
          margin-left: 0;
        }
      }
    }
  }

  .actions {
    margin-left: 0.5rem;

    @media (--medium-viewport) {
      grid-row: 2;
      display: flex;
      justify-content: end;
    }

    @media (--small-viewport) {
      display: flex;
      justify-content: end;
      margin-top: 0.3rem;

      .button + .button {
        margin-left: 0.5rem;
      }
    }

    button[type='submit'] + * {
      margin-left: 0.5rem;

      @media (--small-viewport) {
        margin-left: 0;
      }
    }
  }
}
</style>
