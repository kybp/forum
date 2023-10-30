<script setup lang="ts">
import { ref, watchEffect, type Ref } from 'vue'
import { ErrorMessage, Field, FieldArray, Form } from 'vee-validate'
import PostBody from '@/components/PostBody.vue'
import PostTag from '@/components/PostTag.vue'
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
  tags: yup.array().of(yup.string()),
})

const form: Ref<any> = ref(null)

watchEffect(() => {
  if (props.errors) {
    form.value?.setErrors(props.errors)
    form.value?.validate()
  }
})

const isMobilePreviewOpen = ref(false)

const postThread = async ({ title, body, tags }: any) => {
  emit('submit', { title, body, tags: tags ?? [] })
}

const title = ref('')
const body = ref('')
</script>
<template>
  <h1>New Thread</h1>

  <Form
    ref="form"
    @submit="postThread"
    :validation-schema="schema"
    :class="{ 'mobile-preview': isMobilePreviewOpen }"
    data-testid="post-form"
  >
    <div class="fields">
      <div class="field title">
        <Field name="title" v-model="title" v-slot="{ field, errors }">
          <input
            v-bind="field"
            placeholder="Title"
            :class="{ invalid: !!errors.length }"
          />
        </Field>
        <ErrorMessage name="title" />
      </div>

      <div class="field tags">
        Tags:

        <FieldArray name="tags" v-slot="{ fields, push, remove }">
          <div class="tag" v-for="(field, i) in fields" :key="field.key">
            <Field :name="`tags[${i}]`" v-slot="{ field }">
              <PostTag v-bind="field" editable @delete="remove(i)" />
            </Field>
          </div>

          <button type="button" class="button add-tag" @click="push('')">
            +
          </button>
        </FieldArray>
      </div>

      <div class="field body">
        <Field name="body" v-model="body" v-slot="{ field, errors }">
          <textarea
            v-bind="field"
            placeholder="Body"
            :class="{ invalid: !!errors.length }"
            rows="14"
          />
        </Field>
        <ErrorMessage name="body" />
      </div>
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
      <h1 class="title">{{ title }}</h1>

      <PostBody :value="body" class="body" />
    </div>
  </Form>
</template>

<style scoped>
form {
  display: grid;
  width: 90%;
  margin-left: 1rem;
  grid-template-columns: 50% 50%;
  column-gap: 2rem;
  row-gap: 0.5em;

  @media (--small-viewport) {
    grid-template-columns: 100%;
  }
}

.fields {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  grid-column: 1;
  grid-row: 1;
}

.actions {
  grid-column: 1;
  grid-row: 2;
  justify-self: end;
}

.preview {
  grid-column: 2;
  grid-row: 1;

  @media (--small-viewport) {
    /* Hide the preview; it's re-enabled with the mobile-preview class */
    display: none;
    grid-column: 1;
  }
}

button.toggle-mobile-preview {
  display: none;

  @media (--small-viewport) {
    display: inline-block;
  }
}

.mobile-preview {
  @media (--small-viewport) {
    .fields {
      display: none;
    }

    .preview {
      display: inline-block;
    }
  }
}

.field {
  width: 100%;

  &.title {
    margin-top: 1rem;
  }

  &.tags {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    .tag {
      margin-top: 0.1rem;
      margin-bottom: 0.1rem;
    }
  }
}

.button.add-tag {
  margin-left: 0.5rem;
  align-self: flex-start;
}

.actions button + button {
  margin-left: 0.5rem;
}
</style>
