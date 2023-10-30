<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { ErrorMessage, Field, Form } from 'vee-validate'
import type { FormActions } from 'vee-validate'
import { storeToRefs } from 'pinia'
import * as yup from 'yup'
import PostBody from '@/components/PostBody.vue'
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

const form = ref<any>(null)

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

const body = ref('')
const isMobilePreviewOpen = ref(false)
</script>

<template>
  <Form
    ref="form"
    @submit="reply"
    :validation-schema="schema"
    :class="{ 'mobile-preview': isMobilePreviewOpen }"
  >
    <div class="field">
      <Field name="body" v-model="body" v-slot="{ field, errors }">
        <textarea
          v-bind="field"
          placeholder="Reply"
          :class="{ invalid: !!errors.length }"
          rows="5"
        ></textarea>
      </Field>
      <ErrorMessage name="body" />
    </div>

    <div class="actions">
      <button
        class="button toggle-mobile-preview"
        type="button"
        @click="isMobilePreviewOpen = !isMobilePreviewOpen"
      >
        Preview
      </button>
      <button type="submit" class="button" @click="isMobilePreviewOpen = false">
        Submit
      </button>
    </div>

    <div class="preview" data-testid="preview">
      <PostBody :value="body" class="body" align-top />
    </div>
  </Form>
</template>

<style scoped>
form {
  display: grid;
  grid-template-columns: 50% 50%;
  column-gap: 1rem;
}

.field {
  grid-column: 1;
  grid-row: 1;
}

.preview {
  grid-row: 1;
}

button.toggle-mobile-preview {
  display: none;
}

@media (--small-viewport), (--medium-viewport) {
  form {
    grid-template-columns: 100%;
  }

  button.toggle-mobile-preview {
    display: inline-block;
  }

  .preview {
    display: none;
  }

  .mobile-preview .field {
    display: none;
  }

  .mobile-preview .preview {
    display: inline-block;
  }
}

.field textarea {
  /* Sync height with preview if it grows larger than input. */
  height: 100%;
}

.actions {
  grid-row: 2;
  margin-top: 0.5rem;
  justify-self: end;
}
</style>
