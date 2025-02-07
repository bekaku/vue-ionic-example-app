<template>
  <base-modal v-if="modelValue" v-model="modelValue" :title="label || t('base.chooseFromFile')"
    :initial-breakpoint="0.25" :breakpoints="[0, 0.25]" @on-close="modelValue = false">
    <ion-list lines="none">
      <ion-item button :detail="false" @click="pickPhoto">
        <ion-icon slot="start" :icon="imageOutline"></ion-icon>
        <ion-label>
          <h2>{{ t('base.chooseFromGallery') }}</h2>
        </ion-label>
      </ion-item>
      <ion-item button :detail="false" @click="takePicture">
        <ion-icon slot="start" :icon="cameraOutline"></ion-icon>
        <ion-label>
          <h2>{{ t('base.chooseFromCamera') }}</h2>
        </ion-label>
      </ion-item>
    </ion-list>
  </base-modal>
</template>
<script setup lang="ts">
import { useBase } from '@/composables/useBase';
import { useFileSystem } from '@/composables/useFileSystem';
import { useLang } from '@/composables/useLang';
import type { ChoosePhotoItem } from '@/types/common';
import type { FileManagerDto } from '@/types/models';
import { generateUUID } from '@/utils/appUtil';
import { IonIcon, IonItem, IonLabel, IonList } from '@ionic/vue';
import { cameraOutline, imageOutline } from 'ionicons/icons';
import { defineAsyncComponent, onMounted } from 'vue';
const BaseModal = defineAsyncComponent(() => import('@/components/base/BaseModal.vue'));

const { multiple = false, limit = 6 } = defineProps<{
  multiple?: boolean
  limit?: number
  label?: string
}>();
const emit = defineEmits<{
  'on-take-picture': [files: ChoosePhotoItem | null]
  'on-pick-picture': [files: ChoosePhotoItem[] | null]
}>();


const modelValue = defineModel<boolean>({ default: false });
const fileItems = defineModel<FileManagerDto[]>('files', { default: () => [] });
const { requestCameraPermissions, onTakePicture, onPickPhoto } = useFileSystem();
onMounted(() => {
  requestCameraPermissions();
  if (limit > 0 && fileItems.value.length >= limit) {
    appToast({
      text: t('error.limitFile2', { total: limit }),
      color: 'danger',
    });
    modelValue.value = false;
  }
});

const { t } = useLang();
const { appToast } = useBase();
const takePicture = async () => {
  const file = await onTakePicture();
  if (file) {
    conAddFiles([file]);
    emit('on-take-picture', file);
  }
};
const pickPhoto = async () => {
  if (multiple) {
    const files = await onPickPhoto(true);
    if (files) {
      conAddFiles(files);
      emit('on-pick-picture', files);
    }
  } else {
    const files = await onPickPhoto(false);
    if (files) {
      conAddFiles(files);
      emit('on-pick-picture', files);
    }
  }
};
const conAddFiles = (files: ChoosePhotoItem[]) => {
  for (const t of files) {
    if (limit > 0) {
      if (fileItems.value.length < limit) {
        onAddFilePreview(t.file, true, t.webPath);
      }
    } else {
      onAddFilePreview(t.file, true, t.webPath);
    }
  }
}
const onAddFilePreview = (
  f: File | Blob | undefined,
  isImage: boolean,
  pathUrl: string | undefined = undefined
) => {
  if (f) {
    fileItems.value.push({
      id: 0,
      uniqueId: generateUUID(),
      fileMime: f.type,
      fileName: '',
      filePath: pathUrl || '',
      fileThumbnailPath: '',
      fileSize: f.size + '',
      functionId: 0,
      isImage,
      file: f
    });
  }
};
</script>
