<template>
  <base-modal
    v-if="show"
    :model-value="show"
    :title="t('base.chooseFromFile')"
    :initial-breakpoint="0.25"
    :breakpoints="[0, 0.25]"
    @update:modelValue="(newVal: boolean) => (show = newVal)"
    @on-close="show = false"
  >
    <ion-list lines="none">
      <ion-item button :detail="false" @click="pickPhoto">
        <ion-icon :icon="imageOutline" slot="start"></ion-icon>
        <ion-label>
          <h2>{{ t('base.chooseFromGallery') }}</h2>
        </ion-label>
      </ion-item>
      <ion-item button :detail="false" @click="takePicture">
        <ion-icon :icon="cameraOutline" slot="start"></ion-icon>
        <ion-label>
          <h2>{{ t('base.chooseFromCamera') }}</h2>
        </ion-label>
      </ion-item>
    </ion-list>
  </base-modal>
</template>
<script setup lang="ts">
import { cameraOutline, imageOutline } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ChoosePhotoItem } from '@/types/Common';
import { getCurrentTimestamp } from '@/utils/DateUtil';
import { FileImageNameAtt } from '@/utils/Constant';
import { computed, defineAsyncComponent, onMounted } from 'vue';
import { useLang } from '@/composables/UseLang';
import { IonIcon, IonItem, IonLabel, IonList } from '@ionic/vue';
import { blobToFile, urlToBlob, imageUrlToBase64, imageUrlToFile } from '@/utils/AppUtil';

const BaseModal = defineAsyncComponent(
  () => import('@/components/base/Modal.vue')
);
const props = defineProps({
  modelValue: {
    type: Boolean,
    require: true
  },
  forWeb: {
    type: Boolean,
    require: false
  },
  multiple: {
    type: Boolean,
    default: false
  }
});
onMounted(() => {
  requestPermissions();
});

const requestPermissions = () => {
  const permitCamera = Camera.requestPermissions();
};
const { t } = useLang();
const emit = defineEmits([
  'update:modelValue',
  'on-take-picture',
  'on-pick-picture'
]);
const show = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const takePicture = async () => {
  const image = await Camera.getPhoto({
    quality: 99,
    allowEditing: false,
    saveToGallery: false,
    resultType: CameraResultType.Uri,
    source: CameraSource.Camera,
    webUseInput: true,
    promptLabelHeader: t('base.photo'),
    promptLabelCancel: t('base.cancel'),
    promptLabelPhoto: t('base.fromPhotos'),
    promptLabelPicture: t('base.takePicture')
  });

  // image.webPath will contain a path that can be set as an image src.
  // You can access the original file using image.path, which can be
  // passed to the Filesystem API to read the raw data of the image,
  // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
  const f = await getFile(image.webPath);
  emit('on-take-picture', f);
};
const pickPhoto = () => {
  if (props.multiple) {
    pickPhotoAlbum();
  } else {
    takePickSiglePicture();
  }
};
const takePickSiglePicture = async () => {
  const image = await Camera.getPhoto({
    quality: 100,
    allowEditing: false,
    saveToGallery: false,
    resultType: CameraResultType.Uri,
    source: CameraSource.Photos,
    webUseInput: true,
    promptLabelHeader: t('base.photo'),
    promptLabelCancel: t('base.cancel'),
    promptLabelPhoto: t('base.fromPhotos'),
    promptLabelPicture: t('base.takePicture')
  });

  // image.webPath will contain a path that can be set as an image src.
  // You can access the original file using image.path, which can be
  // passed to the Filesystem API to read the raw data of the image,
  // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
  const f = await getFile(image.webPath);
  emit('on-take-picture', f);
};
const pickPhotoAlbum = async () => {
  const images = await Camera.pickImages({
    quality: 100,
    limit: 6
  });
  const items = images.photos;
  const list: ChoosePhotoItem[] = [];
  for (const item of items) {
    const f = await getFile(item.webPath);
    list.push(f);
  }
  emit('on-pick-picture', list);
};
const getFile = async (webPath: any): Promise<ChoosePhotoItem> => {
  // const fileName = generateFileName();
  // const file = await imageUrlToFile(webPath, fileName);
  const file = await urlToBlob(webPath);
  // const fileBase64 = await imageUrlToBase64(webPath);
  return new Promise((resolve) => {
    resolve({
      webPath: webPath,
      file: file
      // fileBase64: fileBase64
    });
  });
};
const generateFileName = () => {
  return `${getCurrentTimestamp()}.jpeg`;
  // return `${FileImageNameAtt}_${getCurrentTimestamp()}.jpg`;
};
</script>
