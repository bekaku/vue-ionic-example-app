<script setup>
import BaseToolbar from '@/components/base/BaseToolbar.vue';
import BaseSpinner from '@/components/base/BaseSpinner.vue';
import { useLang } from '@/composables/useLang';
import { FileImageNameAtt } from '@/libs/constant';
import { getCurrentTimestamp } from '@/utils/dateUtil';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonRow,
  IonTitle
} from '@ionic/vue';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import {
  addOutline,
  arrowUpOutline,
  close,
  removeOutline,
  repeatOutline,
  returnUpBackOutline,
  returnUpForwardOutline
} from 'ionicons/icons';
import { onBeforeUnmount, ref, watchEffect } from 'vue';
const props = defineProps({
  title: {
    type: String,
  },
  src: {
    type: String,
  },
  ratio: {
    type: Number,
    default: 1, // 1, 4/3, 16/9
  },
  previewStyle: {
    type: String,
    default: 'overflow: hidden;width: 100%;',
  },
});
const emit = defineEmits(['on-close', 'on-okay', 'on-cropend']);
const { t } = useLang();
const canvasImg = ref(null); // ref to <canvas ref="canvasImg" width="120" height="100"></canvas>
const cropper = ref(null);
const originalimagFile = ref(null);
const horizontalScale = ref(1);
const verticalScale = ref(1);
const maximizedToggle = ref(false);
const loading = ref(false);
const priviewImage = ref(null);
const isInited = ref(false);
const initFinished = ref(false);
const initialTimeout = ref();
const modelValue = defineModel({ type: Boolean, default: false });
watchEffect(() => {
  if (canvasImg.value && props.src && !isInited.value) {
    isInited.value = true;
    loading.value = true;
    initialTimeout.value = setTimeout(() => {
      loading.value = false;
      onFileAdded();
    }, 1000);
  }
});

const onClose = () => {
  clearCropper();
  originalimagFile.value = null;
  emit('on-close');
  maximizedToggle.value = false;
  modelValue.value = false;
};
const clearCropper = () => {
  if (cropper.value) {
    cropper.value.clear();
    cropper.value.destroy();
  }
};
const onInitCroper = () => {
  return new Promise((resolve) => {
    clearCropper();
    const options = {
      aspectRatio: props.ratio,
      preview: '.cropper-img-preview',
      ready(/* e */) {
        /* */
        cropData();
      },
      cropstart(/* e */) {
        /* */
      },
      cropmove(/* e */) {
        /* */
      },
      cropend(/* e */) {
        /* */
        cropData();
      },
      crop(/* e */) {
        /* */
      },
      zoom(/* e */) {
        /* */
      },
    };
    cropper.value = new Cropper(canvasImg.value, options);
    resolve(true);
  });
};
const onFileAdded = async () => {
  if (props.src) {
    canvasImg.value.src = props.src;
    initFinished.value = false;
    await onInitCroper();
    initFinished.value = true;
  }
};
const flipHorizontal = () => {
  if (cropper.value) {
    verticalScale.value = verticalScale.value * -1;
    cropper.value.scaleX(verticalScale.value);
  }
};
const flipVertical = (/* e */) => {
  if (cropper.value) {
    horizontalScale.value = horizontalScale.value * -1;
    cropper.value.scaleY(horizontalScale.value);
  }
};
const zoomIn = (/* e */) => {
  if (cropper.value) {
    cropper.value.zoom(0.1);
  }
};
const onOkay = () => {
  if (cropper.value && cropper.value.cropped) {
    loading.value = true;
    cropper.value.getCroppedCanvas().toBlob(async (blob) => {
      // const f = await blobToFile(blob, generateFileName());
      loading.value = false;
      // emit('on-okay', f);
      emit('on-okay', blob);
      onClose();
    }, 'image/jpeg'); // image/png, image/jpeg
  }
};
const generateFileName = () => {
  return `${FileImageNameAtt}_${getCurrentTimestamp()}.jpg`;
};
const cropData = () => {
  if (cropper.value) {
    priviewImage.value = cropper.value
      .getCroppedCanvas()
      .toDataURL('image/jpeg');
    emit('on-cropend', priviewImage.value)
  }
};
onBeforeUnmount(() => {
  if (initialTimeout.value) {
    clearTimeout(initialTimeout.value);
    initialTimeout.value = null;
  }
});
</script>
<template>
  <ion-modal :is-open="modelValue" :aria-hidden="true" @will-dismiss="onClose">
    <ion-header>
      <base-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="onClose">
            <ion-icon slot="icon-only" :icon="close"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title v-if="title" class="ion-text-capitalize">
          {{ title }}
        </ion-title>
        <ion-buttons slot="end">
          <ion-button class="text-primary" @click="onOkay">
            {{ t('base.submit') }}
          </ion-button>
        </ion-buttons>
      </base-toolbar>
    </ion-header>
    <ion-content>
      <ion-card class="no-shadow no-border-radius ion-no-margin">
        <base-spinner v-if="loading" :label="t('base.pleaseWait')"></base-spinner>
        <div style="height: 350px; overflow: hidden" class="q-full-width">
          <img ref="canvasImg" alt="" class="q-full-width" />
        </div>
        <ion-card-content v-if="cropper">
          <ion-button size="small" mode="ios" fill="clear" @click="cropper.zoom(0.1)">
            <ion-icon slot="start" :icon="addOutline"></ion-icon>
            {{ t('zoomIn') }}
          </ion-button>
          <ion-button size="small" mode="ios" fill="clear" @click="cropper.zoom(-0.1)">
            <ion-icon slot="start" :icon="removeOutline"></ion-icon>
            {{ t('zoomOut') }}
          </ion-button>
          <ion-button size="small" mode="ios" fill="clear" @click="cropper.rotate(-45)">
            <ion-icon slot="start" :icon="returnUpBackOutline"></ion-icon>
            {{ t('rotateLeft') }}
          </ion-button>
          <ion-button size="small" mode="ios" fill="clear" @click="cropper.rotate(45)">
            <ion-icon slot="start" :icon="returnUpForwardOutline"></ion-icon>
            {{ t('rotateRight') }}
          </ion-button>
          <ion-button size="small" mode="ios" fill="clear" @click="flipHorizontal">
            <ion-icon slot="start" :icon="repeatOutline"></ion-icon>
            {{ t('flipHorizontal') }}
          </ion-button>
          <ion-button size="small" mode="ios" fill="clear" @click="flipVertical">
            <ion-icon slot="start" :icon="arrowUpOutline"></ion-icon>
            {{ t('flipVorizontal') }}
          </ion-button>
        </ion-card-content>
        <ion-row v-if="initFinished" class="ion-justify-content-center q-pa-md">
          <img v-if="priviewImage" :src="priviewImage" :style="previewStyle" />
        </ion-row>
      </ion-card>
    </ion-content>
  </ion-modal>
</template>
<style scoped lang="scss">
.cropper-crop-box,
.cropper-view-box {
  border-radius: 50%;
}
</style>
