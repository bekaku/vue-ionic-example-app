<template>
  <base-layout
    page-title="404"
    fullscreen
    :scroll-y="false"
    :show-back-link="false"
  >
    <ion-card class="no-shadow">
      <ion-grid>
        <ion-row class="ion-justify-content-center">
          <ion-col>
            <div class="ion-text-center on-text-wrap">
              <h1 class="ion-padding-vertical q-text-weight-bold">Error 404</h1>
              <img
                class="ion-padding-vertical"
                src="/icons/sad_man.png"
                style="width: 50%"
              />
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
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-card>
  </base-layout>
</template>
<script setup lang="ts">
import { arrowBackOutline } from 'ionicons/icons';
import { useBase } from '@/composables/UseBase';
import { useLang } from '@/composables/UseLang';
import { defineAsyncComponent } from 'vue';
import {
  IonCard,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonIcon,
  IonButton,
} from '@ionic/vue';
const BaseLayout = defineAsyncComponent(
  () => import('@/components/base/Layout.vue'),
);
const props = defineProps({
  error: Object,
});
const { onBack } = useBase();
const { t } = useLang();
console.error(props.error);
</script>
