<script setup lang="ts">
import BaseFilePreviewItemAlt from '@/components/base/BaseFilePreviewItemAlt.vue';
import { useBase } from '@/composables/useBase';
import { useLang } from '@/composables/useLang';
import { FileTypeAcceptList, LIMIT_FILE_SIZE, LIMIT_FILE_SIZE_MB } from '@/libs/constant';
import type { ItemLines } from '@/types/common';
import type { FileManagerDto } from '@/types/models';
import { generateUUID } from '@/utils/appUtil';
import { getImgUrlFromFile, zipFile, isImageFile } from '@/utils/fileUtils';
import { IonIcon, IonItem, IonLabel, IonList, IonNote } from '@ionic/vue';
import { documentAttachOutline } from 'ionicons/icons';
import { ref } from 'vue';

const {
    multiple = false,
    showPreview = true,
    showDelete = true,
    wildcard = false,
    icon = documentAttachOutline,
    imageSize = '75px',
    accept = [
        'image/png',
        'image/jpeg'
    ],
    lines = 'none'
} = defineProps<{
    multiple?: boolean
    showPreview?: boolean
    showDelete?: boolean
    icon?: string
    label?: string
    accept?: string[]
    imageSize?: string
    iconSize?: number
    wildcard?: boolean
    lines?: ItemLines
}>();
const emit = defineEmits(['on-file-add']);
const { t } = useLang();
const { appToast } = useBase();
const modelValue = defineModel<any[]>({ default: [] });
const modelImageFiles = ref<any>(null);
const fileItems = defineModel<FileManagerDto[]>('fileItems', { default: [] });
const filePickerInputRef = ref<any>(null);

const rejectTotal = ref(0);
const openFilePicker = () => {
    if (!filePickerInputRef.value) {
        return;
    }
    filePickerInputRef.value.click();
};
const getValidFiles = async (files: File[]): Promise<any[]> => {
    return new Promise((resolve) => {
        const validFiles: any[] = [];
        for (const f of files) {
            if (f.type) {
                const existType = accept.find(t => t == f.type);
                if (!existType || f.size > LIMIT_FILE_SIZE) {
                    rejectTotal.value++;
                } else {
                    validFiles.push(f);
                }
            } else {
                rejectTotal.value++;
            }
        }
        resolve(validFiles);
    });
};
const validateAndZipFile = async (files: File[]): Promise<any[]> => {
    const validFiles: any[] = [];
    for (const f of files) {
        if (f.type) {
            if (f.size > LIMIT_FILE_SIZE) {
                appToast({
                    text: t('error.limitEachFile2', [f.name, LIMIT_FILE_SIZE_MB]),
                    color: 'danger'
                });
                rejectTotal.value++;
            } else {
                const existType = FileTypeAcceptList.includes(f.type);
                if (!existType) {
                    const ziped = await zipFile(f);
                    if (ziped) {
                        validFiles.push(ziped);
                    }
                } else {
                    validFiles.push(f);
                }
            }
        } else {
            rejectTotal.value++;
        }
    }
    return new Promise((resolve) => {
        resolve(validFiles);
    });
};
const onFileAdded = async (event: any) => {
    rejectTotal.value = 0;
    const selectFiles = event.target.files;
    if (!selectFiles) {
        return;
    }
    let files: any[];
    if (!wildcard) {
        files = await getValidFiles(selectFiles);
    } else {
        files = await validateAndZipFile(selectFiles);
    }

    if (rejectTotal.value > 0) {
        appToast({
            text: t('error.filesValidationFmt', { total: rejectTotal.value }),
            color: 'danger'
        });
    }
    if (files.length == 0) {
        return;
    }
    emit('on-file-add', files);
    if (multiple) {
        if (files && files.length > 0) {
            for (const f of files) {
                await onAddFile(f);
            }
        }
    } else if (files) {
        modelValue.value = [];
        await onAddFile(files[0]);
    }
    modelImageFiles.value = null;
};
const onAddFile = async (f: any) => {
    const isImg = isImageFile(f);
    let url;
    if (isImg) {
        url = await getImgUrlFromFile(f);
    }
    onAddFilePreview(f, isImg, url);
};
const onAddFilePreview = (
    f: File,
    isImage: boolean,
    pathUrl: string | undefined = undefined
) => {
    if (modelValue.value) {
        modelValue.value.push(f);
        fileItems.value.push({
            id: 0,
            uniqueId: generateUUID(),
            fileMime: f.type,
            fileName: f.name,
            filePath: pathUrl || '',
            fileThumbnailPath: '',
            fileSize: f.size + '',
            functionId: 0,
            isImage,
            file: f
        });
    }
};
const onRemoveNewImage = (index: number) => {
    if (!modelValue.value) {
        return;
    }
    modelValue.value.splice(index, 1);
    fileItems.value.splice(index, 1);
};
defineExpose({
    openFilePicker
});
</script>

<template>
    <div v-if="modelValue" v-bind="$attrs">
        <slot name="button">
            <ion-item class="input" button :lines @click="openFilePicker">
                <ion-icon slot="start" :icon="icon" />
                <ion-label>
                    {{ label || t('base.chooseFromFile') }}
                </ion-label>
                <ion-note slot="end">{{ modelValue.length }}</ion-note>
            </ion-item>
        </slot>
        <ion-list v-if="showPreview && fileItems.length > 0 && modelValue && modelValue.length > 0" class="q-my-md">
            <template v-for="(f, fileIndex) in fileItems" :key="`f-${fileIndex}-${f.uniqueId}-${f.id}`">
                <BaseFilePreviewItemAlt :item="f" :index="fileIndex" dense
                     :image-size="imageSize" :icon-size="iconSize" :show-delete="showDelete"
                    @on-remove="onRemoveNewImage" />
            </template>
        </ion-list>

        <input ref="filePickerInputRef" style="display: none" type="file" :multiple :accept="!wildcard ? accept.toString() : undefined"
            @change="onFileAdded">
    </div>
</template>

<style scoped lang="scss"></style>
<style scoped lang="scss">
ion-item.input {
    border: 1px solid var(--app-border-color);
    border-radius: 10px;
    --background: var(--app-input-backgroud);
}
</style>