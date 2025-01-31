<template>
  <!-- <ion-row class="ion-align-items-center" style="height: 100vh">
    <ion-col class="ion-no-padding">
      <swiper
        style="height: 100vh" -->
  <ion-row class="ion-align-items-center">
    <ion-col class="ion-no-padding">
      <base-swiper-slides :paramiters="slideOpts" @on-slide-change="onSlideChange">
        <template v-if="items.length > 0">
          <swiper-slide v-for="(item, index) in items" :key="index">
            <ion-row class="ion-align-items-center" style="height: 90vh; max-height: 90%">
              <div class="swiper-zoom-container">
                <img class="swiper-zoom-target" style="width: 100%; height: auto" :src="item.filePath" />
              </div>
            </ion-row>
          </swiper-slide>
        </template>
        <template v-else-if="images.length > 0">
          <swiper-slide v-for="(item, index) in images" :key="index">
            <ion-row class="ion-align-items-center" style="height: 90vh; max-height: 90%" :style="isAppPlatfrom('ios') ? 'height: -webkit-fill-available' : ''
              ">
              <div class="swiper-zoom-container">
                <ion-img style="width: 100%; height: auto" class="swiper-zoom-target" :src="item.image"></ion-img>
              </div>
            </ion-row>
          </swiper-slide>
        </template>
      </base-swiper-slides>
    </ion-col>
  </ion-row>
</template>
<script setup lang="ts">
import BaseSwiperSlides from '@/components/base/SwiperElementSlides.vue';
import { useDevice } from '@/composables/useDevice';
import type { FileManagerDto, ImageDto } from '@/types/models';
import type { PropType } from 'vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';

import { useTheme } from '@/composables/useTheme';
import type { SlideOptions } from '@/types/common';
import { IonCol, IonImg, IonRow } from '@ionic/vue';
const props = defineProps({
  items: {
    type: Array as PropType<FileManagerDto[]>,
    default: () => [],
  },
  images: {
    type: Array as PropType<ImageDto[]>,
    default: () => [],
  },
  selectedIndex: {
    type: Number,
    default: 0,
  },
});
const emit = defineEmits(['on-slide-change']);
const slideOpts = ref<SlideOptions>({
  speed: 400,
  slidesPerView: 1,
  spaceBetween: 0,
  centeredSlides: false,
  pagination: true,
  initialSlide: props.selectedIndex,
  zoom: true,
});
const { isAppPlatfrom } = useDevice();
const defaultDark = ref<boolean>(false);
const { isDark, onSetTheme } = useTheme();
onMounted(() => {
  defaultDark.value = isDark.value;
  onSetTheme('dark');
});
onBeforeUnmount(() => {
  if (!defaultDark.value) {
    onSetTheme('light');
  }
});

const onSlideChange = (e: any) => {
  if (e && e.length > 0) {
    const activeSlide = e[0];
    if (activeSlide) {
      emit('on-slide-change', activeSlide.realIndex);
    }
  }
};
</script>
