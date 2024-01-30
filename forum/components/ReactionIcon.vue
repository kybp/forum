<script setup lang="ts">
import { computed } from 'vue'
import type { ReactionType } from '@/stores/thread'

type Props = {
  type: ReactionType
}

const props = defineProps<Props>()

const icon = computed(() => {
  return {
    like: '👍',
    laugh: '🤣',
    confused: '??',
  }[props.type]
})
</script>

<template>
  <span>{{ icon }}</span>
</template>
