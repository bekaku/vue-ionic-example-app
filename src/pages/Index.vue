<template>
  <ion-page>
    <ion-content fullscreen class="ion-padding">
      <ion-grid>
        <ion-row style="height: 100vh" class="ion-justify-content-center">
          <ion-col class="ion-align-self-center">
            <template v-if="loading">
              <div class="ion-text-center">
                <img src="/icon.png" style="width: 175px" alt="gd5" />
                <p>
                  <ion-spinner name="dots"></ion-spinner>
                </p>
              </div>
            </template>
            <ion-row v-else-if="isDeviceRooted">
              <ion-col>
                <base-result
                  status="error"
                  icon-size="128px"
                  :description="t('error.deviceRootDetect')"
                >
                </base-result>
              </ion-col>
            </ion-row>
            <template v-else-if="haveVersionUpdate">
              <version-check
                :user-version="userVersion"
                :plat-form="platForm"
                :item="appVersion"
                @update-later="checkAuth()"
              >
              </version-check>
            </template>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import { useAuthenStore } from '@/stores/AuthenStore';
import { defineAsyncComponent, onMounted, ref } from 'vue';
import { useInitApp } from '@/composables/useInitApp';
import { useAuthen } from '@/composables/UseAuthen';
import { useBase } from '@/composables/UseBase';
import { useConfig } from '@/composables/UseConfig';
import { useCheckVersion } from '@/composables/UseCheckVersion';
import {
  IonRow,
  IonCol,
  IonContent,
  IonGrid,
  IonSpinner,
  IonPage,
} from '@ionic/vue';
import { useLang } from '@/composables/UseLang';
declare let window: any;

const VersionCheck = defineAsyncComponent(
  () => import('@/components/VersionCheck.vue'),
);
const BaseResult = defineAsyncComponent(
  () => import('@/components/base/Result.vue'),
);
const { t } = useLang();
const { initAuthen } = useInitApp();
const { destroyAuthDataAndRedirect } = useAuthen();
const { WeeGoTo } = useBase();
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
  // detectRoot();
  await appInitial();
});
const detectRoot = () => {
  console.log('pages.vue > detectRoot');
  if (window && window.IRoot) {
    window.IRoot.isRooted(appInitial, detectRootFailure);
  } else {
    appInitial();
  }
};
const detectRootFailure = () => {
  console.error('Device root detectRootFailure');
};

const appInitial = async (isRoot = false) => {
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
    WeeGoTo('/tabs/home', true);
  } else {
    WeeGoTo('/auth/login', true);
    // destroyAuthDataAndRedirect(false);
    // WeeGoTo('/auth/login', true);
  }
  return new Promise((resolve) => {
    resolve(true);
  });
};
</script>
<style scoped lang="scss">
ion-content {
  --background: var(--v-color-white);
}

ion-spinner {
  // --color: #fff;
  --color: var(--ion-color-primary);
}
</style>
