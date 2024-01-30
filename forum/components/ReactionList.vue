<script setup lang="ts">
import { reactionTypes } from '@/api'
import type { Thread, ReactionType } from '@/api'
import { useAuthStore } from '@/stores/auth'
import { useThreadsStore } from '@/stores/threads'

type Props = {
  post: Thread
}

const props = defineProps<Props>()

const authStore = useAuthStore()
const threadStore = useThreadsStore()

const { account } = storeToRefs(authStore)

const reactions = computed(() => countBy(props.post.reactions, (r) => r.type))

const toggleReaction = (type: ReactionType) => {
  threadStore.toggleThreadReaction(props.post, type)
}

const canReact = computed(
  () => account.value && props.post.author !== account.value.id,
)

const availableReactionTypes = computed(() =>
  reactionTypes.filter((t) => canReact.value || reactions.value[t] > 0),
)
</script>

<template>
  <ul>
    <li v-for="type in availableReactionTypes" :key="type">
      <button
        @click="toggleReaction(type)"
        :disabled="!canReact"
        class="button"
      >
        <ReactionIcon :type="type" />
      </button>
      <span class="count" :data-testid="`${type}s`">{{ reactions[type] }}</span>
    </li>
  </ul>
</template>

<style scoped>
ul {
  display: flex;
}

li {
  display: flex;
}

li + li {
  margin-left: 1rem;
}

.count {
  margin: 0 0.5rem;
}
</style>
