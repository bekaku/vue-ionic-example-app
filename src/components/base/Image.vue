<template>
  <!-- <ion-img
      :src="completed ? src : '/icon.png'"
      @ion-error="onError"
      @ion-img-did-load="onImgDidLoad"
      @ion-img-will-load="onImgWillLoad"
    /> -->

  <div class="q-img q-img--menu" role="img" v-bind="$attrs">
    <div :style="{ paddingBottom: imgRatio + '%' }"></div>
    <div
      class="q-img__container q-absolute-full"
      :class="{ 'bg-black': !completed }"
    >
      <ion-img
        :src="srcUrl"
        class="q-img__image q-img__image--with-transition q-img__image--loaded"
        :class="{ 'q-absolute-center': !completed }"
        loading="lazy"
        fetchpriority="auto"
        aria-hidden="true"
        draggable="false"
        :style="
          !completed
            ? 'width: 0px'
            : 'object-fit: cover; object-position: 50% 50%'
        "
        @ion-error="onError"
        @ion-img-did-load="onImgDidLoad"
        @ion-img-will-load="onImgWillLoad"
      ></ion-img>

      <slot />
    </div>
    <ion-spinner
      v-if="!completed || loading"
      name="crescent"
      class="q-absolute-center text-white"
      :class="loadingColor"
    ></ion-spinner>
    <div class="q-img__content q-absolute-full q-anchor--skip"></div>
  </div>
</template>
<script setup lang="ts">
// <base-image v-if="src" :class="`shadow-${shadow}`" :src="src" ratio="4/3"></base-image>
import { computed, onBeforeUnmount, onMounted, PropType, ref } from 'vue';
import { ImgRatioType } from '@/types/Common';
import { IonImg, IonSpinner } from '@ionic/vue';
import FileManagerService from '@/api/FileManagerService';
const props = defineProps({
  src: {
    type: String,
    default: '',
  },
  placeHolder: {
    type: String,
    default: '',
  },
  alt: {
    type: String,
    default: 'img',
  },
  ratio: {
    type: String as PropType<ImgRatioType>,
    default: '1',
  },
  loadingColor: {
    type: String,
    default: 'text-white',
  },
  appImage: {
    type: Boolean,
    default: false,
  },
  fetch: {
    type: Boolean,
    default: false,
  },
});
const { fethCdnData } = FileManagerService();

const completed = ref(false);
const error = ref(false);
const contentTimeOut = ref();

const srcUrl = ref<any>();
const loading = ref(true);

const onError = () => {
  error.value = true;
};
const onImgDidLoad = () => {
  completed.value = true;
};
const onImgWillLoad = () => {};
const imgRatio = computed(() =>
  props.ratio == '1' ? '100' : props.ratio == '4/3' ? '75' : '56.25',
);
onMounted(() => {
  if (props.appImage || props.fetch) {
    onFetchImage();
  } else {
    srcUrl.value = props.src;
    onLoad();
    loading.value = false;
  }
});
const onFetchImage = async () => {
  if (!props.src) {
    loading.value = false;
    return;
  }
  const res = await fethCdnData(props.src);
  if (res) {
    srcUrl.value = res;
  }
  loading.value = false;
};
const onLoad = () => {
  const img = document.querySelector('img');
  if (img) {
    if (img.complete) {
      onImgDidLoad();
    } else {
      img.addEventListener('load', onImgDidLoad);
      img.addEventListener('error', function () {
        onError();
      });
    }
  }
};
onBeforeUnmount(() => {
  if (contentTimeOut.value) {
    clearTimeout(contentTimeOut.value);
    contentTimeOut.value = null;
  }
});
</script>
<style lang="sass" scoped>
@import '@/assets/css/image.sass'
</style>
