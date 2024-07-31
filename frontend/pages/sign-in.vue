<script setup lang="ts">
definePageMeta({
  middleware: 'check-not-signed-in',
})
</script>

<template>
  <h1>Unauthorised</h1>
  <p>You need an account to see that page. Sign in or register to continue!</p>
</template>
