<script setup lang="ts">
import MarkdownIt from 'markdown-it'

type Props = {
  value: string
}

defineProps<Props>()

const markdown = new MarkdownIt()
</script>

<template>
  <div class="body" v-html="markdown.render(value)" />
</template>

<style scoped>
.body.align-top :deep(:first-child) {
  margin-top: 0;
}

.body :deep(img) {
  max-width: 80%;
}

@media (--small-viewport) {
  .body :deep(img) {
    max-width: 100%;
  }
}

.body :deep(p) {
  margin: 1rem 0;
}

.body :deep(pre),
.body :deep(code) {
  filter: brightness(150%);
  backdrop-filter: brightness(63%);
  border-radius: 5px;
  width: fit-content;
}

.body :deep(pre) {
  padding: 0.5rem 1rem;
}

.body :deep(code) {
  padding: 0.2rem 0.4rem;
}

.body :deep(pre code) {
  filter: none;
  backdrop-filter: none;
  padding: 0;
}

.body :deep(ul),
.body :deep(ol) {
  padding-left: 2rem;
}

.body :deep(* + ul),
.body :deep(* + ol) {
  margin-top: 1rem;
}

.body :deep(ul li) {
  list-style: inside;
}

.body :deep(ol) {
  list-style-type: decimal;
}
</style>
