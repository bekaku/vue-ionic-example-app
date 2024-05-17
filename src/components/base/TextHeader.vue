<template>
  <ion-list-header>
    <ion-label>
      <slot name="icon">
        <ion-icon v-if="icon" :icon="icon" class="q-mr-sx"></ion-icon>
      </slot>
      {{ label }}
    </ion-label>
  </ion-list-header>
</template>
<script setup lang="ts">
import { IonLabel, IonListHeader, IonIcon } from '@ionic/vue';

interface Props {
  label: string;
  icon?: string;
}

withDefaults(defineProps<Props>(), {});
</script>