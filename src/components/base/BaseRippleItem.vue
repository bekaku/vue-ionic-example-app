<script setup lang="ts">
import { IonRippleEffect } from '@ionic/vue';

const { ripple = true } = defineProps<{
  ripple?: boolean
}>();
</script>

<template>
  <div v-bind="$attrs" :class="{ 'ion-activatable': ripple, 'ripple-parent': ripple }">
    <slot></slot>
    <template v-if="ripple">
      <ion-ripple-effect></ion-ripple-effect>
    </template>
  </div>
</template>

<style scoped lang="scss">
.ripple-parent {
  position: relative;
  overflow: hidden;
  border-radius: 5px;
}
</style>
