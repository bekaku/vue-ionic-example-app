<script setup lang="ts">
import FileManagerService from '@/api/FileManagerService';
import { getBlobFromAxiosResponse, getFileNameFromAxiosResponse } from '@/utils/fileUtils';
import { IonButton, IonButtons, IonCol, IonIcon, IonRow, IonToolbar } from '@ionic/vue';
import { biDownload } from '@quasar/extras/bootstrap-icons';
import {
    addCircleOutline,
    arrowBackCircleOutline,
    arrowForwardCircleOutline,
    removeCircleOutline
} from 'ionicons/icons';
import { onMounted, ref } from 'vue';
import SkeletonListItem from '../skeleton/SkeletonListItem.vue';
import BaseButton from './BaseButton.vue';
import BasePdfViewCore from './BasePdfViewCore.vue';
import BaseSpinner from './BaseSpinner.vue';
const { src,
    title,
    showDownload = true,
    fetch = false,
    isBlob = false,
    minHeight = '90vh',
    minWidth = '100%',
} = defineProps<{
    title?: string;
    src: string;
    fetch?: boolean;
    showDownload?: boolean
    isBlob?: boolean
    scrollHeight?: string
    minHeight?: string
    minWidth?: string
    closeable?: boolean
}>();
const { fethCdnData, downloadCdnData } = FileManagerService();
const pdfSrc = ref<any>();
const loading = ref(true);
const downloadLoading = ref(false);
const fileName = ref();
const contentType = ref();
const scale = ref(1);
const page = ref(1);
const pages = ref(0);
onMounted(async () => {
    onLoad();
});
const onLoad = async () => {
    loading.value = true;
    if (fetch) {
        const response = await fethCdnData(src, 'axiosresponse');
        if (response) {
            pdfSrc.value = await getBlobFromAxiosResponse(response);
            contentType.value = response.headers['content-type'];
            fileName.value = getFileNameFromAxiosResponse(response);
            loading.value = false;
        }
    } else {
        pdfSrc.value = src;
        loading.value = false;
    }
};
const downloadPdf = async () => {
    downloadLoading.value = true;
    if (fetch) {
        await downloadCdnData(src, title);
    } else {
        if (isBlob) {
            try {
                // downloadFromBlob(src, title || 'pdf_file.pdf');
            } catch (err) {
                console.error(err)
            }
        } else {
            // downloadFileFromUrl(src, title || 'pdf_file.pdf');
        }
    }
    downloadLoading.value = false;
};
</script>
<template>
    <IonRow :style="{ minHeight, minWidth }">
        <IonCol class="ion-no-padding">
            <ion-toolbar>
                <ion-row class="ion-justify-content-center ion-align-items-center">
                    <ion-buttons>
                        <ion-button @click="scale = scale > 0.25 ? scale - 0.25 : scale">
                            <ion-icon slot="icon-only" class="text-black" :icon="removeCircleOutline"></ion-icon>
                        </ion-button>
                        <span>{{ scale * 100 + '%' }}</span>
                        <ion-button @click="scale = scale < 2 ? scale + 0.25 : scale">
                            <ion-icon slot="icon-only" class="text-black" :icon="addCircleOutline"></ion-icon>
                        </ion-button>

                        <ion-button @click="page = page > 1 ? page - 1 : page">
                            <ion-icon slot="icon-only" class="text-black" :icon="arrowBackCircleOutline"></ion-icon>
                        </ion-button>
                        <span>{{ page }} / {{ pages }}</span>
                        <ion-button @click="page = page < pages ? page + 1 : page">
                            <ion-icon slot="icon-only" class="text-black" :icon="arrowForwardCircleOutline"></ion-icon>
                        </ion-button>
                        <!-- <ion-button v-if="showDownload && !loading" @click="downloadPdf">
                            <ion-icon slot="icon-only" class="text-black" :icon="downloadOutline"></ion-icon>
                        </ion-button> -->
                        <BaseButton v-if="showDownload && !loading" clear icon-only :icon-size="30" icon-set="bootstrap-icons"
                           :icon=" { name: biDownload, iconSet: 'bootstrap-icons' }" @click="downloadPdf" />
                    </ion-buttons>
                </ion-row>
            </ion-toolbar>
            <BaseSpinner v-if="downloadLoading" />
            <template v-if="loading">
                <SkeletonListItem :items="1" />
            </template>
            <template v-else-if="pdfSrc">
                <BasePdfViewCore v-model:scale="scale" v-model:page="page" v-model:pagess="pages" :src="pdfSrc"
                    :scroll-height="minHeight" />
            </template>
        </IonCol>
    </IonRow>
</template>