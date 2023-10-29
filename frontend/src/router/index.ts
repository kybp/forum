import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import * as guards from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      beforeEnter: guards.checkNotSignedIn,
    },
    {
      path: '/sign-in',
      name: 'sign in',
      component: () => import('../views/SignInView.vue'),
      beforeEnter: guards.checkNotSignedIn,
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('../views/AccountView.vue'),
      beforeEnter: guards.checkSignedIn,
    },
    {
      path: '/post',
      name: 'post',
      component: () => import('../views/NewThreadView.vue'),
      beforeEnter: guards.checkSignedIn,
    },
    {
      path: '/threads/:id',
      name: 'thread detail',
      component: () => import('../views/ThreadDetailView.vue'),
    },
  ],
})

export default router
