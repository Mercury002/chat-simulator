import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: '/',
    redirect: '/users'
  },
  {
    path: '/users', 
    name: 'users', 
    component: () => import('@/views/Users.vue')
  },
  {
    path: '/chat', 
    name: 'chat', 
    component: () => import('@/views/Chat.vue')
  }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_BASE_URL),
    routes: routes,
    scrollBehavior() {
        return { top: document.documentElement.scrollHeight }; 
    }
})

router.beforeEach((to, from, next) => {
    if (to.path === '/chat' && localStorage.getItem('visitedChat')) {
    next('/users')
  } else {
    next()
  }

  document.title = 'Chat simulator';
  })

export default router   