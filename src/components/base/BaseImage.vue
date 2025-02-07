<template>
  <!-- <ion-img
      :src="completed ? src : '/icon.png'"
      @ion-error="onError"
      @ion-img-did-load="onImgDidLoad"
      @ion-img-will-load="onImgWillLoad"
    /> -->
  <div v-if="src" v-bind="$attrs" class="q-img q-img--menu" role="img">
    <div :style="{ paddingBottom: imgRatio + '%' }"></div>
    <div class="q-img__container q-absolute-full" :class="{ 'bg-black': !completed }">
      <ion-img :src="srcUrl" class="q-img__image q-img__image--with-transition q-img__image--loaded"
        :class="{ 'q-absolute-center': !completed, 'img-bg': imageBg }" :alt loading="lazy" fetchpriority="auto"
        aria-hidden="true" draggable="false" :style="!completed
          ? 'width: 0px'
          : `object-fit: ${fit}; object-position: 50% 50%`
          " @ion-error="onError" @ion-img-did-load="onImgDidLoad" @ion-img-will-load="onImgWillLoad" />
    </div>
    <ion-spinner v-if="!completed || loading" name="crescent" class="q-absolute-center text-white"
      :class="loadingColor"></ion-spinner>
    <div class="q-img__content q-absolute-full q-anchor--skip"></div>
    <slot />
  </div>
</template>
<script setup lang="ts">
// <base-image v-if="src" :class="`shadow-${shadow}`" :src="src" ratio="4/3"></base-image>
import FileManagerService from '@/api/FileManagerService';
import type { ImgRatioType } from '@/types/common';
import { IonImg, IonSpinner } from '@ionic/vue';
import { computed, onBeforeUnmount, ref, watchEffect } from 'vue';

const { src, alt = 'img', ratio = '1', loadingColor = 'text-white', fetch = false, fit = 'cover', imageBg = false } = defineProps<{
  src?: string
  placeHolder?: string
  alt?: string
  ratio?: ImgRatioType
  loadingColor?: string
  fetch?: boolean
  imageBg?: boolean
  fit?: 'cover' | 'fill' | 'contain' | 'none' | 'scale-down'// 4 / 3
}>();
const { fethCdnData } = FileManagerService();

const completed = ref(false);
const error = ref(false);
const contentTimeOut = ref();
const srcUrl = ref<any>();
const loading = ref(true);
const firstLoaded = ref(false);
const onError = () => {
  error.value = true;
};
const onImgDidLoad = () => {
  completed.value = true;
};
const onImgWillLoad = () => { };
const imgRatio = computed(() =>
  ratio == '1' ? '100' : ratio == '4/3' ? '75' : '56.25',
);

const onFetchImage = async () => {
  if (!src) {
    loading.value = false;
    return;
  }
  if (fetch) {
    console.log('onFetchImage', src);
    fethCdnData(src)
      .then((res) => {
        clearLoading();
        if (res) {
          srcUrl.value = res;
        }
      })
      .catch(() => {
        clearLoading();
      });
  } else {
    srcUrl.value = src;
    onLoad();
    clearLoading();
  }
};
const onLoad = () => {
  const img = document.querySelector('img');
  if (img) {
    if (img.complete) {
      onImgDidLoad();
    } else {
      img.addEventListener('load', onImgDidLoad);
      img.addEventListener('error', () => {
        onError();
      });
    }
  }
};
const clearLoading = () => {
  loading.value = false;
  if (!firstLoaded.value) {
    firstLoaded.value = true;
  }
};
watchEffect(() => {
  if (src) {
    onFetchImage();
  }
});
onBeforeUnmount(() => {
  if (contentTimeOut.value) {
    clearTimeout(contentTimeOut.value);
    contentTimeOut.value = null;
  }
});
</script>
<style lang="sass" scoped>
// @import '@/assets/css/image.sass'
$img-loading-font-size: 50px !default
$img-content-position: absolute !default
$img-content-padding: 16px !default
$img-content-color: #fff !default
$img-content-background: rgba(0, 0, 0, .47) !default
.q-img
  position: relative
  width: 100%
  display: inline-block
  vertical-align: middle
  overflow: hidden

  &__loading .q-spinner
    font-size: $img-loading-font-size

  &__container
    border-radius: inherit
    font-size: 0

  &__image
    border-radius: inherit
    width: 100%
    height: 100%
    opacity: 0

    &--with-transition
      transition: opacity .28s ease-in

    &--loaded
      opacity: 1

  &__content
    border-radius: inherit
    pointer-events: none

    > div
      pointer-events: all
      position: $img-content-position
      padding: $img-content-padding
      color: $img-content-color
      background: $img-content-background

  &--no-menu
    .q-img__image,
    .q-img__placeholder
      pointer-events: none

.img-bg
  background: #000000
  background: -webkit-linear-gradient(to bottom, #434343, #000000)
  background: linear-gradient(to bottom, #434343, #000000)

body[color-theme='dark']
  .img-bg
    background: #000000
</style>
