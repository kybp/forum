import type { NavigationGuard } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export const checkSignedIn: NavigationGuard = () => {
  const authStore = useAuthStore()
  if (!authStore.account) return { name: 'sign in' }
}

export const checkNotSignedIn: NavigationGuard = () => {
  const authStore = useAuthStore()
  if (authStore.account) return { name: 'home' }
}
