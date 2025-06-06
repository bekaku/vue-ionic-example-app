<!-- eslint-disable unused-imports/no-unused-imports -->
<!-- eslint-disable ts/no-unused-vars -->
<script setup lang="ts">
import BaseSpinner from '@/components/base/BaseSpinner.vue';
import { useLang } from '@/composables/useLang';
// import '@/plugins/cropperjs';
import { IonCardContent, IonRow } from '@ionic/vue';
import {
  addOutline,
  arrowUpOutline,
  removeOutline,
  repeatOutline,
  returnUpBackOutline,
  returnUpForwardOutline,
} from 'ionicons/icons';
import { onMounted, onUnmounted, ref, useTemplateRef, watchEffect } from 'vue';
import BaseButton from './BaseButton.vue';
import {
  biArrowClockwise,
  biArrowCounterclockwise,
  biArrowLeftRight,
  biArrowsCollapse,
  biZoomIn,
  biZoomOut,
} from '@quasar/extras/bootstrap-icons';

const {
  ratio = 1,
  disabled = false,
  initialSrc,
  width = '100%',
  height = '350px',
  clearOnSubmit = false,
  cropWidth = 960,
  previewStyle = 'overflow: hidden;width: 100%;',
  showPreview = false,
} = defineProps<{
  ratio?: number;
  disabled?: boolean;
  initialSrc?: string;
  width?: string;
  height?: string;
  clearOnSubmit?: boolean;
  cropWidth?: number;
  showPreview?: boolean;
  previewStyle?: string;
}>();

const emit = defineEmits<{
  'on-close': [];
  'on-submit': [File | Blob];
  'on-cropend': [string];
}>();

const { t } = useLang();
const originalimagFile = ref<any>(null);
const maximizedToggle = ref(false);
const loading = ref(false);
const submiting = ref(false);
const priviewImage = ref(null);
const initFinished = ref(false);
const canvasRef = useTemplateRef<any>('canvasRef');
const canvasImg = useTemplateRef<any>('canvasImg');
const selectionRef = useTemplateRef<any>('selectionRef');
const cropTimeout = ref<any>(null);
const src = ref<string | undefined>(initialSrc);

onMounted(() => {
  cropTimeout.value = setTimeout(() => {
    initFinished.value = true;
  }, 500);
});
const onClose = () => {
  clearCropper();
  originalimagFile.value = null;
  emit('on-close');
  maximizedToggle.value = false;
};
const onSelectionChange = (event: any) => {
  // console.log('onSelectionChange', event);
};
const onCanvaAction = (event: any) => {
  // console.log('onCanvaCAction', event);
};
const onCanvaActionstart = (event: any) => {
  // console.log('onCanvaActionstart', event);
};
const onCanvaActionmove = (event: any) => {
  // console.log('onCanvaActionmove', event);
};
const onCanvaActionend = (event: any) => {
  onCropend();
};
const getSelectionCanvas = async (): Promise<any> => {
  if (!selectionRef.value) {
    return new Promise((resolve) => {
      resolve(null);
    });
  }
  const selectionCanvas = await selectionRef.value.$toCanvas({
    beforeDraw: (context: any, canvas: any) => {
      context.imageSmoothingQuality = 'high';
    },
    width: cropWidth,
  });
  return new Promise((resolve) => {
    resolve(selectionCanvas);
  });
};
const onCropend = async () => {
  cropTimeout.value = setTimeout(async () => {
    const selectionCanvas = await getSelectionCanvas();
    if (selectionCanvas) {
      priviewImage.value = selectionCanvas.toDataURL('image/jpeg');
      if (priviewImage.value) {
        emit('on-cropend', priviewImage.value);
      }
    }
    // viewerRef.value.replaceChildren(selectionCanvas)
    // console.log('onCropend', selectionCanvas.toDataURL())
  }, 500);
};
const onSubmit = async () => {
  const selectionCanvas = await getSelectionCanvas();
  if (selectionCanvas) {
    submiting.value = true;
    selectionCanvas.toBlob(async (blob: any) => {
      // const f = await blobToFile(blob, originalimagFile.value.name);
      submiting.value = false;
      emit('on-submit', blob);
      if (clearOnSubmit) {
        onClose();
      }
    }, 'image/jpeg');
  }
};
const onFileAdded = async () => {
  if (initialSrc) {
    src.value = initialSrc;
    if (selectionRef.value) {
      cropTimeout.value = setTimeout(() => {
        selectionRef.value.$change(60, 60, 120, 120);
        selectionRef.value.$center();
        onCropend();
      }, 300);
    }
  }
};
watchEffect(() => {
  if (initialSrc && initFinished.value) {
    console.log('watchEffetch initialSrc :', initialSrc);
    onFileAdded();
  }
});
const clearCropper = () => {
  if (selectionRef.value) {
    selectionRef.value.$clear();
  }
  if (cropTimeout.value) {
    clearTimeout(cropTimeout.value);
    cropTimeout.value = null;
  }
};
const conRotate = () => {
  console.log('conRotate', canvasImg.value);
};
// Clean up on unmount
onUnmounted(() => {
  clearCropper();
});
</script>
<template>
  <div class="no-shadow no-border-radius ion-no-margin" :margin="false">
    <base-spinner
      v-if="loading || !initFinished"
      :label="t('base.pleaseWait')"
    />
    <ion-row class="ion-justify-content-center q-pa-md">
      <cropper-canvas
        id="cropperSelection"
        ref="canvasRef"
        :style="{
          display: 'block',
          maxWidth: width,
          height,
          overflow: 'hidden',
        }"
        class="q-full-width"
        :disabled
        background
        @action="onCanvaAction"
        @actionstart="onCanvaActionstart"
        @actionmove="onCanvaActionmove"
        @actionend="onCanvaActionend"
      >
        <cropper-image
          v-if="initFinished"
          ref="canvasImg"
          :src="src"
          alt="Picture"
          scalable
          skewable
          translatable
        />
        <cropper-shade hidden />
        <cropper-handle action="select" plain />
        <cropper-selection
          ref="selectionRef"
          :initial-coverage="0.5"
          :x="60"
          :y="60"
          :width="80"
          :height="80"
          movable
          resizable
          :aspect-ratio="ratio"
          @change="onSelectionChange"
        >
          <cropper-grid role="grid" theme-color="#2e86de" covered />
          <cropper-crosshair centered />
          <cropper-handle
            action="move"
            theme-color="rgba(255, 255, 255, 0.35)"
          />
          <cropper-handle action="n-resize" />
          <cropper-handle action="e-resize" />
          <cropper-handle action="s-resize" />
          <cropper-handle action="w-resize" />
          <cropper-handle action="ne-resize" />
          <cropper-handle action="nw-resize" />
          <cropper-handle action="se-resize" />
          <cropper-handle action="sw-resize" />
        </cropper-selection>
      </cropper-canvas>
    </ion-row>

    <slot name="preview">
      <ion-row
        v-if="showPreview && initFinished"
        class="ion-justify-content-center q-pa-md"
      >
        <img v-if="priviewImage" :src="priviewImage" :style="previewStyle" />
      </ion-row>
    </slot>
    <ion-card-content>
      <template v-if="canvasImg">
        <BaseButton
          size="small"
          clear
          flat
          ion-icon
          :icon="{ name: biZoomIn, iconSet: 'bootstrap-icons' }"
          @click="canvasImg.$zoom(0.1)"
        />
        <BaseButton
          size="small"
          clear
          flat
          ion-icon
          :icon="{ name: biZoomOut, iconSet: 'bootstrap-icons' }"
          @click="canvasImg.$zoom(-0.1)"
        />
        <BaseButton
          size="small"
          clear
          flat
          ion-icon
          :icon="{ name: biArrowCounterclockwise, iconSet: 'bootstrap-icons' }"
          @click="canvasImg.$rotate('-45deg')"
        />
        <BaseButton
          size="small"
          clear
          flat
          ion-icon
          :icon="{ name: biArrowClockwise, iconSet: 'bootstrap-icons' }"
          @click="canvasImg.$rotate('45deg')"
        />
        <BaseButton
          size="small"
          clear
          flat
          ion-icon
          :icon="{ name: biArrowLeftRight, iconSet: 'bootstrap-icons' }"
          @click="canvasImg.$scale(-1, 1)"
        />
        <BaseButton
          size="small"
          clear
          flat
          ion-icon
          :icon="{ name: biArrowsCollapse, iconSet: 'bootstrap-icons' }"
          @click="canvasImg.$scale(1, -1)"
        />
      </template>
    </ion-card-content>

    <BaseButton
      class="q-px-sm"
      :disabled="submiting"
      :label="!submiting ? t('base.submit') : t('base.pleaseWait')"
      full
      @click="onSubmit"
    />
  </div>
</template>
<style scoped lang="scss">
.cropper-crop-box,
.cropper-view-box {
  border-radius: 50%;
}
</style>
