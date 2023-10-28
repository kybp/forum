<script setup lang="ts">
import { ref, watch } from 'vue'
import CompletingInput from './CompletingInput.vue'

type Props = {
  value?: string
  editable?: boolean
}

withDefaults(defineProps<Props>(), {
  value: '',
  editable: false,
})

const emit = defineEmits(['change', 'delete'])

const specialTags = ['programming', 'music', 'photos']

const tagClass = (tag: string) => {
  const specialClasses = Object.fromEntries(specialTags.map((x) => [x, x]))
  const specialClass = specialClasses[tag]

  return specialClass ?? 'default'
}

const inputValue = ref('')

watch(
  () => inputValue.value,
  () => emit('change', inputValue.value),
)
</script>

<template>
  <div v-if="editable" :class="`tag input ${tagClass(inputValue)}`">
    <CompletingInput
      v-model="inputValue"
      :choices="specialTags"
      placeholder="Tag"
    />
    <button @click="$emit('delete')">X</button>
  </div>
  <div v-else :class="`tag ${tagClass(value)}`">
    {{ value }}
  </div>
</template>

<style scoped>
.tag {
  margin-left: 0.5rem;
  font-size: x-small;
  padding: 0.2rem 0.6rem;
  border-radius: 5px;
  display: flex;
  width: fit-content;
}

.tag::before {
  content: '#';
}

.tag input {
  background: inherit;
  color: inherit;
  font-size: inherit;
}

.tag.programming {
  background: var(--color-background-programming-tag);
  color: var(--f-purple-1);
}

.tag.music {
  background: var(--color-background-music-tag);
  color: var(--f-purple-1);
}

.tag.photos {
  background: var(--color-background-photos-tag);
}

.tag.default {
  background: var(--color-background-tag-default);
  color: var(--f-purple-1);
}

button {
  backdrop-filter: brightness(55%);
  border-radius: 1rem;
  padding: 0.1rem 0.3rem;
}
</style>
