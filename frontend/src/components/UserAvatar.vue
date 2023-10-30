<script setup lang="ts">
import { computedAsync } from '@vueuse/core'
import type { User } from '@/stores/user'
import { sha256 } from '@/utils'

type Props = {
  user: User
}

const props = defineProps<Props>()

const hash = computedAsync(() => sha256(props.user.email))
</script>

<template>
  <img :src="`https://gravatar.com/avatar/${hash}?s=50`" />
</template>
