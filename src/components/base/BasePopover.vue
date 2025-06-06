<script setup lang="ts">
import { IonContent, IonPopover } from '@ionic/vue';
const { padding = true, width = '250px' } = defineProps<{
  event?: Event;
  padding?: boolean;
  width?: string;
}>();
defineEmits<{
  'on-close': [];
}>();
const modelValue = defineModel<boolean>({ default: false });
</script>
<template>
  <ion-popover
    :is-open="modelValue"
    :event="event"
    @did-dismiss="$emit('on-close')"
  >
    <ion-content :class="{ 'ion-padding': padding }">
      <slot />
    </ion-content>
  </ion-popover>
</template>
<style scoped lang="scss">
ion-popover {
  /* --width: 355px; */
  &::part(content) {
    min-width: v-bind(width);
  }
}
body[color-theme='dark'] {
  ion-content {
    --background: var(--color-zinc-800) !important;
  }
}
</style>
