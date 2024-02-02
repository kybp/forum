<script setup lang="ts">
import { computed } from 'vue'
import type { ReactionType } from '~/types'

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
