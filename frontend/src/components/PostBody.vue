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
.body >>> img {
  max-width: 80vw;
}

.body >>> * + p {
  margin-top: 1rem;
}

.body >>> ul,
.body >>> ol {
  padding-left: 2rem;
}

.body >>> * + ul,
.body >>> * + ol {
  margin-top: 1rem;
}

.body >>> ul li {
  list-style: inside;
}

.body >>> ol {
  list-style-type: decimal;
}
</style>
