<script setup lang="ts">
import type { FileManagerDto } from '@/types/models';
import { useBase } from '@/composables/useBase';
import { defineAsyncComponent, onBeforeUnmount, onMounted, ref } from 'vue';
import type { FileType } from '@/types/common';
import FileManagerService from '@/api/FileManagerService';
import { fileToBlob, getFileType } from '@/utils/fileUtils';
import { useFileSystem } from '@/composables/useFileSystem';
const BasePdfViewDialog = defineAsyncComponent(() => import('@/components/base/BasePdfViewDialog.vue'));
const BaseImageViewDialog = defineAsyncComponent(() => import('@/components/base/BaseImageViewDialog.vue'));
const {
    fetch = false,
    selectIndex,
    title,
    item,
    imageList,
    isBlob = false
} = defineProps<{
    title?: string
    item: FileManagerDto
    imageList?: FileManagerDto[]
    selectIndex?: number
    fetch?: boolean
    isBlob?: boolean;
}>();
defineEmits(['on-close']);

const { checkFileSystemPermissions, requestFileSystemPermissions, requestCameraPermissions } = useFileSystem();
const show = defineModel<boolean>('show', { default: false });
const { appLoading } = useBase();
const { downloadCdnData } = FileManagerService();
const showView = ref(false);
const fileType = ref<FileType | undefined>(undefined);

const pdfSrc = ref<any>();
const closeTimeout = ref<any>(null);
const imageItems = ref<FileManagerDto[]>([]);
const selectFileIndex = ref(0);
onMounted(async () => {
    if (selectIndex != undefined && selectIndex >= 0) {
        selectFileIndex.value = selectIndex;
    }
    onLoad();
});
const onLoad = async () => {
    const loading: any = await appLoading();
    await detechFile();
    if (fileType.value == 'pdf') {
        if (fetch) {
            pdfSrc.value = item.filePath;
        } else if (item.file) {
            const b = await fileToBlob(item.file);
            if (b) {
                pdfSrc.value = b;
            }
        } else {
            pdfSrc.value = item.filePath;
        }
        showView.value = true;
    } else if (fileType.value == 'image') {
        // show image
        if (imageList && imageList.length > 0) {
            imageItems.value.push(...imageList);
        } else {
            imageItems.value.push(item);
        }
        showView.value = true;
    } else {
        // download file
        const permit = await checkFileSystemPermissions();
        if (permit) {
            if (fetch) {
                loading.present();
                try {
                    await onDownloadFile();
                } catch (error) {
                    console.error(error);
                } finally {
                    loading.dismiss();
                }
            }
            onClose();
        } else {
            await requestFileSystemPermissions();
            await requestCameraPermissions();
            onClose();
        }
    }
};
const onDownloadFile = async () => {
    const file = item;
    if (!file || !file.filePath || !fetch) {
        onClose();
    } else {
        await downloadCdnData(file.filePath, title);
    }
    return new Promise((resolve) => {
        resolve(true);
    });
};
const detechFile = async () => {
    return new Promise((resolve) => {
        const file = item;
        if (!file) {
            onClose();
        }
        fileType.value = getFileType(file.fileMime);
        resolve(true);
    });
};
const onClose = () => {
    showView.value = false;
    closeTimeout.value = setTimeout(() => {
        show.value = false;
    }, 500);
};

onBeforeUnmount(() => {
    if (closeTimeout.value) {
        clearTimeout(closeTimeout.value);
        closeTimeout.value = null;
    }
});
</script>

<template>
    <div v-if="show && item && fileType">
        <BasePdfViewDialog v-if="showView && fileType == 'pdf' && pdfSrc" v-model="showView" :src="pdfSrc"
            :title="title ? title : item.fileName" :is-blob="isBlob" @on-close="onClose" />
        <BaseImageViewDialog v-if="fileType == 'image' && showView" v-model="showView" :files="imageItems"
            :selected-index="selectFileIndex" @on-close="onClose" />
    </div>
</template>

<style scoped lang="scss"></style>
