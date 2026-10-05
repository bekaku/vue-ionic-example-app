<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseFileItems from '@/components/base/BaseFileItems.vue';
import BaseFilePicker from '@/components/base/BaseFilePicker.vue';
import BasePage from '@/components/base/BasePage.vue';
import { useCamera } from '@/composables/useCamera';
import { useUpload } from '@/composables/useUpload';
import { FileTypeAcceptList } from '@/libs/constant';
import type { FileManager } from '@/types/models';
import { IonCardContent, IonCol, IonRow } from '@ionic/vue';
import { cameraOutline, imageOutline } from 'ionicons/icons';
import { defineAsyncComponent, ref, useTemplateRef } from 'vue';
const BaseChoosePhoto = defineAsyncComponent(
  () => import('@/components/base/BaseChoosePhoto.vue'),
);

const { onPickPhoto, onTakePicture } = useCamera();
const { files, uploading, onStartUploadChunk } = useUpload();

const filePickItems = ref<FileManager[]>([]);
const fileChooseItems = ref<FileManager[]>([]);
const filePickerRef =
  useTemplateRef<InstanceType<typeof BaseFilePicker>>('filePickerRef');

const onPickImageProcess = async () => {
  const files = await onPickPhoto(1);
  console.log('onPickPhoto', files);
};
const onTakeImageProcess = async () => {
  const file = await onTakePicture();
  console.log('onTakePicture', file);
};

const openFilePicker = () => {
  if (filePickerRef.value) {
    filePickerRef.value.open();
  }
};
const onFilePickerChange = (files: FileManager[] | null) => {
  console.log('onFilePickerChange', files);
};
</script>
<template>
  <BasePage page-title="File picker" fullscreen show-back-link>
    <BaseCard flat title="Chunk upload">
      <ion-card-content>
        <BaseFilePicker
          v-model="files"
          label="Pick files"
          multiple
          format-size
          wildcard
        />
        <BaseButton
          label="Upload"
          full
          :disabled="!files || files.length == 0 || uploading"
          @click="onStartUploadChunk"
        />
      </ion-card-content>
    </BaseCard>

    <BaseCard flat title="Image picker">
      <ion-card-content>
        <BaseChoosePhoto
          v-model="fileChooseItems"
          full-width
          :multiple="false"
          @on-change="onFilePickerChange"
        >
          <BaseButton full label="Single From gallerry/Camera" />
        </BaseChoosePhoto>

        <BaseChoosePhoto
          v-model="fileChooseItems"
          full-width
          multiple
          @on-change="onFilePickerChange"
        >
          <BaseButton full label="Multiple from gallerry/Camera" />
        </BaseChoosePhoto>

        <IonRow>
          <IonCol>
            <BaseFileItems :items="fileChooseItems" show-delete />
          </IonCol>
        </IonRow>

        <BaseButton
          label="From gallerry"
          :icon="{ name: imageOutline, iconSet: 'ion' }"
          @click="onPickImageProcess"
        />
        <BaseButton
          label="From camera"
          :icon="{ name: cameraOutline, iconSet: 'ion' }"
          @click="onTakeImageProcess"
        />
      </ion-card-content>
    </BaseCard>

    <BaseCard flat title="File picker">
      <ion-card-content>
        <BaseFilePicker
          ref="filePickerRef"
          v-model="filePickItems"
          label="Simple picker"
          multiple
          :accept="FileTypeAcceptList"
        >
          <template #button="{ open }">
            <BaseButton
              full
              label="Custom UI picker"
              :icon="{ name: imageOutline, iconSet: 'ion' }"
              @click="open"
            />
          </template>
        </BaseFilePicker>
      </ion-card-content>
    </BaseCard>
  </BasePage>
</template>
