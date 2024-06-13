<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { useBase } from '@/composables/UseBase';
import { useConfig } from '@/composables/UseConfig';
import { useInitAuthen } from '@/composables/UseInitAuthen';
import { useLang } from '@/composables/UseLang';
import { useAuthenStore } from '@/stores/AuthenStore';
import { useDeviceStore } from '@/stores/DeviceStore';
import { AppSetup } from '@/utils/App';
import { App } from '@capacitor/app';
import {
  IonApp,
  IonRouterOutlet,
  useBackButton,
  useIonRouter
} from '@ionic/vue';
import { onBeforeMount, onBeforeUnmount, watch } from 'vue';

const { isDevMode } = useConfig();
const authenStore = useAuthenStore();
const { initAuth } = useInitAuthen();
const ionRouter = useIonRouter();
const { getCurrentPath, WeeConfirm, WeeGoTo } = useBase();
const { t } = useLang();
const deviceStore = useDeviceStore();
const { setAppStateChange } = deviceStore;
onBeforeMount(async () => {
  console.log('App.vue > onBeforeMount');
  AppSetup();
  if (isDevMode()) {
    console.log('App.vue >onBeforeMount > authenStore ', authenStore.auth);
  }
  App.addListener('appStateChange', async ({ isActive }) => {
    // if (isActive) {
    //   await authenStore.stopAndRestartRefreshTokenTimer();
    // }
    setAppStateChange(isActive);
  });

  await initAuth();

  useBackButton(-1, async () => {
    const currentPath = getCurrentPath();
    if (!ionRouter.canGoBack() || currentPath == '/tabs/home') {
      const confirm = await WeeConfirm(t('app.monogram'), t('base.appExit'));
      if (confirm) {
        App.exitApp();
      }
    }
  });
});

onBeforeUnmount(() => {
  if (authenStore && authenStore.refreshTokenTimeout) {
    authenStore.stopRefreshTokenTimer();
  }
});
watch(authenStore, (state) => {
  if (state && state.sessionExpired) {
    WeeGoTo('/auth/login', true);
  }
});
</script>
