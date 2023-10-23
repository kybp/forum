<script setup lang="ts">
import { ref, watchEffect, type Ref } from 'vue'
import { ErrorMessage, Field, Form } from 'vee-validate'
import type { Errors } from '@/stores/utils'
import * as yup from 'yup'

type Props = {
  errors: Errors | null
}

const props = defineProps<Props>()

const emit = defineEmits(['submit'])

const schema = yup.object({
  title: yup.string().required(),
  body: yup.string(),
})

const form: Ref<any> = ref(null)

watchEffect(() => {
  if (props.errors) form.value?.setErrors(props.errors)
  form.value?.validate()
})

const postThread = async ({ title, body }: any) => {
  emit('submit', { title, body })
}
</script>
<template>
  <Form ref="form" @submit="postThread" :validation-schema="schema">
    <h2>New Thread</h2>
    <Field name="title" placeholder="Title" />
    <ErrorMessage name="title" />

    <Field name="body" as="textarea" placeholder="Body" />
    <ErrorMessage name="body" />

    <button type="submit">Submit</button>
  </Form>
</template>
