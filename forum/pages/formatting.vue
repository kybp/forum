<script setup lang="ts">
const demo = `
  **Bold**, *italics*, \`code\`, ~~strikethrough~~

  # Header 1
  ## Header 2
  ### Header 3

  ## Lists
  Ordered:
  1. item
     1. Indent three spaces for nested lists
     1. Items are numbered automatically
        1. Indent another three spaces to nest further
  2. item

  Unordered:
  - item
     - Indent three spaces for nested lists
        - Indent another three spaces to nest further
  - item

  \`\`\`
  Code block
  \`\`\`

  > Quoted text

  Line\\
  break

  [A link](https://example.com)

  ![An image](https://i.imgur.com/U9tFNKz.jpg)
  `
</script>

<template>
  <h1>Formatting</h1>
  <p>You can use Markdown to format your posts and replies.</p>
  <div class="demo">
    <pre>{{ demo }}</pre>
    <MarkdownBody :value="demo" />
  </div>
</template>

<style scoped>
.demo {
  display: grid;
  grid-template-columns: 50% 50%;

  @media (--small-viewport), (--medium-viewport) {
    grid-template-columns: 100%;
  }
}
</style>
