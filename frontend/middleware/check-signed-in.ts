import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware((from) => {
  const authStore = useAuthStore()

  if (!authStore.account) {
    return navigateTo(`/sign-in?redirectTo=${from.path}`)
  }
})
