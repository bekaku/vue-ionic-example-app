import { AppAuthTokenKey } from '@/libs/constant';
import { loadStorage } from '@/utils/storageUtil';
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
    path: '/example/charts',
    component: () => import('@/pages/example/charts.vue')
  },
  {
    path: '/example/content-text',
    component: () => import('@/pages/example/content-text.vue')
  },
  {
    path: '/example/drag-drop',
    component: () => import('@/pages/example/drag-drop.vue')
  },
  {
    path: '/example/image-cropper',
    component: () => import('@/pages/example/image-cropper.vue')
  },
  {
    path: '/example/image-view',
    component: () => import('@/pages/example/image-view.vue')
  },
  {
    path: '/example/markdown-editor',
    component: () => import('@/pages/example/markdown-editor.vue')
  },
  {
    path: '/example/result',
    component: () => import('@/pages/example/result.vue')
  },
  {
    path: '/example/swiper',
    component: () => import('@/pages/example/swiper.vue')
  },
  {
    path: '/example/composables/use-axios',
    component: () => import('@/pages/example/composables/use-axios.vue')
  },
  {
    path: '/example/composables/use-base',
    component: () => import('@/pages/example/composables/use-base.vue')
  },
  {
    path: '/example/composables/use-pagefecth',
    component: () => import('@/pages/example/composables/use-pagefecth.vue')
  },
  {
    path: '/example/virtual-scroller',
    component: () => import('@/pages/example/virtual-scroller.vue')
  },
  {
    path: '/example/ui/avatar',
    component: () => import('@/pages/example/ui/avatar.vue')
  },
  {
    path: '/example/ui/button',
    component: () => import('@/pages/example/ui/button.vue')
  },
  {
    path: '/example/ui/date-picker',
    component: () => import('@/pages/example/ui/date-picker.vue')
  },
  {
    path: '/example/ui/dialog',
    component: () => import('@/pages/example/ui/dialog.vue')
  },
  {
    path: '/example/ui/file-picker',
    component: () => import('@/pages/example/ui/file-picker.vue')
  },
  {
    path: '/example/ui/icon',
    component: () => import('@/pages/example/ui/icon.vue')
  },
  {
    path: '/example/ui/input-text',
    component: () => import('@/pages/example/ui/input-text.vue')
  },
  {
    path: '/example/ui/long-press',
    component: () => import('@/pages/example/ui/long-press.vue')
  },
  {
    path: '/example/ui/menu',
    component: () => import('@/pages/example/ui/menu.vue')
  },
  {
    path: '/example/ui/select',
    component: () => import('@/pages/example/ui/select.vue')
  },
  {
    path: '/example/ui/segment',
    component: () => import('@/pages/example/ui/segment.vue')
  },
  {
    path: '/example/ui/tabs',
    component: () => import('@/pages/example/ui/tabs.vue')
  },
  {
    path: '/example/ui/tabs-router/',
    component: () => import('@/pages/example/ui/tab-router/index.vue'),
    children: [
      {
        path: '',
        redirect: '/example/ui/tabs-router/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/pages/example/ui/tab-router/tab1.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/pages/example/ui/tab-router/tab2.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/pages/example/ui/tab-router/tab3.vue')
      },
      {
        path: 'tab4',
        component: () => import('@/pages/example/ui/tab-router/tab4.vue')
      }
    ]
  },
    {
    path: '/example/ui/transitions',
    component: () => import('@/pages/example/ui/transitions.vue')
  },
  {
    path: '/example/ui/user',
    component: () => import('@/pages/example/ui/user.vue')
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
