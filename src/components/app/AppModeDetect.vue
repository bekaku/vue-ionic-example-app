<template>
  <ion-chip v-bind="$attrs" v-if="isTestMode() || isDevelopMode()">
    <ion-label> {{ `${isTestMode() ? 'Test' : 'Develop'}` }} mode</ion-label>
    <ion-icon :icon="bugOutline"></ion-icon>
  </ion-chip>
</template>
<script setup lang="ts">
import { IonChip, IonLabel, IonIcon } from '@ionic/vue'
import { useConfig } from '@/composables/useConfig';
import { bugOutline } from 'ionicons/icons'

const { isTestMode, isDevelopMode } = useConfig();
</script>
