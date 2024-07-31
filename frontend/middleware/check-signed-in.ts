import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()

  if (!authStore.account) return navigateTo('/sign-in')
})
