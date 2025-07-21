<script setup lang="ts">
import FileManagerService from '@/api/FileManagerService';
import { useBase } from '@/composables/useBase';
import { useFileDownload } from '@/composables/useFileDownload';
import { useLang } from '@/composables/useLang';
import type { FileManagerDto } from '@/types/models';
import { getCurrentFormattedDatetime } from '@/utils/dateUtil';
import {
    getBlobFromAxiosResponse,
    getFileNameFromAxiosResponse,
} from '@/utils/fileUtils';
import {
    IonButton,
    IonButtons,
    IonCol,
    IonIcon,
    IonRow,
    IonToolbar,
} from '@ionic/vue';
import {
    addCircleOutline,
    arrowBackCircleOutline,
    arrowForwardCircleOutline,
    downloadOutline,
    removeCircleOutline,
    shareSocialOutline,
} from 'ionicons/icons';
import { onMounted, ref } from 'vue';
import SkeletonListItem from '../skeleton/SkeletonListItem.vue';
import BaseIcon from './BaseIcon.vue';
import BasePdfViewCore from './BasePdfViewCore.vue';
import BaseSpinner from './BaseSpinner.vue';
const {
  src,
  title,
  showDownload = true,
  showShare = true,
  fetch = false,
  isBlob = false,
  minHeight = '90vh',
  minWidth = '100%',
  item,
} = defineProps<{
  title?: string;
  src: string;
  fetch?: boolean;
  showDownload?: boolean;
  isBlob?: boolean;
  scrollHeight?: string;
  minHeight?: string;
  minWidth?: string;
  closeable?: boolean;
  showShare?: boolean;
  item?: FileManagerDto;
}>();
const { fethCdnData, downloadCdnData } = FileManagerService();
const { downloadDocument, downloadState, downloadAndShareFile } =
  useFileDownload();
const { t } = useLang();
const { appLoading, appToast } = useBase();
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
  console.log('downloadPdfV2', JSON.stringify(item));
  const loader: any = await appLoading();
  try {
    loader.present();
    await downloadDocument(
      item?.filePath || src,
      item?.fileName || `gd5_auto_${getCurrentFormattedDatetime()}.pdf`,
    );
    appToast({
      text: t('success.saved'),
    });
  } catch (error) {
    appToast({
      text: `Cannot download file: ${error}`,
      color: 'danger',
      time: 2000,
    });
  } finally {
    loader.dismiss();
  }
  return new Promise((resolve) => {
    resolve(true);
  });
};
const onShare = async () => {
  if (!item || !item.filePath) {
    return;
  }
  console.log('onShare', JSON.stringify(item));
  const loader: any = await appLoading();
  try {
    loader.present();
    await downloadAndShareFile(item.filePath, item.fileName);
  } catch (error) {
    appToast({
      text: `Cannot share file: ${error}`,
      color: 'danger',
      time: 2000,
    });
  } finally {
    loader.dismiss();
  }
};
</script>
<template>
  <IonRow :style="{ minHeight, minWidth }">
    <IonCol class="ion-no-padding">
      <ion-toolbar>
        <ion-row class="ion-justify-content-center ion-align-items-center">
          <ion-buttons>
            <ion-button @click="scale = scale > 0.25 ? scale - 0.25 : scale">
              <ion-icon
                slot="icon-only"
                class="text-black"
                :icon="removeCircleOutline"
              ></ion-icon>
            </ion-button>
            <span>{{ scale * 100 + '%' }}</span>
            <ion-button @click="scale = scale < 2 ? scale + 0.25 : scale">
              <ion-icon
                slot="icon-only"
                class="text-black"
                :icon="addCircleOutline"
              ></ion-icon>
            </ion-button>

            <ion-button @click="page = page > 1 ? page - 1 : page">
              <ion-icon
                slot="icon-only"
                class="text-black"
                :icon="arrowBackCircleOutline"
              ></ion-icon>
            </ion-button>
            <span>{{ page }} / {{ pages }}</span>
            <ion-button @click="page = page < pages ? page + 1 : page">
              <ion-icon
                slot="icon-only"
                class="text-black"
                :icon="arrowForwardCircleOutline"
              ></ion-icon>
            </ion-button>
            <ion-button v-if="showDownload && !loading" @click="downloadPdf">
              <base-icon :name="downloadOutline" iconSet="ion"></base-icon>
            </ion-button>
            <ion-button v-if="showShare && !loading" @click="onShare">
              <base-icon :name="shareSocialOutline" icon-set="ion"></base-icon>
            </ion-button>
          </ion-buttons>
        </ion-row>
      </ion-toolbar>
      <BaseSpinner v-if="downloadState.isDownloading" />
      <template v-if="loading">
        <SkeletonListItem :items="1" />
      </template>
      <template v-else-if="pdfSrc">
        <BasePdfViewCore
          v-model:scale="scale"
          v-model:page="page"
          v-model:pagess="pages"
          :src="pdfSrc"
          :scroll-height="minHeight"
        />
      </template>
    </IonCol>
  </IonRow>
</template>
