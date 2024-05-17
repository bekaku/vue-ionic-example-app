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
import { useBase } from '@/composables/UseBase';
import { PropType } from 'vue';
import { IonRow, IonSpinner, IonCol } from '@ionic/vue';
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
const { isDark } = useBase();
</script>
