<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import type { Ref } from 'vue'
import { ErrorMessage, Field, Form } from 'vee-validate'
import type { FormActions } from 'vee-validate'
import { storeToRefs } from 'pinia'
import * as yup from 'yup'
import { useThreadStore } from '@/stores/thread'

const props = defineProps({
  postId: {
    type: Number,
    required: true,
  },
})

const threadStore = useThreadStore()

const schema = yup.object({
  body: yup.string().required(),
})

const form: Ref<any> = ref(null)

const { replyErrors } = storeToRefs(threadStore)

watchEffect(() => {
  if (replyErrors.value) form.value?.setErrors(replyErrors.value)
})

const reply = async ({ body }: any, { resetForm }: FormActions<any>) => {
  await threadStore.reply({
    postId: props.postId,
    body,
  })
  resetForm()
}
</script>
<template>
  <Form ref="form" @submit="reply" :validation-schema="schema">
    <Field name="body" as="textarea" placeholder="Reply" />
    <ErrorMessage name="body" />

    <button type="submit">Submit</button>
  </Form>
</template>
