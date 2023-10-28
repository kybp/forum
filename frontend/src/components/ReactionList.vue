<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import ReactionIcon from '@/components/ReactionIcon.vue'
import { reactionTypes } from '@/stores/thread'
import { useAuthStore } from '@/stores/auth'
import { useThreadStore } from '@/stores/thread'
import type { Thread, ReactionType } from '@/stores/thread'
import { countBy } from '@/utils'

type Props = {
  thread: Thread
}

const props = defineProps<Props>()

const authStore = useAuthStore()
const threadStore = useThreadStore()

const { user } = storeToRefs(authStore)

const reactions = computed(() => countBy(props.thread.reactions, (r) => r.type))

const toggleReaction = (type: ReactionType) => {
  threadStore.toggleThreadReaction(props.thread, type)
}

const canReact = computed(
  () => user.value && props.thread.author !== user.value.id,
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
