<script setup lang="ts">
import type { BadgeProps } from '@/types/props';
import { IonBadge, IonText } from '@ionic/vue';
import { computed } from 'vue';
const {
  floating = true,
  color,
  cssClass,
  text,
  transparent,
  rounded,
} = defineProps<BadgeProps>();

const getCssClass = computed(() => {
  return `${cssClass} ${!text ? 'no-text' : ''} ${transparent ? 'transparent' : ''}`;
});
</script>
<template>
  <ion-badge
    v-bind="$attrs"
    :floating
    :color
    :class="getCssClass"
    :style="cssStyle"
  >
    <slot>
      <IonText :color="text ? undefined : color">{{ text || '.' }}</IonText>
    </slot>
  </ion-badge>
</template>
<style lang="css" scoped>
ion-badge.no-text {
  width: 14px;
  height: 14px;
  --padding-bottom: 0;
  --padding-end: 0;
  --padding-start: 0;
  --padding-top: 0;
}
ion-badge.transparent {
  opacity: 0.85;
}
</style>
