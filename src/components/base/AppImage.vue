<template>
  <ion-skeleton-text
    v-if="loading"
    :class="[
      {
        circle: circle,
        rounded: rounded,
      },
    ]"
    v-bind="$attrs"
    :animated="true"
  ></ion-skeleton-text>
  <Transition v-bind="$attrs">
    <ion-img v-if="!loading" v-bind="$attrs" :src="srcUrl"></ion-img>
  </Transition>
</template>
<script setup lang="ts">
/*
 <AppImage
          src="http://localhost:8080/cdn/images/202211/145_1668642842865_fe718909cb0d4bd88e17c8568fe12e2f.jpg"
          style="height: 250px; max-width: 250px"
        />
*/
import { onBeforeUnmount, onMounted, PropType, ref, watchEffect } from 'vue';
import { IonImg, IonSkeletonText } from '@ionic/vue';
import FileManagerService from '@/api/FileManagerService';
import { ImgRatioType } from '@/types/Common';

const props = defineProps({
  src: {
    type: String as PropType<string>,
    default: undefined
  },
  spinnerColor: {
    type: String as PropType<string>,
    default: 'white'
  },
  bgColorClass: {
    type: String as PropType<string>,
    default: 'bg-black'
  },
  ratio: {
    type: String as PropType<ImgRatioType>,
    default: '1'
  },
  loadingColor: {
    type: String,
    default: 'text-white'
  },
  // style: {
  //   type: String,
  //   default: undefined,
  // },
  circle: {
    type: Boolean,
    default: false
  },
  rounded: {
    type: Boolean,
    default: false
  }
});
const { fethCdnData } = FileManagerService();
const loading = ref(true);
const show = ref(false);
const firstLoaded = ref(false);
const srcUrl = ref<any>();

onMounted(async () => {
  onFetchImage();
});
watchEffect(() => {
  if (firstLoaded.value) {
    onFetchImage();
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
  if (!firstLoaded.value) {
    firstLoaded.value = true;
  }
};
onBeforeUnmount(() => {
  srcUrl.value = undefined;
});
</script>
<style scoped lang="scss">
.circle {
  border-radius: 50%;
}

.rounded {
  border-radius: 4px;
}

/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
