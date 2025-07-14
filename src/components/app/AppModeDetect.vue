<template>
  <ion-chip v-if="isTestMode() || isDevelopMode()" v-bind="$attrs" color="warning">
    <ion-label>
      {{ `${isTestMode() ? 'Test' : 'Develop'}` }} mode
      <p style="font-size: 10px">{{ currentApi }}</p>
    </ion-label>
    <ion-icon :icon="bugOutline"></ion-icon>
  </ion-chip>
</template>
<script setup lang="ts">
import { IonChip, IonLabel, IonIcon } from '@ionic/vue';
import { useConfig } from '@/composables/useConfig';
import { bugOutline } from 'ionicons/icons';

const { isTestMode, isDevelopMode, getConfig } = useConfig();
const currentApi = getConfig('apiBaseUrl');
</script>
