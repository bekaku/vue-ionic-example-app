<script setup lang="ts">
import { IonRippleEffect } from '@ionic/vue';

const emit = defineEmits<{
  'on-press': [event: any]
}>()
const onPress = (event: any) => {
  emit('on-press', event)
}
</script>

<template>
  <div v-bind="$attrs" class="ion-activatable ripple-parent" @click="onPress">
      <slot />
    <ion-ripple-effect></ion-ripple-effect>
  </div>
</template>

<style scoped lang="scss">
.ripple-parent {
  position: relative;
  overflow: hidden;
  border-radius: 5px;
}
</style>
