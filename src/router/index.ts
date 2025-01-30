import { AppAuthTokenKey } from '@/utils/Constant';
import { loadStorage } from '@/utils/StorageUtil';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    meta: { noRequireAuth: true },
    component: () => import('@/pages/index.vue')
  },
  {
    path: '/about',
    component: () => import('@/pages/about.vue')
  },
  {
    path: '/auth/login',
    meta: { noRequireAuth: true },
    component: () => import('@/pages/auth/login.vue')
  },
  {
    path: '/auth/forgot-password',
    meta: { noRequireAuth: true },
    component: () => import('@/pages/auth/forgot-password.vue')
  },
  {
    path: '/settings/account-settings',
    component: () => import('@/pages/settings/account-settings/index.vue')
  },
  {
    path: '/settings/account-settings/auth-session',
    component: () => import('@/pages/settings/account-settings/auth-session.vue')
  },
  {
    path: '/settings/account-settings/email',
    component: () => import('@/pages/settings/account-settings/email.vue')
  },
  {
    path: '/settings/account-settings/password',
    component: () => import('@/pages/settings/account-settings/password.vue')
  },
  {
    path: '/settings/account-settings/personal',
    component: () => import('@/pages/settings/account-settings/personal.vue')
  },
  {
    path: '/settings/account-settings/phone',
    component: () => import('@/pages/settings/account-settings/phone.vue')
  },
  {
    path: '/settings/account-settings/photo',
    component: () => import('@/pages/settings/account-settings/photo.vue')
  },
  {
    path: '/settings/languge',
    meta: { noRequireAuth: true },
    component: () => import('@/pages/settings/languge.vue')
  },
  {
    path: '/settings/appearance',
    meta: { noRequireAuth: true },
    component: () => import('@/pages/settings/appearance.vue')
  },
  {
    path: '/tabs/',
    component: () => import('@/pages/tabs/index.vue'),
    children: [
      {
        path: '',
        redirect: '/tabs/home'
      },
      {
        path: 'home',
        component: () => import('@/pages/tabs/home.vue')
      },
      {
        path: 'chat',
        component: () => import('@/pages/tabs/chat.vue')
      },
      {
        path: 'other',
        component: () => import('@/pages/tabs/other.vue')
      }
    ]
  },
  {
    path: '/test',
    meta: { noRequireAuth: true },
    component: () => import('@/pages/test/index.vue')
  },
  {
    path: '/:catchAll(.*)*',
    meta: { noRequireAuth: true },
    component: () => import('@/pages/404.vue')
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});
router.beforeEach(async (to, from, next) => {
  if (to.meta.noRequireAuth === true) {
    next();
  } else {
    // console.log('requireAuth > from ', from, 'to >', to);
    // const authTokenKey = localStorage.getItem(AppAuthTokenKey);
    const authTokenKey = await loadStorage<string>(AppAuthTokenKey);
    if (authTokenKey) {
      next();
    } else {
      next({
        path: '/auth/login/',
        replace: true
      });
    }
  }
});
export default router;
