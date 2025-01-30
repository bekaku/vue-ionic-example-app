<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { useBase } from '@/composables/UseBase';
import { useConfig } from '@/composables/UseConfig';
import { useInitApp } from '@/composables/useInitApp';
import { useLang } from '@/composables/UseLang';
import { useAuthenStore } from '@/stores/AuthenStore';
import { useDeviceStore } from '@/stores/DeviceStore';
import { App } from '@capacitor/app';
import {
  IonApp,
  IonRouterOutlet,
  useBackButton,
  useIonRouter
} from '@ionic/vue';
import { onBeforeMount } from 'vue';

const { isDevMode } = useConfig();
const authenStore = useAuthenStore();
const { initAuthen, initThemeLanguge } = useInitApp();
const ionRouter = useIonRouter();
const { getCurrentPath, WeeConfirm } = useBase();
const { t } = useLang();
const deviceStore = useDeviceStore();
const { setAppStateChange } = deviceStore;
onBeforeMount(async () => {
  initThemeLanguge();
  console.log('App.vue > onBeforeMount');
  if (isDevMode()) {
    console.log('App.vue >onBeforeMount > authenStore ', authenStore.auth);
  }
  App.addListener('appStateChange', async ({ isActive }) => {
    setAppStateChange(isActive);
  });

  await initAuthen();

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
</script>
