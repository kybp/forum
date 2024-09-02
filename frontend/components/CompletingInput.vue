<script setup lang="ts">
type Props = {
  choices: string[]
  modelValue: string
  placeholder?: string
}

const props = defineProps<Props>()

const emit = defineEmits(['update:modelValue'])

const inputValue = ref(props.modelValue ?? '')

const suggestions = computed(() =>
  props.choices.filter((c) => c.startsWith(inputValue.value ?? '')),
)

const index = ref<number | null>(null)

const isOpen = ref(false)

const open = (initialIndex: number | null = null) => {
  index.value = initialIndex
  isOpen.value = true
}

const close = () => {
  index.value = null
  isOpen.value = false
}

const update = () => {
  const value =
    index.value !== null ? suggestions.value[index.value] : inputValue.value

  inputValue.value = value
  emit('update:modelValue', value)
  close()
}

const handleInput = () => {
  open(index.value)

  if (index.value === null) return

  if (!suggestions.value.length) {
    close()
  } else {
    index.value = null
  }
}

const nextChoice = () => {
  if (index.value !== null) ++index.value
  else if (suggestions.value.length) open(0)
}

const previousChoice = () => {
  if (index.value === null) {
    open(suggestions.value.length - 1)
  } else if (index.value > 0) {
    --index.value
  } else {
    index.value = null
  }
}

const isActive = (i: number) => {
  return i == index.value
}
</script>

<template>
  <div class="wrapper">
    <input
      v-model="inputValue"
      :placeholder="placeholder ?? ''"
      @blur="update()"
      @click="open()"
      @input="handleInput"
      @keydown.enter.prevent="update()"
      @keydown.down="nextChoice"
      @keydown.up="previousChoice"
      @keydown.esc="close"
    />
    <ul :class="{ open: isOpen, closed: !isOpen }">
      <li
        v-for="(suggestion, i) in suggestions"
        :class="{ active: isActive(i) }"
        :key="`suggestion-${i}`"
        @mouseenter="index = i"
        @mouseleave="index = null"
      >
        {{ suggestion }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.wrapper {
  position: relative;
}

input {
  background: inherit;
  color: inherit;
  font-size: inherit;
}

ul {
  width: 100%;
  position: absolute;
  right: 0;
  top: 1.2rem;
  background: var(--color-input-background);
  color: var(--color-text);
  z-index: 5;
  border: 0.01rem solid var(--f-purple-3);
  border-top: none;

  &.closed {
    display: none;
  }
}

li {
  padding: 0.2rem 0.4rem;

  &.active,
  &:hover {
    background: var(--color-input-highlight-background);
  }
}
</style>
