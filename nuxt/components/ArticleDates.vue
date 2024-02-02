<script setup lang="ts">
type Props = {
  article: {
    date_posted: string
    date_edited: string | null
  }
}

defineProps<Props>()
</script>

<template>
  <div v-if="article.date_edited" class="dates">
    <div class="note posted" data-testid="posted">
      First posted {{ formatDate(article.date_posted) }}
    </div>
    <div class="note edited" data-testid="edited">
      Updated {{ formatDate(article.date_edited) }}
    </div>
  </div>
  <div v-else class="dates">
    <div class="note posted" data-testid="posted">
      Posted {{ formatDate(article.date_posted) }}
    </div>
  </div>
</template>

<style scoped>
.dates {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.3rem;
}
</style>
