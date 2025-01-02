import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MusiciansView from '../views/Musicians/View.vue'
import MusiciansCreate from '../views/Musicians/Create.vue'
import MusiciansEdit from '../views/Musicians/Edit.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/musicians',
      name: 'musicians',
      component: MusiciansView,
    },
    {
      path: '/musicians/create',
      name: 'musicianCreate',
      component: MusiciansCreate,
    },
    {
      path: '/musicians/:id/edit',
      name: 'musicianEdit',
      component: MusiciansEdit,
    },
  ],
})

export default router
