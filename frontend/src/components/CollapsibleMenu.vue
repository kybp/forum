<script setup lang="ts">
import { ref } from 'vue'

const isMenuExpanded = ref(false)

const toggleIsMenuExpanded = () => {
  isMenuExpanded.value = !isMenuExpanded.value
}
</script>

<template>
  <div class="wrapper">
    <button class="expand-toggle" @click="toggleIsMenuExpanded">
      &vellip;
    </button>
    <div
      :class="{ menu: true, closed: !isMenuExpanded }"
      @blur="toggleIsMenuExpanded"
    >
      <div class="content">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
}

.expand-toggle {
  display: none;

  @media (--small-viewport) {
    display: inline-block;
    align-self: right;
    border: 1px solid var(--f-purple-3);
    border-radius: 1rem;
    padding: 0 0.5rem 0.2rem 0.5rem;

    &:hover {
      background-color: var(--f-pink-2);
    }

    &:active {
      filter: brightness(75%);
    }
  }
}

.menu {
  @media (--small-viewport) {
    position: relative;

    &.closed {
      display: none;
    }

    .content {
      position: absolute;
      right: 0;
      top: 2rem;
      display: flex;
      flex-direction: column;

      .button {
        width: 100%;
      }
    }
  }
}
</style>
