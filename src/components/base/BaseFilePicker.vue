<script setup lang="ts">
import BaseFilePreviewItemAlt from '@/components/base/BaseFilePreviewItemAlt.vue';
import { useBase } from '@/composables/useBase';
import { useLang } from '@/composables/useLang';
import {
  FileTypeAcceptList,
  LIMIT_FILE_SIZE,
  LIMIT_FILE_SIZE_MB,
  maxImageToResize,
  maxImageToResizeMb,
} from '@/libs/constant';
import type { FileMimeType, ImageDimensions, ItemLines } from '@/types/common';
import type { FileManager } from '@/types/models';
import {
  getFileMimeType,
  getImageDimensions,
  getImgUrlFromFile,
  resizeImage,
  zipFile,
} from '@/utils/FileUtils';
import { generateSnowFlakeId, idToString } from '@/utils/snowflake';
import {
  IonCol,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonRow,
} from '@ionic/vue';
import { documentAttachOutline } from 'ionicons/icons';
import { ref } from 'vue';
import BaseFileItems from './BaseFileItems.vue';

const {
  multiple = false,
  showPreview = true,
  showDelete = true,
  wildcard = false,
  icon = documentAttachOutline,
  imageSize = '75px',
  accept = ['image/png', 'image/jpeg'],
  lines = 'none',
  formatSize = false,
  priviewLayout = 'list',
} = defineProps<{
  multiple?: boolean;
  showPreview?: boolean;
  showDelete?: boolean;
  icon?: string;
  label?: string;
  accept?: string[];
  imageSize?: string;
  iconSize?: number;
  wildcard?: boolean;
  lines?: ItemLines;
  formatSize?: boolean;
  priviewLayout?: 'list' | 'grid';
  softDelete?: boolean;
  progress?: number;
}>();
const emit = defineEmits<{
  'on-file-add': [files: File[] | File | null | undefined];
  'on-remove': [index: number];
  'on-click': [index: number];
  'on-soft-delete': [index: number];
}>();
const { t } = useLang();
const { appToast } = useBase();
const modelValue = defineModel<FileManager[]>({ default: () => [] });
const modelImageFiles = ref<any>(null);
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
        const existType = accept.find((t) => t == f.type);
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
          color: 'danger',
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
      color: 'danger',
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
const onAddFile = async (f: any): Promise<void> => {
  if (f) {
    const fileMimeType = getFileMimeType(f);
    let url: string | undefined;
    let dimensions: ImageDimensions | undefined;
    let file: File = f;
    if (fileMimeType && fileMimeType == 'IMAGE') {
      dimensions = await getImageDimensions(f);
      if (
        dimensions &&
        (dimensions.height > maxImageToResize ||
          dimensions.width > maxImageToResizeMb)
      ) {
        const coompressFile = await resizeImage(f, {
          maxSizeMB: maxImageToResizeMb,
          maxWidthOrHeight: maxImageToResize,
          useWebWorker: true,
        });
        if (coompressFile) {
          file = coompressFile;
        }
      }
      url = await getImgUrlFromFile(file);
    }
    onAddFilePreview(file, fileMimeType, dimensions, url);
  }
};
const onAddFilePreview = (
  f: File,
  fileMimeType: FileMimeType | undefined,
  dimensions?: ImageDimensions,
  pathUrl: string | undefined = undefined,
) => {
  if (modelValue.value) {
    modelValue.value.push({
      id: null,
      uniqueId: idToString(generateSnowFlakeId()),
      fileMime: f.type,
      fileName: f.name,
      filePath: pathUrl || '',
      fileThumbnailPath: '',
      fileSize: f.size,
      functionId: 0,
      fileMimeType,
      file: f,
      width: dimensions?.width || 0,
      height: dimensions?.height || 0,
    });
  }
};
const onRemove = (index: number) => {
  emit('on-remove', index);
  if (modelValue.value[index]) {
    modelValue.value.splice(index, 1);
  }
};
const onSoftDelete = (index: number) => {
  emit('on-soft-delete', index);
  const item = modelValue.value[index];
  if (item) {
    item.deleteFlag = !item.deleteFlag;
  }
};
const onClick = async (event: any, index: number) => {
  console.log('onClick', { index, event });
};
defineExpose({
  openFilePicker,
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

    <IonRow
      v-if="
        showPreview &&
        modelValue &&
        modelValue.length > 0
      "
      class="q-my-md"
    >
      <IonCol class="ion-no-padding ion-no-margin">
        <BaseFileItems
          :items="modelValue"
          :layout="priviewLayout"
          :soft-delete="softDelete"
          :show-delete="showDelete"
          :show-progress="false"
          :progress="progress"
          @on-click="onClick;"
          @on-remove="onRemove"
          @on-soft-delete="onSoftDelete"
        />
      </IonCol>
    </IonRow>
    <!-- <ion-list
      v-if="
        showPreview &&
        fileItems.length > 0 &&
        modelValue &&
        modelValue.length > 0
      "
      class="q-my-md"
    >
      <template
        v-for="(f, fileIndex) in fileItems"
        :key="`f-${fileIndex}-${f.uniqueId}-${f.id}`"
      >
        <BaseFilePreviewItemAlt
          :item="f"
          :index="fileIndex"
          dense
          :format-size="formatSize"
          :image-size="imageSize"
          :icon-size="iconSize"
          :show-delete="showDelete"
          @on-remove="onRemoveNewImage"
        />
      </template>
    </ion-list> -->

    <input
      ref="filePickerInputRef"
      style="display: none"
      type="file"
      :multiple
      :accept="!wildcard ? accept.toString() : undefined"
      @change="onFileAdded"
    />
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
