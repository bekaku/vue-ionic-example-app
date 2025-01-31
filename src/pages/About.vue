<template>
  <base-layout :page-title="t('base.about')" show-back-link>
    <template #content>
      <ion-content :scroll-events="true" fullscreen scroll-y>
        <ion-row class="ion-align-items-center" style="height: 100%;">
          <BaseCard flat>
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
                    <version-check :user-version="userVersion" :plat-form="platForm" :item="appVersion"
                      :show-help="false" :show-icon="true" :show-later="false">
                    </version-check>
                  </template>

                  <div v-else class="q-text-caption q-text-muted q-mt-lg">
                    <p>{{ t('base.latestVersionHelp') }}</p>
                  </div>
                </template>

                <div class="q-text-caption q-mt-lg">
                  <p>
                    {{ t('base.termAcceptText') }}
                    <!-- <a class="app-text-link" :href="PolicyLink" target="_blank">
                  {{ t('base.termAcceptText2') }}
                </a> -->
                    <BaseLink :to="PolicyLink" external>
                      {{ t('base.termAcceptText2') }}
                    </BaseLink>
                  </p>
                </div>
              </div>
            </ion-card-content>
          </BaseCard>
        </ion-row>
      </ion-content>
    </template>
  </base-layout>
</template>
<script setup lang="ts">
import { useCheckVersion } from '@/composables/useCheckVersion';
import { useLang } from '@/composables/useLang';
import { defineAsyncComponent, onMounted, ref } from 'vue';

import BaseLayout from '@/components/base/BaseLayout.vue';
import BaseLink from '@/components/base/BaseLink.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import { PolicyLink } from '@/libs/constant';
import {
  IonCardContent,
  IonRow,
  IonSpinner,
  IonContent
} from '@ionic/vue';
const VersionCheck = defineAsyncComponent(
  () => import('@/components/VersionCheck.vue'),
);

const { t } = useLang();
const { checkVersion, appVersion, platForm, haveVersionUpdate, userVersion }
  = useCheckVersion();
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
