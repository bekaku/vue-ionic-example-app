<template>
  <!-- <a
      href="javascript:void(0)"
      class="ion-activatable base-link-ripple-parent app-text-link"
      :class="color"
      >{{ label }}
      <ion-ripple-effect></ion-ripple-effect>
    </a> -->

  <ion-text class="ion-activatable ripple-parent" :class="color">
    <slot name="label">
      {{ label }}
    </slot>
    <ion-ripple-effect></ion-ripple-effect>
  </ion-text>
</template>
<script setup lang="ts">
import { IonText, IonRippleEffect } from '@ionic/vue';
defineProps({
  label: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: 'text-muted',
  },
});
</script>
<style scoped lang="scss">
.ripple-parent {
  position: relative;
  overflow: hidden;
}
</style>
