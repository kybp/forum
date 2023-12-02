import './assets/main.css'

import { createApp, watch } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import { startOtelInstrumentation } from './tracing'

startOtelInstrumentation()

const app = createApp(App)

app.use(createPinia())
app.use(router)

const authStore = useAuthStore()

watch(
  () => authStore.account?.theme,
  () => {
    const theme = authStore.account?.theme
    const className = theme ? `${theme}-theme` : ''
    document.documentElement.className = className
  },
  { immediate: true },
)

app.mount('#app')
