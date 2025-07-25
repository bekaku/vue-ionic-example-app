<script setup lang="ts">
import { useAuthen } from '@/composables/useAuthen';
import { useBase } from '@/composables/useBase';
import { useCheckVersion } from '@/composables/useCheckVersion';
import { useConfig } from '@/composables/useConfig';
import { useDevice } from '@/composables/useDevice';
import { useLang } from '@/composables/useLang';
import { useAuthenStore } from '@/stores/authenStore';
import {
  IonCol,
  IonContent,
  IonGrid,
  IonPage,
  IonRow,
  IonSpinner,
} from '@ionic/vue';
import { defineAsyncComponent, onMounted, ref } from 'vue';

const VersionCheck = defineAsyncComponent(
  () => import('@/components/VersionCheck.vue'),
);
const BaseResult = defineAsyncComponent(
  () => import('@/components/base/BaseResult.vue'),
);
const { t } = useLang();
const { isRootDetected } = useDevice();
const { initAuthen } = useAuthen();
const { appNavigateTo } = useBase();
const { isDevMode } = useConfig();
const { checkVersion, appVersion, platForm, haveVersionUpdate, userVersion }
  = useCheckVersion();
const authenStore = useAuthenStore();
const loading = ref(true);
const isDeviceRooted = ref(false);
onMounted(async () => {
  if (isDevMode()) {
    console.log(
      'src > pages >index.vue >onMounted>  authenStore',
      authenStore.auth,
    );
  }
  await appInitial();
});

const appInitial = async () => {
  const isRoot = await isRootDetected();
  if (!isRoot) {
    await checkVersion();
    if (!haveVersionUpdate.value) {
      await checkAuth();
    } else {
      loading.value = false;
    }
  } else {
    loading.value = false;
    isDeviceRooted.value = true;
  }
  return new Promise((resolve) => {
    resolve(true);
  });
};

const checkAuth = async () => {
  let auth = authenStore.auth;

  if (!auth) {
    const initItem = await initAuthen();
    if (initItem) {
      auth = initItem;
    }
  }

  if (auth) {
    appNavigateTo('/tabs/home', true);
  } else {
    appNavigateTo('/auth/login', true);
    // destroyAuthDataAndRedirect(false);
    // appNavigateTo('/auth/login', true);
  }
  return new Promise((resolve) => {
    resolve(true);
  });
};
</script>
<template>
  <ion-page>
    <ion-content fullscreen class="ion-padding">
      <ion-grid>
        <ion-row style="height: 100vh" class="ion-justify-content-center">
          <ion-col class="ion-align-self-center">
            <template v-if="loading">
              <div class="ion-text-center">
                <img src="/icon.png" style="width: 175px" alt="gd5">
                <p>
                  <ion-spinner name="dots" />
                </p>
              </div>
            </template>
            <ion-row v-else-if="isDeviceRooted">
              <ion-col>
                <base-result status="error" :icon-size="128" :description="t('error.deviceRootDetect')" />
              </ion-col>
            </ion-row>
            <template v-else-if="haveVersionUpdate">
              <version-check :user-version="userVersion" :plat-form="platForm" :item="appVersion"
                @update-later="checkAuth()" />
            </template>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>
<style scoped lang="scss">
ion-content {
  --background: var(--v-color-white);
}

ion-spinner {
  // --color: #fff;
  --color: var(--ion-color-primary);
}
</style>
