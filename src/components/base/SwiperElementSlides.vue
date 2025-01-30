<template>
  <swiper-container
    class="cursor-pointer"
    v-bind="$attrs"
    v-if="showSlide"
    :keyboard="opts?.keyboard"
    :pagination="opts?.pagination"
    :navigation="opts?.navigation"
    :scrollbar="opts?.scrollbar"
    :zoom="opts?.zoom"
    :initial-slide="opts?.initialSlide"
    :lazy="opts?.lazy"
    :style="opts?.style"
    :autoplay="opts?.autoplay"
    :speed="opts?.speed"
    :slides-per-view="opts?.slidesPerView"
    :space-between="opts?.spaceBetween"
    :centered-slides="opts?.centeredSlides"
    :pagination-dynamic-bullets="opts?.paginationDynamic"
    :pagination-type="opts?.paginationType"
    :direction="opts?.direction"
    :loop="opts?.loop"
    :effect="opts?.effect"
    :allow-touch-move="opts?.allowTouchMove"
    @swiperslidechange="onSlideChange"
  >
    <slot />
  </swiper-container>
</template>
<script setup lang="ts">
import type { PropType } from 'vue';
import { ref, onMounted, watch, useTemplateRef, onBeforeUnmount } from 'vue';
import type { SlideOptions, SlidePaginationy } from '@/types/Common';
import { register } from 'swiper/element/bundle';

const props = withDefaults(defineProps<Props>(), {
  max: 0
});

const emit = defineEmits(['on-slide-change']);

register();

interface Props {
  paramiters: SlideOptions
  max?: number
}

type SlideAction = 'next' | 'prev';
const baseSwiperRef = useTemplateRef<any>('baseSwiperRef');
const showSlide = ref(false);
const opts = ref<SlideOptions>();
const modules = ref<any[]>([]);
const swiperRef = ref<any>(undefined);
const currentIndex = defineModel('currentIndex', { type: Number, default: 0 });
const slideAction = defineModel('slideAction', {
  type: String as PropType<SlideAction | undefined>,
  default: undefined
});
const swiperEl = ref<any>();
const initialTimeout = ref<any>(null);
onMounted(async () => {
  await onInitSwiper();
  await initSlides();
  showSlide.value = true;
});
const initSlides = () => {
  return new Promise((resolve) => {
    const params = props.paramiters;
    let initPagination: SlidePaginationy | undefined;
    if (params?.pagination != undefined) {
      if ((typeof params?.pagination === 'boolean')) {
        initPagination = {
          enabled: params?.pagination
        };
      } else {
        initPagination = params?.pagination;
      }
    }
    opts.value = {
      keyboard: params?.keyboard || false,
      pagination: initPagination,
      navigation: params?.navigation || false,
      scrollbar: params?.scrollbar || false,
      allowTouchMove: params?.allowTouchMove != undefined ? params.allowTouchMove : true,
      updateOnWindowResize: params?.updateOnWindowResize || false,
      zoom: params?.zoom || false,
      initialSlide: params?.initialSlide || 0,
      slidesPerGroup: params?.slidesPerGroup || 0,
      freeMode: params?.freeMode || false,
      lazy: params?.lazy || true,
      style: params?.style || {
        '--swiper-navigation-color': '#00aba9',
        '--swiper-pagination-color': '#00aba9',
        '--swiper-navigation-size': '20px',
        '--swiper-navigation-top-offset': '50%',
        '--swiper-navigation-sides-offset': '5px'
      },
      speed: params?.speed || 300,
      slidesPerView: params?.slidesPerView || 1,
      spaceBetween: params?.spaceBetween || 0,
      centeredSlides: params?.centeredSlides || false,
      autoplay: params?.autoplay || false,
      paginationDynamic: params?.paginationDynamic || true,
      paginationType: params?.paginationType || 'bullets',
      direction: params?.direction || 'horizontal',
      loop: params?.loop || false,
      effect: params?.effect || 'slide'
    };
    resolve(true);
  });
};
const onSlideChange = (e: any) => {
  if (e.detail) {
    emit('on-slide-change', e.detail);
  }
};
const onInitSwiper = () => {
  return new Promise((resolve) => {
    initialTimeout.value = setTimeout(() => {
      swiperEl.value = document.querySelector('swiper-container');
    }, 500);
    resolve(true);
  });
};
const onNext = () => {
  if (swiperEl.value) {
    swiperEl.value.swiper.slideNext();
  }
};
const onPrev = () => {
  if (swiperEl.value) {
    swiperEl.value.swiper.slidePrev();
  }
};
watch(slideAction, (newAction) => {
  if (newAction != undefined) {
    if (newAction == 'next') {
      onNext();
    } else if (newAction == 'prev') {
      onPrev();
    }
  }
  slideAction.value = undefined;
});
onBeforeUnmount(() => {
  if (initialTimeout.value) {
    clearTimeout(initialTimeout.value);
    initialTimeout.value = null;
  }
});
defineExpose({
  onNext,
  onPrev
});
</script>
