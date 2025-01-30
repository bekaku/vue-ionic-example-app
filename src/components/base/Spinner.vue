<template>
  <ion-row
    class="ion-align-items-center"
    :style="fullHeight ? 'height: 80vh; overflow-y: hidden' : undefined"
  >
    <ion-col class="ion-text-center">
      <ion-spinner :class="color" :name="name"></ion-spinner>
      <template v-if="label">
        <div class="text-muted">{{ label }}</div>
      </template>
    </ion-col>
  </ion-row>
</template>
<script setup lang="ts">
import { IonCol, IonRow, IonSpinner } from '@ionic/vue';
import type { PropType } from 'vue';
defineProps({
  label: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: 'text-primary',
  },
  name: {
    type: String as PropType<
      | 'bubbles'
      | 'circles'
      | 'circular'
      | 'crescent'
      | 'dots'
      | 'lines'
      | 'lines-sharp'
      | 'lines-sharp-small'
      | 'lines-small'
      | undefined
    >,
    default: 'dots',
  },
  fullHeight: {
    type: Boolean,
    default: false,
  },
});
</script>
