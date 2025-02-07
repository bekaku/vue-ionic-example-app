<script setup lang="ts">
import Hammer from 'hammerjs';
import { useTemplateRef, onBeforeUnmount, onMounted, ref } from 'vue';
const { time = 350 } = defineProps<{ time?: number }>();
const emit = defineEmits(['on-long-press']);
const longPressItemRef = useTemplateRef<InstanceType<typeof HTMLElement> | null>('longPressItemRef');
const hammer = ref<any>();
onMounted(() => {
  initHammer();
});
const initHammer = () => {
  if (longPressItemRef.value) {
    hammer.value = new Hammer(longPressItemRef.value);
    // Configure the press gesture options
    hammer.value.get('press').set({
      time, // Set custom long press duration
    });
    hammer.value.on('press', (ev: any) => {
      emit('on-long-press', ev);
    });
  }
};
onBeforeUnmount(() => {
  if (hammer.value) {
    hammer.value.off('press');
  }
});
</script>

<template>
  <div v-bind="$attrs" ref="longPressItemRef">
    <slot></slot>
  </div>
</template>
