import { AppAuthTokenKey } from '@/utils/Constant';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import { loadStorage } from '@/utils/StorageUtil';

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    meta: { noRequireAuth: true },
    component: () => import('@/pages/Index.vue')
  },
  {
    path: '/about',
    component: () => import('@/pages/About.vue')
  },
  {
    path: '/auth/login',
    meta: { noRequireAuth: true },
    component: () => import('@/pages/auth/LoginPage.vue')
  },
  {
    path: '/auth/forgot-password',
    meta: { noRequireAuth: true },
    component: () => import('@/pages/auth/ForgotPassword.vue')
  },
  {
    path: '/notifications',
    component: () => import('@/pages/Notifications.vue')
  },
  {
    path: '/settings/account-settings',
    component: () => import('@/pages/settings/accountSettings/Index.vue')
  },
  {
    path: '/settings/account-settings/auth-session',
    component: () => import('@/pages/settings/accountSettings/AuthSession.vue')
  },
  {
    path: '/settings/account-settings/email',
    component: () => import('@/pages/settings/accountSettings/Email.vue')
  },
  {
    path: '/settings/account-settings/password',
    component: () => import('@/pages/settings/accountSettings/Password.vue')
  },
  {
    path: '/settings/account-settings/personal',
    component: () => import('@/pages/settings/accountSettings/Personal.vue')
  },
  {
    path: '/settings/account-settings/phone',
    component: () => import('@/pages/settings/accountSettings/Phone.vue')
  },
  {
    path: '/settings/account-settings/photo',
    component: () => import('@/pages/settings/accountSettings/Photo.vue')
  },
  {
    path: '/settings/languge',
    meta: { noRequireAuth: true },
    component: () => import('@/pages/settings/Languge.vue')
  },
  {
    path: '/settings/appearance',
    meta: { noRequireAuth: true },
    component: () => import('@/pages/settings/Appearance.vue')
  },
  {
    path: '/tabs/',
    component: () => import('@/pages/TabsHome.vue'),
    children: [
      {
        path: '',
        redirect: '/tabs/home'
      },
      {
        path: 'home',
        component: () => import('@/pages/tabsHome/Home.vue')
      },
      {
        path: 'chat',
        component: () => import('@/pages/tabsHome/Chat.vue')
      },
      {
        path: 'other',
        component: () => import('@/pages/tabsHome/Other.vue')
      }
    ]
  },
  {
    path: '/test',
    meta: { noRequireAuth: true },
    component: () => import('@/pages/test/TestPage.vue')
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
