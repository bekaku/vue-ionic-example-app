<template>
  <ion-page>
    <ion-header>
      <base-toolbar>
        <ion-buttons slot="start">
          <base-back-button
            default-href="/settings/account-settings"
          ></base-back-button>
        </ion-buttons>
        <ion-title> {{ t('base.editPhoto') }}</ion-title>
      </base-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" :scroll-y="true">
      <ion-card class="no-shadow ion-no-margin no-border-radius">
        <profile-card
          v-if="authenStore.auth && !isLoading"
          :avatar-image="authenStore.auth.avatar?.image"
          :cover-image="authenStore.auth.cover?.image"
          :name="authenStore.auth.username"
          :height="200"
          :avatar-top="140"
          :avatar-size="100"
          show-change-photo
          @on-change-avatar="openAvatar"
          @on-change-cover="openCover"
          description-style="margin-top:25px"
        >
          <template #coverExtra>
            <ion-button
              class="q-absolute"
              size="small"
              :color="!isDark ? 'light' : 'dark'"
              style="top: 165px; right: 15px"
              @click="openCover"
            >
              <ion-icon :icon="cameraOutline" slot="icon-only"></ion-icon>
            </ion-button>
          </template>
          <template #avatarExtra>
            <ion-button
              class="q-absolute"
              size="small"
              :color="!isDark ? 'light' : 'dark'"
              fill="solid"
              @click="openAvatar"
              style="top: 200px; left: 120px; z-index: 199"
            >
              <ion-icon :icon="cameraOutline" slot="icon-only"></ion-icon>
            </ion-button>
          </template>
        </profile-card>
      </ion-card>
    </ion-content>

    <image-cropper
      v-if="dialog && imageFile && imageFile.webPath"
      :model-value="dialog"
      :src="imageFile.webPath"
      @update:modelValue="(newVal: boolean) => (dialog = newVal)"
      @on-close="dialog = false"
      :title="isAvatar ? t('cropAvatar') : t('base.changeCover')"
      :ratio="isAvatar ? 1 : 16 / 9"
      :preview-style="
        isAvatar
          ? 'width: 100px;height: 100px;border-radius: 100%;'
          : 'overflow: hidden;width: 100%;height: 200px;'
      "
      @on-okay="conSubmit"
    >
    </image-cropper>

    <base-choose-photo
      v-if="showChoosePhoto"
      :model-value="showChoosePhoto"
      :multiple="false"
      @update:modelValue="(newVal: boolean) => (showChoosePhoto = newVal)"
      @on-close="showChoosePhoto = false"
      @on-take-picture="onTakePicture"
      @on-pick-picture="onPickPicture"
    >
    </base-choose-photo>
  </ion-page>
</template>
<script setup lang="ts">
import { useAuthenStore } from '@/stores/AuthenStore';
import { cameraOutline } from 'ionicons/icons';
import { FileManagerDto } from '@/types/Models';
import { ChoosePhotoItem } from '@/types/Common';
import FileManagerService from '@/api/FileManagerService';
import UserService from '@/api/UserService';
import { defineAsyncComponent, ref } from 'vue';
import { useBase } from '@/composables/UseBase';
import { useLang } from '@/composables/UseLang';
import {
  IonPage,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonHeader,
  IonTitle,
  IonCard,
} from '@ionic/vue';
import BaseToolbar from '@/components/base/Toolbar.vue';
import BaseBackButton from '@/components/base/BackButton.vue';
import ImageCropper from '@/components/ImageCropper.vue';

const ProfileCard = defineAsyncComponent(
  () => import('@/components/profile/Card.vue'),
);
const BaseChoosePhoto = defineAsyncComponent(
  () => import('@/components/base/ChoosePhoto.vue'),
);

const { uploadApi } = FileManagerService();
const { updateUserAvatar, updateUserCover } = UserService();
const authenStore = useAuthenStore();
const { t } = useLang();
const { WeeLoading, isDark } = useBase();
const dialog = ref(false);
const isAvatar = ref(true);
const isLoading = ref(false);
const showChoosePhoto = ref(false);
const imageFile = ref<ChoosePhotoItem | null>(null);
const openAvatar = () => {
  isAvatar.value = true;
  showChoosePhoto.value = true;
};
const openCover = () => {
  isAvatar.value = false;
  showChoosePhoto.value = true;
};
const onTakePicture = (file: ChoosePhotoItem) => {
  imageFile.value = file;
  showChoosePhoto.value = false;
  dialog.value = true;
};
const onPickPicture = (images: ChoosePhotoItem[]) => {
  imageFile.value = images[0];
  showChoosePhoto.value = false;
};
const conSubmit = (f: any) => {
  if (isAvatar.value) {
    onUploadAvatar(f);
  } else {
    onUploadCover(f);
  }
};
const onUploadAvatar = async (f: any) => {
  const l: any = await WeeLoading();
  l.present();
  isLoading.value = true;
  const response = await onUploadFileProcess(f);
  if (response && authenStore.auth && response.id) {
    //update avatar id to user
    await updateUserAvatar(response.id);
    //update user data in pinia store
    authenStore.auth.avatar = {
      thumbnail: response.fileThumbnailPath,
      image: response.filePath,
    };
  }
  isLoading.value = false;
  l.dismiss();
};
const onUploadCover = async (f: any) => {
  const l: any = await WeeLoading();
  l.present();
  isLoading.value = true;
  const response = await onUploadFileProcess(f);
  if (response && authenStore.auth && response.id) {
    //update avatar id to user
    await updateUserCover(response.id);
    //update user data in pinia store
    authenStore.auth.cover = {
      thumbnail: response.fileThumbnailPath,
      image: response.filePath,
    };
  }
  isLoading.value = false;
  l.dismiss();
};
const onUploadFileProcess = async (f: any): Promise<FileManagerDto | null> => {
  const response = await uploadApi(f);
  return new Promise((resolve) => {
    resolve(response);
  });
};
</script>
