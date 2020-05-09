import Vue from 'vue'
import VueRouter from 'vue-router'
import { auth } from "@/firebaseConfig"
import Home from '../views/Home.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: "*",
    redirect: "/"
  },
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/forum',
    name: 'Forum',
    component: () => import('../views/Forum.vue'),
    meta: { requiresAuth: true }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(route => route.meta.requiresAuth); 
  // true or false depending on whether there is meta with requiresAuth
  const currentUser = auth.currentUser;
  
  if (requiresAuth && !currentUser) {
    next("/");
  } else {
    next();
  }
})
4
export default router
