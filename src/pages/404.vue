<template>
  <base-layout page-title="404" fullscreen :scroll-y="false" :show-back-link="false">
    <ion-row class="ion-justify-content-center ion-align-items-center" style="height: 85vh;">
      <div class="ion-text-center on-text-wrap">
        <h1 class="ion-padding-vertical q-text-weight-bold">Error 404</h1>
        <img class="ion-padding-vertical" src="/icons/sad_man.png" style="width: 80%" />
        <ion-text class="q-text-muted">
          <p>
            {{ t('error.404') }}
          </p>
        </ion-text>

        <ion-button @click="onBack" fill="outline">
          <ion-icon slot="start" :icon="arrowBackOutline" />
          {{ t('base.back') }}
        </ion-button>
      </div>
    </ion-row>
  </base-layout>
</template>
<script setup lang="ts">
import BaseLayout from '@/components/base/BaseLayout.vue';
import { useBase } from '@/composables/useBase';
import { useLang } from '@/composables/useLang';
import {
  IonButton,
  IonIcon,
  IonRow,
  IonText
} from '@ionic/vue';
import { arrowBackOutline } from 'ionicons/icons';
const props = defineProps({
  error: Object,
});
const { onBack } = useBase();
const { t } = useLang();
console.error(props.error);
</script>
