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

const postThread = async ({ title, body, tags }: any) => {
  emit('submit', { title, body, tags: tags ?? [] })
}

const title = ref('')
const body = ref('')
</script>
<template>
  <h1>New Thread</h1>

  <div class="wrapper" data-testid="post-form">
    <Form ref="form" @submit="postThread" :validation-schema="schema">
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

      <button type="submit" class="button">Submit</button>
    </Form>

    <div class="preview">
      <h1 class="title">{{ title }}</h1>

      <PostBody :value="body" class="body" />
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  justify-content: space-between;
}

form {
  display: flex;
  flex-direction: column;
  width: 50%;
}

.preview {
  width: 48%; /* Leave a gap between the form and preview. */
}

.field {
  width: 100%;
}

.field.title {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.field.tags {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.field.tags .tag {
  margin-top: 0.1rem;
  margin-bottom: 0.1rem;
}

.button.add-tag {
  margin-left: 0.5rem;
  align-self: flex-start;
}

button[type='submit'] {
  margin-top: 1rem;
  align-self: end;
}
</style>
