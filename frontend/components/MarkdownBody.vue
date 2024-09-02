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

  :deep(strong) {
    font-weight: 700;
  }

  :deep(img) {
    max-height: 95vh;
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
    border-radius: 0.2rem;
    width: fit-content;
    filter: brightness(150%);
    backdrop-filter: brightness(63%);

    @media (prefers-color-scheme: dark) {
      filter: none;
      backdrop-filter: brightness(160%);
    }
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

  :deep(pre + h2),
  :deep(pre + h3) {
    margin-top: 1rem;
  }

  :deep(ul),
  :deep(ol) {
    padding-left: 1.5rem;
  }

  :deep(* + ul),
  :deep(* + ol) {
    margin-top: 1rem;
  }

  :deep(ol) {
    list-style-type: decimal;
  }

  :deep(ol ol) {
    list-style-type: upper-roman;
  }

  :deep(ol ol ol) {
    list-style-type: lower-roman;
  }

  :deep(ul) {
    list-style-type: disc;
  }

  :deep(ul ul) {
    list-style-type: circle;
  }

  :deep(ul ul ul) {
    list-style-type: square;
  }

  :deep(blockquote) {
    margin-left: 0.5rem;
    border-left: 0.3rem solid var(--f-purple-3);
    padding-left: 0.5rem;
    backdrop-filter: brightness(95%);

    @media (prefers-color-scheme: dark) {
      backdrop-filter: brightness(160%);
    }
  }
}
</style>
