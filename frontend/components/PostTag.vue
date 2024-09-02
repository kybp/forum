<script setup lang="ts">
import CompletingInput from './CompletingInput.vue'

type Props = {
  value?: string
  editable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
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

const inputValue = ref(props.value ?? '')

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
  border-radius: 0.2rem;
  display: flex;
  width: fit-content;

  &::before {
    content: '#';
  }

  input {
    background: inherit;
    color: inherit;
    font-size: inherit;
  }

  &.programming {
    background: var(--color-background-programming-tag);
    color: var(--f-purple-1);
  }

  &.music {
    background: var(--color-background-music-tag);
    color: var(--f-purple-1);
  }

  &.photos {
    background: var(--color-background-photos-tag);
  }

  &.default {
    background: var(--color-background-tag-default);
    color: var(--f-purple-1);
  }
}

button {
  color: var(--f-purple-1);
  backdrop-filter: brightness(55%);
  border-radius: 1rem;
  padding: 0.1rem 0.3rem;
}
</style>
