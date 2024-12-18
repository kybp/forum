<script setup lang="ts">
import type { Page } from '~/types'

type Props = {
  title: string
  value: string
}

const emit = defineEmits<{
  pageChange: [newPage: Page]
}>()

const props = defineProps<Props>()

const pageIndex = ref(0)

const route = useRoute()

const pages = computed(() => {
  const result: Array<{ title: string; body: string }> = [
    {
      title: props.title,
      body: '',
    },
  ]

  let inCodeBlock = false
  props.value.split('\n').forEach((line) => {
    if (line.match(/^\s*```/)) inCodeBlock = !inCodeBlock

    const match = line.match(/^#\s+(\S.*)/)

    if (!inCodeBlock && match && result[result.length - 1].body.length > 0) {
      result.push({ title: match[1], body: '' })
    } else {
      result[result.length - 1].body += line + '\n'
    }
  })

  return result
})

const page = computed(() => pages.value[pageIndex.value])

watch(
  () => route.query,
  () => {
    pageIndex.value = +(route.query.viewPage ?? 0)
    emit('pageChange', page.value)
  },
  { immediate: true },
)

const showPageControls = computed(() => {
  return pages.value.length > 1
})

const previousPageLink = computed(() => {
  return `?viewPage=${Math.max(0, pageIndex.value - 1)}`
})

const nextPageLink = computed(() => {
  return `?viewPage=${Math.min(pages.value.length - 1, pageIndex.value + 1)}`
})

const hasPreviousPage = computed(() => pageIndex.value - 1 >= 0)

const hasNextPage = computed(() => pageIndex.value + 1 < pages.value.length)
</script>
<template>
  <MarkdownBody :value="page.body" class="body" data-testid="body" />
  <div class="toc" v-if="pages.length > 1 && pageIndex === 0">
    <h3>Pages</h3>
    <ul>
      <li v-for="(page, index) in pages.slice(1)" :key="`page-${index}`">
        <NuxtLink :to="`?viewPage=${index + 1}`">
          {{ page.title }}
        </NuxtLink>
      </li>
    </ul>
  </div>
  <div class="page-controls" v-if="pages.length > 1">
    <NuxtLink
      :to="previousPageLink"
      v-if="showPageControls && hasPreviousPage"
      data-testid="previous-page"
    >
      Previous page
    </NuxtLink>
    <NuxtLink v-if="pageIndex > 0" :to="route.path">Top</NuxtLink>
    <NuxtLink
      :to="nextPageLink"
      v-if="showPageControls && hasNextPage"
      data-testid="next-page"
    >
      Next page
    </NuxtLink>
    <span class="counter">({{ pageIndex + 1 }}/{{ pages.length }})</span>
  </div>
</template>
<style scoped>
.toc {
  display: inline-block;
  margin-left: 1rem;
  padding: 0.4rem 1rem 0.6rem 1rem;
  border: 0.01rem solid var(--f-pink-2);
  border-radius: 0.2rem;

  ul {
    padding-left: 1rem;
    list-style-type: disc;
  }
}

.page-controls {
  margin-left: 5rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  display: flex;
  gap: 1rem;

  .counter {
    margin-top: 0.1rem;
    opacity: 0.7;
  }
}
</style>
