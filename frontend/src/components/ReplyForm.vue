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
    <div class="field">
      <Field name="body" v-slot="{ field, errors }">
        <textarea
          v-bind="field"
          placeholder="Reply"
          :class="{ invalid: !!errors.length }"
          rows="7"
        ></textarea>
      </Field>
      <ErrorMessage name="body" />
    </div>

    <button type="submit" class="button">Submit</button>
  </Form>
</template>

<style scoped>
form {
  display: grid;
  width: 60vw;
}

.field {
  grid-column-start: 1;
  grid-column-end: 3;
}

button[type='submit'] {
  grid-column-start: 2;
  grid-row-start: 2;
  margin-top: 0.5rem;
  justify-self: end;
}
</style>
