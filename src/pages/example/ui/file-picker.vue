<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseFilePicker from '@/components/base/BaseFilePicker.vue';
import BasePage from '@/components/base/BasePage.vue';
import { useFileSystem } from '@/composables/useFileSystem';
import { FileTypeAcceptList } from '@/libs/constant';
import type { ChoosePhotoItem } from '@/types/common';
import type { FileManagerDto } from '@/types/models';
import { generateUUID } from '@/utils/appUtil';
import {
    IonCardContent,
    IonList
} from '@ionic/vue';
import { cameraOutline, imageOutline } from 'ionicons/icons';
import { defineAsyncComponent, ref, useTemplateRef } from 'vue';
const BaseChoosePhoto = defineAsyncComponent(() => import('@/components/base/BaseChoosePhoto.vue'));
const BaseFilePreviewItemAlt = defineAsyncComponent(() => import('@/components/base/BaseFilePreviewItemAlt.vue'));

const { onTakePicture, onPickPhoto } = useFileSystem();
const dialogPickGallerryOrCamera = ref<boolean>(false);
const dialogPickGallerryOrCameraMultiple = ref<boolean>(false);
const imagePickItems = ref<FileManagerDto[]>([]);

const filePickItems = ref<FileManagerDto[]>([]);
const filePickerRef = useTemplateRef<InstanceType<typeof BaseFilePicker>>('filePickerRef');


const onPickImage = (files: ChoosePhotoItem[] | null) => {
    console.log('onPickImage', files)
    dialogPickGallerryOrCamera.value = false;
    dialogPickGallerryOrCameraMultiple.value = false;
}
const onTackPicture = (file: ChoosePhotoItem | null) => {
    console.log('onTackPicture', file)
    dialogPickGallerryOrCamera.value = false;
    dialogPickGallerryOrCameraMultiple.value = false;
}

const onPickImageProcess = async () => {
    const files = await onPickPhoto(true);
    console.log('onPickImageProcess', files);
    if (files && files.length > 0) {
        for (const f of files) {
            onAddImagePreview(f.file, true, '', f.webPath);
        }
    }
}
const onTakeImageProcess = async () => {
    const file = await onTakePicture();
    console.log('onTakeImageProcess', file);
    if (file) {
        onAddImagePreview(file.file, true, '', file.webPath);
    }
}
const onAddImagePreview = (
    f: File | Blob | undefined,
    isImage: boolean,
    name: string | undefined,
    pathUrl: string | undefined = undefined
) => {
    if (f) {
        imagePickItems.value.push({
            id: 0,
            uniqueId: generateUUID(),
            fileMime: f.type,
            fileName: name || '',
            filePath: pathUrl || '',
            fileThumbnailPath: '',
            fileSize: f.size + '',
            functionId: 0,
            isImage,
            file: f
        });
    }
}
const onRemoveImagePickItem = (index: number) => {
    imagePickItems.value.splice(index, 1);
}

const openFilePicker = () => {
    if (filePickerRef.value) {
        filePickerRef.value.openFilePicker();
    }
};
const onFileAdded = async (files: File[]) => {
    console.log('onFileAdded', files);
};
</script>
<template>
    <BasePage page-title="File picker" fullscreen show-back-link>
        <BaseCard flat title="Image picker">
            <ion-card-content>
                <BaseButton full label="Single From gallerry/Camera" @click="dialogPickGallerryOrCamera = true" />
                <BaseButton full label="Multiple from gallerry/Camera"
                    @click="dialogPickGallerryOrCameraMultiple = true" />

                <BaseButton label="From gallerry" :icon=" { name: imageOutline, iconSet: 'ion' }" @click="onPickImageProcess" />
                <BaseButton label="From camera" :icon=" { name: cameraOutline, iconSet: 'ion' }" @click="onTakeImageProcess" />
            </ion-card-content>
            <ion-card-content>
                <IonList>
                    <BaseFilePreviewItemAlt v-for="(f, fileIndex) in imagePickItems"
                        :key="`pick-f-${f.id}-${fileIndex}${f.uniqueId ? f.uniqueId : ''}`" :item="f" :index="fileIndex"
                        show-delete :button="false" format-size @on-remove="onRemoveImagePickItem" />
                </IonList>
            </ion-card-content>
        </BaseCard>


        <BaseCard flat title="File picker">
            <ion-card-content>
                <BaseFilePicker v-model:file-items="filePickItems" label="Simple picker" multiple
                    :accept="FileTypeAcceptList" />
                <BaseButton full label="Custom UI" :icon=" { name: imageOutline, iconSet: 'ion' }" @click="openFilePicker" />
            </ion-card-content>
        </BaseCard>



        <BaseChoosePhoto v-if="dialogPickGallerryOrCamera" v-model="dialogPickGallerryOrCamera"
            v-model:files="imagePickItems" @on-pick-picture="onPickImage" @on-take-picture="onTackPicture" />
        <BaseChoosePhoto v-if="dialogPickGallerryOrCameraMultiple" v-model="dialogPickGallerryOrCameraMultiple"
            v-model:files="imagePickItems" multiple @on-pick-picture="onPickImage" @on-take-picture="onTackPicture" />

        <div style="display: none">
            <BaseFilePicker ref="filePickerRef" :icon="imageOutline" :show-preview="false" :wildcard="false" multiple
                @on-file-add="onFileAdded">
            </BaseFilePicker>
        </div>
    </BasePage>
</template>
