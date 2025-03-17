<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseImage from '@/components/base/BaseImage.vue';
import BaseImageCropperDialog from '@/components/base/BaseImageCropperDialog.vue';
import BasePage from '@/components/base/BasePage.vue';
import BaseRadioItem from '@/components/base/BaseRadioItem.vue';
import type { ChoosePhotoItem, LabelValue } from '@/types/common';
import { getImgUrlFromFile } from '@/utils/fileUtils';
import { IonCardContent } from '@ionic/vue';
import { defineAsyncComponent, ref } from 'vue';
const BaseChoosePhoto = defineAsyncComponent(
  () => import('@/components/base/BaseChoosePhoto.vue'),
);
const showImageCroper = ref(false);
const cropedUrl = ref<string>();
const cropedFile = ref<any>();

const showChoosePhoto = ref(false);
const imageFile = ref<ChoosePhotoItem | null>(null);

const radioSelected = ref<number>(1);

const radioOptions: LabelValue<number>[] = [
  { label: '1', value: 1 },
  { label: '4/3', value: 4 / 3 },
  { label: '16/9', value: 16 / 9 },
];
const onCloseImageCropper = () => {
  showImageCroper.value = false;
};
const onDeleteFile = () => {
  cropedUrl.value = undefined;
  cropedFile.value = undefined;
};
const onCropImage = async (f: any) => {
  console.log('onCropImage', f);
  const imageUrl = await getImgUrlFromFile(f);
  if (imageUrl) {
    cropedUrl.value = imageUrl;
  }
  cropedFile.value = f;
};

const onTakePicture = (file: ChoosePhotoItem | null) => {
  imageFile.value = file;
  showChoosePhoto.value = false;
  showImageCroper.value = true;
};
const onPickPicture = (images: ChoosePhotoItem[] | null) => {
  imageFile.value = images != null ? images[0] : null;
  showChoosePhoto.value = false;
  showImageCroper.value = true;
};
const onCropImageEnd = (imageUrl: string) => {
  console.log('onCropImageEnd');
};
</script>
<template>
  <BasePage page-title="Image crop" fullscreen show-back-link>
    <BaseCard>
      <ion-card-content>
        <p>Ratio</p>
        <BaseRadioItem v-model="radioSelected" :items="radioOptions" />
        <BaseButton full label="Choose image" @click="showChoosePhoto = true" />
        <BaseButton
          full
          label="Delete image"
          color="danger"
          @click="onDeleteFile"
        />
      </ion-card-content>
      <!-- <BaseImageCropper v-if="showImageCroper && !showDialog && imageFile && imageFile.webPath"
                :initial-src="imageFile.webPath" :ratio="radioSelected" @on-close="onCloseImageCropper"
                @on-submit="onCropImage" @on-cropend="onCropImageEnd" /> -->
      <ion-card-content>
        {{ cropedUrl }}
        <template v-if="cropedUrl">
          <p>Ratio : 1</p>
          <BaseImage class="q-mb-md" :src="cropedUrl" ratio="1" />
          <p>Ratio : 4/3</p>
          <BaseImage class="q-mb-md" :src="cropedUrl" ratio="4/3" />
          <p>Ratio : 16/9</p>
          <BaseImage class="q-mb-md" :src="cropedUrl" ratio="16/9" />

          <p>Fit : cover</p>
          <BaseImage class="q-mb-md" :src="cropedUrl" fit="cover" />
          <p>Fit : contain</p>
          <BaseImage class="q-mb-md" :src="cropedUrl" fit="contain" />
          <p>Fit : scale-down</p>
          <BaseImage
            class="q-mb-md"
            :src="cropedUrl"
            fit="scale-down"
            image-bg
          />
        </template>
      </ion-card-content>
    </BaseCard>

    <BaseChoosePhoto
      v-if="showChoosePhoto"
      v-model="showChoosePhoto"
      :multiple="false"
      @on-pick-picture="onPickPicture"
      @on-take-picture="onTakePicture"
    />

    <BaseImageCropperDialog
      v-if="showImageCroper && imageFile"
      v-model="showImageCroper"
      :initial-src="imageFile.webPath"
      :ratio="radioSelected"
      title="Edit image"
      @on-close="onCloseImageCropper"
      @on-submit="onCropImage"
      @on-cropend="onCropImageEnd"
    />
  </BasePage>
</template>
