<template>
  <ion-page>
    <ion-header>
      <base-toolbar>
        <ion-buttons slot="start">
          <base-back-button default-href="/tabs/other"></base-back-button>
        </ion-buttons>
        <ion-title> {{ t('base.about') }}</ion-title>
      </base-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" :scroll-y="true">
      <ion-card class="card-clear q-centered-vertical">
        <ion-card-content>
          <div class="q-pa-md ion-text-center">
            <div class="q-text-h5 q-text-weight-bold">
              {{ t('app.fullName') }}
            </div>

            <div class="q-text-caption q-text-muted q-mt-lg">
              <p>{{ t('app.appVersion', [userVersion]) }}</p>
            </div>
            <template v-if="loading">
              <div class="ion-text-center">
                <ion-spinner name="dots"></ion-spinner>
              </div>
            </template>
            <template v-else>
              <template v-if="haveVersionUpdate">
                <version-check
                  :user-version="userVersion"
                  :plat-form="platForm"
                  :item="appVersion"
                  :show-help="false"
                  :show-icon="true"
                  :show-later="false"
                >
                </version-check>
              </template>

              <div v-else class="q-text-caption q-text-muted q-mt-lg">
                <p>{{ t('base.latestVersionHelp') }}</p>
              </div>
            </template>

            <div class="q-text-caption q-text-muted q-mt-lg">
              <p>
                {{ t('base.termAcceptText') }}
                <a class="app-text-link" :href="PolicyLink" target="_blank">
                  {{ t('base.termAcceptText2') }}
                </a>
              </p>
            </div>
          </div>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref } from 'vue';
import { useLang } from '@/composables/UseLang';
import { useCheckVersion } from '@/composables/UseCheckVersion';

import BaseToolbar from '@/components/base/Toolbar.vue';
import BaseBackButton from '@/components/base/BackButton.vue';
import {
  IonPage,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonCardContent,
  IonCard,
  IonSpinner,
} from '@ionic/vue';
import { PolicyLink } from '@/utils/Constant';
const VersionCheck = defineAsyncComponent(
  () => import('@/components/VersionCheck.vue'),
);

const { t } = useLang();
const { checkVersion, appVersion, platForm, haveVersionUpdate, userVersion } =
  useCheckVersion();
const loading = ref(true);
onMounted(async () => {
  await checkVersion();
  loading.value = false;
});
</script>
<style scoped lang="scss">
ion-content {
  --background: var(--v-color-white);
}
</style>
