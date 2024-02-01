<script setup lang="ts">
import { ErrorMessage, Field, Form } from 'vee-validate'
import type { FormActions } from 'vee-validate'
import * as yup from 'yup'
import MarkdownBody from '@/components/MarkdownBody.vue'
import { usePostsStore } from '@/stores/posts'
import type { Reply } from '@/api'

type Props = {
  postId: number
  initialValue?: Reply
}

const props = defineProps<Props>()

const emit = defineEmits(['submit'])

const postsStore = usePostsStore()

const schema = yup.object({
  body: yup.string().required(),
})

const form = ref<any>(null)

const body = ref(props.initialValue?.body ?? '')

const createReply = async (
  formValues: any,
  { resetForm }: FormActions<{ body: string }>,
) => {
        emit('submit', {
        postId: props.postId,
        body: formValues.body,
        onSuccess: () => {
        resetForm({ values: { body: '' } })
        },
        onError: (errors: any) => {
        form.value?.setErrors(errors)
        },
        })
}


const isMobilePreviewOpen = ref(false)
</script>

<template>
  <Form
    ref="form"
    @submit="createReply"
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
      <MarkdownBody :value="body" class="body" align-top />
    </div>
  </Form>
</template>

<style scoped>
form {
  display: grid;
  grid-template-columns: 50% 50%;
  column-gap: 1rem;

  @media (--small-viewport), (--medium-viewport) {
    grid-template-columns: 100%;
  }
}

.field {
  grid-column: 1;
  grid-row: 1;

  textarea {
    /* Sync height with preview if it grows larger than input. */
    height: 100%;
  }
}

.preview {
  grid-row: 1;

  @media (--small-viewport), (--medium-viewport) {
    /* Hide the preview; it's re-enabled with the mobile-preview class */
    display: none;
  }
}

button.toggle-mobile-preview {
  display: none;

  @media (--small-viewport), (--medium-viewport) {
    display: inline-block;
  }
}

.mobile-preview {
  @media (--small-viewport), (--medium-viewport) {
    .field {
      display: none;
    }

    .preview {
      display: inline-block;
    }
  }
}

.actions {
  grid-row: 2;
  margin-top: 0.5rem;
  justify-self: end;
}
</style>
