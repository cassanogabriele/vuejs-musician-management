import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import MusiciansView from '../views/Musicians/View.vue';
import LoginView from '../views/Musicians/Login.vue';
import MusiciansCreate from '../views/Musicians/Create.vue';
import MusiciansEdit from '../views/Musicians/Edit.vue';
import RegisterView from '../views/Musicians/Register.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,     
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/about',
      name: 'about',
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
    // Catch-all route pour rediriger vers home si aucune route ne correspond
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
});

export default router;
