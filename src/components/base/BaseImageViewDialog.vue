<script setup lang="ts">
import { useBase } from '@/composables/useBase';
import { useLang } from '@/composables/useLang';
import type { FileManagerDto, ImageDto } from '@/types/models';
import {
  IonButton,
  IonButtons,
  IonCol,
  IonIcon,
  IonRow,
  IonTitle,
} from '@ionic/vue';
import { biDownload } from '@quasar/extras/bootstrap-icons';
import {
  downloadOutline,
  shareSocialOutline,
  trashOutline,
} from 'ionicons/icons';
import { ref, useTemplateRef } from 'vue';
import BaseButton from './BaseButton.vue';
import BaseDialog from './BaseDialog.vue';
import BaseImageView from './BaseImageView.vue';
import { useFileDownload } from '@/composables/useFileDownload';

const {
  showDeleteImage = false,
  fetch = false,
  files = [],
  images = [],
  selectedIndex = 0,
  showDownload = true,
  showShare = true,
} = defineProps<{
  showDeleteImage?: boolean;
  fetch?: boolean;
  files?: FileManagerDto[];
  images?: ImageDto[];
  selectedIndex?: number;
  showDownload?: boolean;
  showClose?: boolean;
  showShare?: boolean;
}>();
const emit = defineEmits<{
  'on-close': [];
  'on-before-hide': [];
  'on-delete': [index: number];
}>();
const { t } = useLang();
const { appConfirm, appLoading, appToast } = useBase();
const { downloadImage, downloadAndShareFile } = useFileDownload();
const modelValue = defineModel<boolean>({ default: false });
const currentIndex = ref<number>(selectedIndex);
const totalFile = ref<number>(files.length > 0 ? files.length : images.length);
const baseImgViewRef = useTemplateRef<any>('baseImgViewRef');
const download = async () => {
  if (baseImgViewRef.value) {
    baseImgViewRef.value.onDownload(currentIndex.value);
  }
};
const share = async () => {
  if (baseImgViewRef.value) {
    baseImgViewRef.value.onShare(currentIndex.value);
  }
};
const onDelete = async () => {
  const confirm = await appConfirm(
    t('app.monogram'),
    t('base.deletePhotoConfirm'),
  );
  if (!confirm) {
    return;
  }
  if (baseImgViewRef.value) {
    baseImgViewRef.value.onDelete(currentIndex.value);
  }
  emit('on-delete', currentIndex.value);
};
// eslint-disable-next-line ts/no-unused-vars
const onItemRemoved = (index: number) => {
  if (totalFile.value > 0) {
    totalFile.value--;
  }
};
const onClose = () => {
  emit('on-close');
  modelValue.value = false;
};
</script>
<template>
  <BaseDialog
    v-if="modelValue"
    v-model="modelValue"
    :content-padding="false"
    dark
    @on-close="onClose"
  >
    <template #title>
      <slot name="title">
        <ion-title>
          {{ `${t('base.photo')} ${currentIndex + 1}/${totalFile}` }}
        </ion-title>
      </slot>
    </template>
    <template #avatar>
      <slot name="avatar"> </slot>
    </template>
    <template #end>
      <slot name="end">
        <!-- <ion-buttons slot="end">
          <BaseButton
            v-if="showDownload"
            color="light"
            clear
            icon-only
            icon-color="white"
            :icon-size="30"
            :icon="{ name: biDownload, iconSet: 'bootstrap-icons' }"
            @click="download"
          />
          <ion-button v-if="showDeleteImage" color="light" @click="onDelete">
            <ion-icon slot="icon-only" :icon="trashOutline" />
          </ion-button>
        </ion-buttons> -->
      </slot>
    </template>
    <Transition>
      <BaseImageView
        ref="baseImgViewRef"
        v-model:selected-index="currentIndex"
        :files
        :images
        :fetch
        @on-close="onClose"
        @on-delete="onItemRemoved"
      />
    </Transition>
    <IonRow
      class="q-fixed-bottom2 ion-justify-content-around ion-align-items-center"
    >
      <IonCol v-if="showDeleteImage" class="ion-text-center">
        <BaseButton
          :icon="{
            name: trashOutline,
            iconSet: 'ion',
            color: 'white',
          }"
          clear
          icon-only
          @click="onDelete"
        />
      </IonCol>
      <IonCol v-if="showShare" class="ion-text-center">
        <BaseButton
          :icon="{
            name: shareSocialOutline,
            iconSet: 'ion',
            color: 'white',
          }"
          clear
          icon-only
          @click="share"
        />
      </IonCol>
      <IonCol v-if="showDownload" class="ion-text-center">
        <BaseButton
          :icon="{
            name: downloadOutline,
            iconSet: 'ion',
            color: 'white',
          }"
          clear
          icon-only
          @click="download"
        />
      </IonCol>
    </IonRow>
  </BaseDialog>
</template>
<style scoped lang="scss">
/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
  transition: opacity 1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
