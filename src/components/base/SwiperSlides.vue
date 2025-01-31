<template>
  <swiper
      ref="swiperRef"
      v-if="showSlide"
      :modules="modules"
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
      :allow-touch-move="opts?.allowTouchMove"
      @slide-change="onSlideChange"
  >
    <slot />
  </swiper>
  <ion-row
      v-if="paramiters?.navigationCustom"
      class="ion-justify-content-between"
  >
    <ion-col class="ion-no-padding ion-no-margin">
      <ion-button
          :disabled="currentIndex == 0"
          fill="clear"
          class="ion-text-capitalize"
          @click="onPrev"
      >
        {{ t('base.previous') }}
        <ion-icon slot="start" :icon="arrowBackOutline"></ion-icon>
      </ion-button>
    </ion-col>
    <ion-col class="ion-no-padding ion-no-margin ion-text-right">
      <ion-button
          v-if="currentIndex < max"
          fill="clear"
          class="ion-text-capitalize"
          @click="onNext"
      >
        {{ t('base.continue') }}
        <ion-icon slot="end" :icon="arrowForwardOutline"></ion-icon>
      </ion-button>
    </ion-col>
  </ion-row>
</template>
<script setup lang="ts">
import type { PropType } from 'vue';
import { onMounted, ref, watch } from 'vue';
import type { SlideOptions } from '@/types/common';
import {
  Autoplay,
  Keyboard,
  Scrollbar,
  Zoom,
  Navigation,
  Pagination,
  Thumbs,
} from 'swiper/modules';
import { Swiper } from 'swiper/vue';
import { IonRow, IonCol, IonButton, IonIcon } from '@ionic/vue';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/keyboard';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import 'swiper/css/zoom';
import 'swiper/css/thumbs';
// import 'swiper/css/lazy';
import '@ionic/vue/css/ionic-swiper.css';
import { arrowForwardOutline, arrowBackOutline } from 'ionicons/icons';
import { useLang } from '@/composables/useLang';

interface Props {
  paramiters: SlideOptions
  max?: number
}

type SlideAction = 'next' | 'prev';

const props = withDefaults(defineProps<Props>(), {
  max: 0,
});
const { t } = useLang();
const showSlide = ref(false);
const opts = ref<SlideOptions>();
const modules = ref<any[]>([]);
const swiperRef = ref<any>(undefined);
// const currentIndex = ref(0);
const currentIndex = defineModel('currentIndex', { type: Number, default: 0 });
const slideAction = defineModel('slideAction', { type: String as PropType<SlideAction | undefined>, default: undefined });
onMounted(async () => {
  await initSlides();
  showSlide.value = true;
});
const initSlides = () => {
  return new Promise((resolve) => {
    const params = props.paramiters;
    if (params?.keyboard) {
      modules.value.push(Keyboard);
    }
    if (params?.pagination) {
      modules.value.push(Pagination);
    }
    if (params?.navigation) {
      modules.value.push(Navigation);
    }
    if (params?.scrollbar) {
      modules.value.push(Scrollbar);
    }
    if (params?.zoom) {
      modules.value.push(Zoom);
    }
    if (params?.autoplay) {
      modules.value.push(Autoplay);
    }
    if (params?.thumbs) {
      modules.value.push(Thumbs);
    }

    // if (params?.lazy) {
    //   modules.value.push(Lazy);
    // }
    opts.value = {
      keyboard: params?.keyboard ? params.keyboard : false,
      allowTouchMove: params?.allowTouchMove !=undefined ? params.allowTouchMove : true,
      pagination: params?.pagination ? params.pagination : false,
      navigation: params?.navigation ? params.navigation : false,
      scrollbar: params?.scrollbar ? params.scrollbar : false,
      updateOnWindowResize: params?.updateOnWindowResize
          ? params.updateOnWindowResize
          : false,
      zoom: params?.zoom ? params.zoom : false,
      initialSlide: params?.initialSlide ? params.initialSlide : 0,
      slidesPerGroup: params?.slidesPerGroup ? params.slidesPerGroup : 0,
      freeMode: params?.freeMode ? params.freeMode : false,
      lazy: params?.lazy ? params.lazy : true,
      style: params?.style
          ? params.style
          : {
            '--swiper-navigation-color': '#00aba9',
            '--swiper-pagination-color': '#00aba9',
          },
      speed: params?.speed ? params.speed : 300,
      slidesPerView: params?.slidesPerView ? params.slidesPerView : 1,
      spaceBetween: params?.spaceBetween ? params.spaceBetween : 0,
      centeredSlides: params?.centeredSlides ? params.centeredSlides : false,
      autoplay: params?.autoplay ? params.autoplay : false,
    };
    resolve(true);
  });
};
const onSlideChange = (e: any) => {
  currentIndex.value = e.realIndex;
};

const onNext = () => {
  swiperRef.value.$el.swiper.slideNext();
};
const onPrev = () => {
  swiperRef.value.$el.swiper.slidePrev();
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
</script>
