<script setup lang="ts">
import type { SlideOptions, SlidePaginationy, SwiperSlideChange } from '@/types/common';
import { IonCol, IonRow } from '@ionic/vue';
import { register } from 'swiper/element/bundle';
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue';
import BaseSpinner from './BaseSpinner.vue';
register();
const { params, zoomMaxRatio = 4, initialTimeout = 500 } = defineProps<{
  params: SlideOptions;
  zoomMaxRatio?: number;
  initialTimeout?: number
}>();

const emit = defineEmits<{
  'on-slide-change': [t: SwiperSlideChange]
}>()
const zoomRatio = ref<number>(1);
const swiperElRef = useTemplateRef<any>('swiperElRef');
// const currentIndex = defineModel<number>('currentIndex', { default: 0 });
const showSlide = ref(false);
const showTimeout = ref<any>();
onMounted(() => {
  showTimeout.value = setTimeout(() => {
    showSlide.value = true
  }, initialTimeout);
})
const getPagination = computed(() => {
  let initPagination: SlidePaginationy | undefined;
  if (params?.pagination != undefined) {
    if (typeof params?.pagination === 'boolean') {
      initPagination = {
        enabled: params?.pagination,
      };
    } else {
      initPagination = params?.pagination;
    }
  }
  return initPagination;
})
const onSlideChange = (e: any) => {
  if (e && e.detail && e.detail.length > 0) {
    const activeSlide = e.detail[0];
    if (activeSlide) {
      emit('on-slide-change', {
        activeIndex: activeSlide.activeIndex,
        realIndex: activeSlide.realIndex,
      });
    }
  }
};
const onNext = () => {
  if (swiperElRef.value) {
    swiperElRef.value.swiper.slideNext();
  }
};
const onPrev = () => {
  if (swiperElRef.value) {
    swiperElRef.value.swiper.slidePrev();
  }
};
const onZoomIn = () => {
  if (swiperElRef.value) {
    if (zoomRatio.value < zoomMaxRatio) {
      zoomRatio.value++;
    }
    swiperElRef.value.swiper.zoom.in(zoomRatio.value);
  }
};
const onZoomOut = () => {
  zoomRatio.value = 1;
  if (swiperElRef.value) {
    swiperElRef.value.swiper.zoom.out();
  }
};
onBeforeUnmount(() => {
  if (showTimeout.value) {
    clearTimeout(showTimeout.value);
    showTimeout.value = undefined;
  }
})
defineExpose({
  onNext,
  onPrev,
  onZoomIn,
  onZoomOut
});
</script>
<template>
  <IonRow>
    <IonCol class="ion-no-padding">
      <BaseSpinner v-if="!showSlide" />
      <slot name="start" />
      <swiper-container v-if="showSlide && params" ref="swiperElRef" v-bind="$attrs"
        :keyboard="params?.keyboard || false" :pagination="getPagination" :navigation="params?.navigation || false"
        :scrollbar="params?.scrollbar || false" :zoom="params?.zoom || false" :initial-slide="params?.initialSlide || 0"
        :lazy="params?.lazy || true" :style="params?.style || {
          '--swiper-navigation-color': '#2e86de',
          '--swiper-pagination-color': '#2e86de',
          '--swiper-navigation-size': '20px',
          '--swiper-navigation-top-offset': '50%',
          '--swiper-navigation-sides-offset': '5px',
        }" :autoplay="params?.autoplay || false" :speed="params?.speed || 400"
        :slides-per-view="params?.slidesPerView || 1" :space-between="params?.spaceBetween || 0"
        :centered-slides="params?.centeredSlides || false"
        :pagination-dynamic-bullets="params?.paginationDynamic || false"
        :pagination-type="params?.paginationType || 'bullets'" :direction="params?.direction || 'horizontal'"
        :loop="params?.loop || false" :effect="params?.effect || 'slide'"
        :allow-touch-move="params?.allowTouchMove != undefined ? params.allowTouchMove : true"
        :update-on-window-resize="params?.updateOnWindowResize || false" :slides-per-group="params?.slidesPerGroup || 1"
        :pagination-clickable="params?.paginationClickable || true" :grid-rows="params?.gridRows || 1"
        :grab-cursor="params?.grabCursor || false" @swiperslidechange="onSlideChange">
        <slot />
      </swiper-container>

      <slot name="end" />
    </IonCol>
  </IonRow>
</template>