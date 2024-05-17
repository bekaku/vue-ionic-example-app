<template>
  <ion-avatar
    v-if="src"
    :style="`width: ${size}px; height: ${size}px; ${
      borderColor
        ? 'border:' + borderWidth + 'px solid ' + borderColor + ';'
        : ''
    }`"
  >
    <!-- <ion-img :src="src" alt="avatar"></ion-img> -->
    <base-image
      style="border-radius: 100%"
      :src="src"
      alt="avatar"
      :fetch="fetch"
    ></base-image>
  </ion-avatar>
</template>
<script setup lang="ts">
import { PropType } from 'vue';
import { IonAvatar } from '@ionic/vue';
import BaseImage from '@/components/base/Image.vue';
defineProps({
  src: {
    type: String as PropType<string | undefined>,
    default: undefined,
  },
  size: {
    type: Number,
    default: 34,
  },
  borderColor: {
    type: String,
    default: undefined,
  },
  borderWidth: {
    type: Number,
    default: 0,
  },
  fetch: {
    type: Boolean,
    default: false,
  },
});
</script>
