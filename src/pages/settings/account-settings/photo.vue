<script setup lang="ts">
import FileManagerService from '@/api/FileManagerService';
import UserService from '@/api/UserService';
import BaseImageCropperDialog from '@/components/base/BaseImageCropperDialog.vue';
import BasePage from '@/components/base/BasePage.vue';
import { useBase } from '@/composables/useBase';
import { useLang } from '@/composables/useLang';
import { useTheme } from '@/composables/useTheme';
import { useAuthenStore } from '@/stores/authenStore';
import type { ChoosePhotoItem } from '@/types/common';
import type { FileManagerDto } from '@/types/models';
import {
  IonButton,
  IonIcon
} from '@ionic/vue';
import { cameraOutline } from 'ionicons/icons';
import { defineAsyncComponent, ref } from 'vue';

const ProfileCard = defineAsyncComponent(() => import('@/components/profile/Card.vue'),);
const BaseChoosePhoto = defineAsyncComponent(() => import('@/components/base/BaseChoosePhoto.vue'));

const { uploadApi } = FileManagerService();
const { updateUserAvatar, updateUserCover } = UserService();
const authenStore = useAuthenStore();
const { t } = useLang();
const { appLoading } = useBase();
const { isDark } = useTheme();
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
const onTakePicture = (file: ChoosePhotoItem | null) => {
  imageFile.value = file;
  showChoosePhoto.value = false;
  dialog.value = true;
};
const onPickPicture = (images: ChoosePhotoItem[] | null) => {
  imageFile.value = images != null ? images[0] : null;
  showChoosePhoto.value = false;
  dialog.value = true;
};
const conSubmit = (f: any) => {
  dialog.value = false
  if (isAvatar.value) {
    onUploadAvatar(f);
  } else {
    onUploadCover(f);
  }
};
const onUploadAvatar = async (f: any) => {
  const l: any = await appLoading();
  l.present();
  isLoading.value = true;
  const response = await onUploadFileProcess(f);
  if (response && authenStore.auth && response.id) {
    // update avatar id to user
    await updateUserAvatar(response.id);
    // update user data in pinia store
    authenStore.auth.avatar = {
      thumbnail: response.fileThumbnailPath,
      image: response.filePath,
    };
  }
  isLoading.value = false;
  l.dismiss();
};
const onUploadCover = async (f: any) => {
  const l: any = await appLoading();
  l.present();
  isLoading.value = true;
  const response = await onUploadFileProcess(f);
  if (response && authenStore.auth && response.id) {
    // update avatar id to user
    await updateUserCover(response.id);
    // update user data in pinia store
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
<template>
  <BasePage :page-title="t('base.editPhoto')" fullscreen :content-padding="false" show-back-link
    page-default-back-link="/settings/account-settings">
    <profile-card v-if="authenStore.auth && !isLoading" :avatar-image="authenStore.auth.avatar?.image"
      :cover-image="authenStore.auth.cover?.image" :name="authenStore.auth.username" :height="200" :avatar-top="140"
      :avatar-size="100" show-change-photo description-style="margin-top:25px" @on-change-avatar="openAvatar"
      @on-change-cover="openCover">
      <template #coverExtra>
        <ion-button class="q-absolute" size="small" :color="!isDark ? 'light' : 'dark'" style="top: 165px; right: 15px"
          @click="openCover">
          <ion-icon slot="icon-only" :icon="cameraOutline" />
        </ion-button>
      </template>
      <template #avatarExtra>
        <ion-button class="q-absolute" size="small" :color="!isDark ? 'light' : 'dark'" fill="solid"
          style="top: 200px; left: 120px; z-index: 199" @click="openAvatar">
          <ion-icon slot="icon-only" :icon="cameraOutline" />
        </ion-button>
      </template>
    </profile-card>

    <BaseImageCropperDialog v-if="dialog && imageFile && imageFile.webPath" v-model="dialog"
      :initial-src="imageFile.webPath" :title="isAvatar ? t('cropAvatar') : t('base.changeCover')"
      :ratio="isAvatar ? 1 : 16 / 9" :auto-close="false" :preview-style="isAvatar
        ? 'width: 100px;height: 100px;border-radius: 100%;'
        : 'overflow: hidden;width: 100%;height: 200px;'" @on-close="dialog = false" @on-submit="conSubmit" />

    <BaseChoosePhoto v-if="showChoosePhoto" v-model="showChoosePhoto" :multiple="false" @on-pick-picture="onPickPicture"
      @on-take-picture="onTakePicture" />
  </BasePage>
</template>