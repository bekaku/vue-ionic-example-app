<script setup lang="ts">
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
} from '@ionic/vue';
const {
  flat = true,
  bordered = false,
  textCapitalize = false,
  margin = true,
  clear = false,
} = defineProps<{
  bordered?: boolean;
  flat?: boolean;
  title?: string;
  subtitle?: string;
  textCapitalize?: boolean;
  margin?: boolean;
  clear?: boolean;
}>();
</script>
<template>
  <IonCard
    v-bind="$attrs"
    :class="{
      'no-shadow': flat,
      'app-border': bordered,
      'q-ma-md': margin && !clear,
      'q-my-none': !margin,
      'no-shadow ion-no-margin no-border-radius': clear,
    }"
  >
    <!-- <img alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/card-media.png" /> -->
    <slot name="header">
      <ion-card-header v-if="title || subtitle">
        <ion-card-title v-if="title">{{ title }}</ion-card-title>
        <ion-card-subtitle
          v-if="subtitle"
          :class="{ 'ion-text-capitalize': textCapitalize }"
        >
          {{ subtitle }}
        </ion-card-subtitle>
      </ion-card-header>
    </slot>
    <slot />
  </IonCard>
</template>
