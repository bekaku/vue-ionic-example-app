<template>
  <ion-avatar
    v-bind="$attrs"
    :style="`width: ${size}px; height: ${size}px;`"
    :class="{ rounded: rounded }"
  >
    <slot>
      <template v-if="!fetchImage">
        <ion-img v-if="src" :src="src"></ion-img>
      </template>
      <template v-else>
        <app-image
          :src="src"
          :style="`width: ${size}px; height: ${size}px;`"
          :circle="!rounded"
          :rounded="rounded"
        ></app-image>
      </template>

      <slot name="extra"></slot>
    </slot>

    <!-- <img v-if="src" :src="src" /> -->

    <!-- <base-image v-if="src" :class="`shadow-${shadow}`" :src="src" ratio="4/3"></base-image> -->
  </ion-avatar>
</template>
<script setup lang="ts">
import { PropType } from 'vue';
import { IonAvatar, IonImg } from '@ionic/vue';
import BaseImage from '@/components/base/Image.vue';
import AppImage from '@/components/base/AppImage.vue';
defineProps({
  src: {
    type: String as PropType<string>,
    default: undefined,
  },
  spinnerColor: {
    type: String as PropType<string>,
    default: 'white',
  },
  imgBg: {
    type: String as PropType<string>,
    default: 'bg-grey-8',
  },
  ratio: {
    type: Number as PropType<number | undefined>,
    default: 4 / 3,
  },
  size: {
    type: Number,
    default: 32,
  },
  square: {
    type: Boolean,
    default: false,
  },
  rounded: {
    type: Boolean,
    default: false,
  },
  fetchImage: {
    type: Boolean,
    default: false,
  },
  shadow: {
    type: Number,
    default: 0,
  },
});
</script>
<style scoped>
ion-avatar.rounded {
  --border-radius: 4px;
}
</style>
