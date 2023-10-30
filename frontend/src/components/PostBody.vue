<script setup lang="ts">
import MarkdownIt from 'markdown-it'

type Props = {
  value: string
  alignTop?: boolean
}

defineProps<Props>()

const markdown = new MarkdownIt()
</script>

<template>
  <div
    v-html="markdown.render(value)"
    :class="{ body: true, 'align-top': alignTop }"
  />
</template>

<style scoped>
.body {
  .align-top :deep(:first-child) {
    margin-top: 0;
  }

  :deep(img) {
    max-width: 80%;

    @media (--small-viewport) {
      max-width: 100%;
    }
  }

  :deep(p) {
    margin: 1rem 0;
  }

  :deep(pre),
  :deep(code) {
    filter: brightness(150%);
    backdrop-filter: brightness(63%);
    border-radius: 5px;
    width: fit-content;
  }

  :deep(pre) {
    padding: 0.5rem 1rem;
  }

  :deep(code) {
    padding: 0.2rem 0.4rem;
  }

  :deep(pre code) {
    filter: none;
    backdrop-filter: none;
    padding: 0;
  }

  :deep(ul),
  :deep(ol) {
    padding-left: 2rem;
  }

  :deep(* + ul),
  :deep(* + ol) {
    margin-top: 1rem;
  }

  :deep(ul li) {
    list-style: inside;
  }

  :deep(ol) {
    list-style-type: decimal;
  }
}
</style>
