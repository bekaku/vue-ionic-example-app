<script setup lang="ts">
import { useBase } from '@/composables/useBase';
import { useLang } from '@/composables/useLang';
import type { FileManagerDto, ImageDto } from '@/types/models';
import { IonButton, IonButtons, IonIcon, IonTitle } from '@ionic/vue';
import { biDownload } from '@quasar/extras/bootstrap-icons';
import { trashOutline } from 'ionicons/icons';
import { ref, useTemplateRef } from 'vue';
import BaseButton from './BaseButton.vue';
import BaseDialog from './BaseDialog.vue';
import BaseImageView from './BaseImageView.vue';

const {
    showDeleteImage = false,
    fetch = false,
    files = [],
    images = [],
    selectedIndex = 0,
    showDownload = true,
} = defineProps<{
    showDeleteImage?: boolean
    fetch?: boolean
    files?: FileManagerDto[]
    images?: ImageDto[]
    selectedIndex?: number
    showDownload?: boolean
    showClose?: boolean
}>();
const emit = defineEmits<{
    'on-close': []
    'on-before-hide': []
    'on-delete': [index: number]
}>()
const { t } = useLang();
const { appConfirm } = useBase();
const modelValue = defineModel<boolean>({ default: false });
const currentIndex = ref<number>(selectedIndex)
const totalFile = ref<number>(files.length > 0 ? files.length : images.length)
const baseImgViewRef = useTemplateRef<any>('baseImgViewRef')
const download = async () => {
    if (baseImgViewRef.value) {
        baseImgViewRef.value.onDownload(currentIndex.value);
    }
}
const onDelete = async () => {
    const confirm = await appConfirm(
        t('app.monogram'),
        t('base.deletePhotoConfirm')
    );
    if (!confirm) {
        return;
    }
    if (baseImgViewRef.value) {
        baseImgViewRef.value.onDelete(currentIndex.value);
    }
    emit('on-delete', currentIndex.value);
}
// eslint-disable-next-line ts/no-unused-vars
const onItemRemoved = (index: number) => {
    if (totalFile.value > 0) {
        totalFile.value--;
    }
}
const onClose = () => {
    emit('on-close');
    modelValue.value = false;
};
</script>
<template>
    <BaseDialog v-if="modelValue" v-model="modelValue" :content-padding="false" dark @on-close="onClose">
        <template #title>
            <slot name="title">
                <ion-title>{{ `${t('base.photo')} ${currentIndex + 1}/${totalFile}` }}</ion-title>
            </slot>
        </template>
        <template #avatar>
            <slot name="avatar">
            </slot>
        </template>
        <template #end>
            <slot name="end">
                <ion-buttons slot="end">
                    <BaseButton v-if="showDownload" color="light" clear icon-only icon-set="bootstrap-icons"
                        icon-color="white" :icon-size="30" :icon="biDownload" @click="download" />
                    <ion-button v-if="showDeleteImage" color="light" @click="onDelete">
                        <ion-icon slot="icon-only" :icon="trashOutline" />
                    </ion-button>
                </ion-buttons>
            </slot>
        </template>
        <BaseImageView ref="baseImgViewRef" v-model:selected-index="currentIndex" :files :images :fetch
            @on-close="onClose" @on-delete="onItemRemoved" />
    </BaseDialog>
</template>