<script setup lang="ts">
import BaseCard from '@/components/base/BaseCard.vue';
import BaseFilePreviewItem from '@/components/base/BaseFilePreviewItem.vue';
import BaseFilePreviewItemAlt from '@/components/base/BaseFilePreviewItemAlt.vue';
import BaseImageView from '@/components/base/BaseImageView.vue';
import BaseLayout from '@/components/base/BaseLayout.vue';
import BaseTextHeader from '@/components/base/BaseTextHeader.vue';
import { useTheme } from '@/composables/useTheme';
import type { FileManagerDto } from '@/types/models';
import BaseFileView from '@/components/base/BaseFileView.vue';
import {
    IonCardContent,
    IonCol,
    IonGrid,
    IonList,
    IonRow
} from '@ionic/vue';
import { computed, defineAsyncComponent, ref } from 'vue';
const BaseImageViewDialog = defineAsyncComponent(() => import('@/components/base/BaseImageViewDialog.vue'));
const BasePdfViewDialog = defineAsyncComponent(() => import('@/components/base/BasePdfViewDialog.vue'));
// const BaseFileView = defineAsyncComponent(() => import('@/components/base/BaseFileView.vue'));

const { isDark } = useTheme();
const imageSelectIndex = ref<number>(0);
const showImageView = ref(false);
const imageItems = ref<FileManagerDto[]>([
    {
        id: 1,
        fileMime: 'image/jpeg',
        fileName: 'Img001.jpg',
        filePath: 'https://images.pexels.com/photos/29009130/pexels-photo-29009130/free-photo-of-misty-mountain-road-in-madeira-portugal.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        fileThumbnailPath: '',
        fileSize: '2 MB',
        isImage: true,
    },
    {
        id: 2,
        fileMime: 'image/jpeg',
        fileName: 'Img002.jpg',
        filePath: 'https://images.pexels.com/photos/14775022/pexels-photo-14775022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        fileThumbnailPath: '',
        fileSize: '2 MB',
        isImage: true,
    },
    {
        id: 3,
        fileMime: 'image/jpeg',
        fileName: 'Img003.jpg',
        filePath: 'https://images.pexels.com/photos/8140820/pexels-photo-8140820.jpeg',
        fileThumbnailPath: '',
        fileSize: '2 MB',
        isImage: true,
    },
    {
        id: 4,
        fileMime: 'image/jpeg',
        fileName: 'Img004.jpg',
        filePath: 'https://images.pexels.com/photos/27796242/pexels-photo-27796242/free-photo-of-people-standing-outside-a-store-with-the-words-good-luck.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        fileThumbnailPath: '',
        fileSize: '2 MB',
        isImage: true,
    },
    {
        id: 5,
        fileMime: 'image/jpeg',
        fileName: 'Img005.jpg',
        filePath: 'https://images.pexels.com/photos/28637782/pexels-photo-28637782/free-photo-of-vintage-desert-gas-station-with-cafe-sign.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        fileThumbnailPath: '',
        fileSize: '2 MB',
        isImage: true,
    },
    {
        id: 6,
        fileMime: 'image/jpeg',
        fileName: 'Img006.jpg',
        filePath: 'https://images.pexels.com/photos/21294005/pexels-photo-21294005/free-photo-of-portrait-of-woman-blowing-dandelion-flower.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        fileThumbnailPath: '',
        fileSize: '2 MB',
        isImage: true,
    },
    // {
    //     id: 7,
    //     fileMime: 'image/jpeg',
    //     fileName: 'Img007.jpg',
    //     filePath: 'https://images.pexels.com/photos/27869817/pexels-photo-27869817/free-photo-of-two-women-sitting-on-a-couch-together.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    //     fileThumbnailPath: '',
    //     fileSize: '2 MB',
    //     isImage: true,
    // },
    // {
    //     id: 8,
    //     fileMime: 'image/jpeg',
    //     fileName: 'Img008.jpg',
    //     filePath: 'https://images.pexels.com/photos/28924817/pexels-photo-28924817/free-photo-of-hong-kong-island-dazzling-night-skyline.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    //     fileThumbnailPath: '',
    //     fileSize: '2 MB',
    //     isImage: true,
    // },
    // {
    //     id: 9,
    //     fileMime: 'image/jpeg',
    //     fileName: 'Img009.jpg',
    //     filePath: 'https://images.pexels.com/photos/29008754/pexels-photo-29008754/free-photo-of-scenic-desert-highway-at-sunrise-in-utah.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    //     fileThumbnailPath: '',
    //     fileSize: '2 MB',
    //     isImage: true,
    // },
    // {
    //     id: 10,
    //     fileMime: 'image/jpeg',
    //     fileName: 'Img010.jpg',
    //     filePath: 'https://images.pexels.com/photos/25244460/pexels-photo-25244460/free-photo-of-a-fashionable-young-woman-standing-on-a-meadow.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    //     fileThumbnailPath: '',
    //     fileSize: '2 MB',
    //     isImage: true,
    // },
    // {
    //     id: 11,
    //     fileMime: 'image/jpeg',
    //     fileName: 'Img011.jpg',
    //     filePath: 'https://images.pexels.com/photos/27467770/pexels-photo-27467770/free-photo-of-laptop-and-camera-on-desk.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    //     fileThumbnailPath: '',
    //     fileSize: '2 MB',
    //     isImage: true,
    // },
    // {
    //     id: 12,
    //     fileMime: 'image/jpeg',
    //     fileName: 'Img011.jpg',
    //     filePath: 'https://images.pexels.com/photos/28271613/pexels-photo-28271613/free-photo-of-a-car-mirror-is-shown-in-the-side-view-of-a-road.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    //     fileThumbnailPath: '',
    //     fileSize: '2 MB',
    //     isImage: true,
    // },
]);
const showPdfView = ref(false);
const pdfSrc = ref<string>();
const pdfName = ref<string>();
const pdfItems = ref<FileManagerDto[]>([
    {
        id: 1,
        fileMime: 'application/pdf',
        fileName: 'Trace-based Just-in-Time Type Specialization for Dynamic Languages',
        filePath: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
        fileThumbnailPath: '',
        fileSize: '2 MB',
        isImage: false,
    },
])

const showMixFiles = ref(false);
const fileMixImageSelectIndex = ref<number>(0);
const fileImageItemsForView = ref<FileManagerDto[]>([]);
const fileMixForView = ref<FileManagerDto>();
const mixItems = ref<FileManagerDto[]>(imageItems.value.concat(pdfItems.value))
const onImgPreviewClick = async (index: number) => {
    imageSelectIndex.value = index;
    showImageView.value = true;
};
const onImgPreviewClose = () => {
    imageSelectIndex.value = 0;
    showImageView.value = false;
};
const onDeleteImage = (index: number) => {
    console.log('onDeleteImage', index);
}
const onPdfPreviewClick = async (index: number) => {
    const item = pdfItems.value[index];
    if (item) {
        pdfSrc.value = item.filePath;
        pdfName.value = item.fileName;
        showPdfView.value = true;
    }
};
const onClosePefView = () => {
    pdfSrc.value = undefined;
    pdfName.value = undefined;
    showPdfView.value = false;
}

const onMixPreviewClick = async (index: number) => {
    showMixFiles.value = false;
    fileMixImageSelectIndex.value = 0;
    fileImageItemsForView.value = [];
    const file = mixItems.value[index];
    if (file) {
        if (file.isImage) {
            await setImagesFileView(file);
        }
        fileMixForView.value = file;
        showMixFiles.value = true;
    }
}
const getImageItems = computed(() => mixItems.value.filter(f => f.isImage));
const setImagesFileView = (file: FileManagerDto) => {
    return new Promise((resolve) => {
        const index = getImageItems.value.findIndex(t => t.id == file.id);
        if (index >= 0) {
            const list = getImageItems.value;
            for (const f of list) {
                if (f) {
                    fileImageItemsForView.value.push(f);
                }
            }
            fileMixImageSelectIndex.value = index;
        }
        resolve(true);
    });
};
</script>
<template>
    <BaseLayout page-title="Image/Pdf View" fullscreen show-back-link>
        <BaseCard title="Image">
            <BaseTextHeader label="Grid" caption="Tab image to view" />
            <IonGrid class="ion-no-padding">
                <IonRow>
                    <IonCol v-for="(item, i) in imageItems" :key="`img-${i}-${item.fileName}`"
                        class="ion-no-margin ion-no-padding" size="4">
                        <BaseFilePreviewItem :index="i" :item="item" @on-click="onImgPreviewClick" />
                    </IonCol>
                </IonRow>
            </IonGrid>

            <BaseTextHeader label="List" caption="Tab image to view" />
            <IonList>
                <BaseFilePreviewItemAlt v-for="(itemAlt, iAlt) in imageItems" :key="`img-${iAlt}-${itemAlt.fileName}`"
                    :item="itemAlt" :index="iAlt" :show-delete="false" button :format-size="false"
                    @on-click="onImgPreviewClick" />
            </IonList>

            <BaseTextHeader label="Image Slide" caption="Swip left right image to view" />
            <IonCardContent>
                <BaseImageView :files="imageItems" :dark="isDark" height="250px" />
            </IonCardContent>
        </BaseCard>
        <BaseCard title="Pdf">
            <IonCardContent>
                <IonList>
                    <BaseFilePreviewItemAlt v-for="(pdf, pdfIndex) in pdfItems" :key="`impdfg-${pdfIndex}-${pdf.id}`"
                        :item="pdf" :index="pdfIndex" :show-delete="false" button detail :format-size="false"
                        @on-click="onPdfPreviewClick" />
                </IonList>
            </IonCardContent>


            <!-- <BaseTextHeader label="Pdf inline display" />
            <BasePdfView src="https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"
                :closeable="false" title="compressed.tracemonkey-pldi-09.pdf" min-height="350px" /> -->
        </BaseCard>
        <BaseCard title="Mix item View">
            <IonCardContent>
                <IonList>
                    <BaseFilePreviewItemAlt v-for="(m, mIndex) in mixItems" :key="`impdfg-${mIndex}-${m.fileName}`"
                        :item="m" :index="mIndex" :show-delete="false" button detail :format-size="false"
                        @on-click="onMixPreviewClick" />
                </IonList>
            </IonCardContent>
        </BaseCard>

        <BaseImageViewDialog v-if="showImageView" v-model="showImageView" :files="imageItems"
            :selected-index="imageSelectIndex" show-delete-image @on-delete="onDeleteImage"
            @on-close="onImgPreviewClose" />

        <BasePdfViewDialog v-if="showPdfView && pdfSrc" v-model="showPdfView" :src="pdfSrc" :title="pdfName"
            @on-close="() => onClosePefView" />

        <BaseFileView v-if="showMixFiles && fileMixForView" v-model:show="showMixFiles" :item="fileMixForView"
            :image-list="fileImageItemsForView" :select-index="fileMixImageSelectIndex" title="Images" />
    </BaseLayout>
</template>
