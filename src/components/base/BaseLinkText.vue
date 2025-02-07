<template>
  <ion-text v-bind="$attrs" class="ion-activatable ripple-parent radius" :class="color">
    <slot name="label">
      {{ label }}
    </slot>
    <ion-ripple-effect></ion-ripple-effect>
  </ion-text>
</template>
<script setup lang="ts">
import { IonText, IonRippleEffect } from '@ionic/vue';
const {
  color = 'text-muted'
} = defineProps<{
  label?: string
  color?: string
}>()
</script>
<style scoped lang="scss">
ion-text {
  border-radius: 18px !important;
}

.ripple-parent {
  position: relative;
  overflow: hidden;
}
</style>
