<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps({
  threads: Object,
})
</script>
<template>
  <ul>
    <li>
      <RouterLink
        v-for="thread in threads"
        :key="thread.id"
        :to="`threads/${thread.id}`"
      >
        {{ thread.title }}
      </RouterLink>
    </li>
  </ul>
</template>
