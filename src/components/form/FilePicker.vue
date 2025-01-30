<script setup lang="ts">
import FilesPreviewItemAlt from '@/components/base/FilesPreviewItemAlt.vue';
import { useBase } from '@/composables/UseBase';
import { useLang } from '@/composables/UseLang';
import type { FileManagerDto } from '@/types/Models';
import { generateUUID, getImgUrlFromFile, isImageFile } from '@/utils/AppUtil';
import { FileTypeAcceptList, LIMIT_FILE_SIZE, LIMIT_FILE_SIZE_MB } from '@/utils/Constant';
import { zipFile } from '@/utils/FileUtils';
import { IonIcon, IonItem, IonLabel, IonList, IonNote } from '@ionic/vue';
import { attachOutline, imagesOutline } from 'ionicons/icons';
import { ref } from 'vue';

const props = withDefaults(defineProps<{
  multiple: boolean
  showPreview?: boolean
  showDelete?: boolean
  icon?: string
  label?: string
  accept?: string[]
  imageSize?: string
  iconSize?: number
  wildcard?: boolean
}>(), {
  multiple: false,
  showPreview: true,
  showDelete: true,
  wildcard: false,
  icon: imagesOutline,
  imageSize: '75px',
  accept: () => [
    'image/png',
    'image/jpeg'
  ]
});
const emit = defineEmits(['on-file-add']);
const { t } = useLang();
const { WeeToast } = useBase();
const modelValue = defineModel<any[]>();
const modelImageFiles = ref<any>(null);
const filesPreview = ref<FileManagerDto[]>([]);
const fileItems = defineModel<FileManagerDto[]>('fileItems', { default: () => [] });
const oldImageDeleteItems = ref<FileManagerDto[]>([]);
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
        const existType = props.accept.find(t => t == f.type);
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
        WeeToast({
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
  if (!props.wildcard) {
    files = await getValidFiles(selectFiles);
  } else {
    files = await validateAndZipFile(selectFiles);
  }

  if (rejectTotal.value > 0) {
    WeeToast({
      text: t('error.filesValidationFmt', { total: rejectTotal.value }),
      color: 'danger'
    });
  }
  if (files.length == 0) {
    return;
  }
  emit('on-file-add', files);
  if (props.multiple) {
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

const findDeleteImageIndexById = (fileId: number): number => {
  if (oldImageDeleteItems.value.length > 0) {
    return oldImageDeleteItems.value.findIndex(t => t.id == fileId);
  }
  return -1;
};

defineExpose({
  openFilePicker
});
</script>

<template>
  <div v-bind="$attrs" v-if="modelValue">
    <slot name="button">
      <ion-item button lines="full" @click="openFilePicker">
        <ion-icon slot="start" :icon="attachOutline" />
        <ion-label>
          {{ label }}
        </ion-label>
        <ion-note slot="end">{{ modelValue.length }}</ion-note>
      </ion-item>
    </slot>
    <ion-list v-if="showPreview && fileItems.length > 0 && modelValue && modelValue.length > 0">
      <template
        v-for="(f, fileIndex) in filesPreview"
        :key="`f-${f.id}-${fileIndex}`"
      >
        <files-preview-item-alt
          :item="f"
          :index="fileIndex"
          @on-remove="onRemoveNewImage"
          :fetch="!!(f.id && f.id > 0)"
          dense
          :image-size="imageSize"
          :icon-size="iconSize"
          :show-delete="showDelete"
        ></files-preview-item-alt>
      </template>
    </ion-list>

    <input style="display: none"
           type="file"
           ref="filePickerInputRef"
           @change="onFileAdded"
           :multiple
           :accept="!wildcard ? accept.toString() : undefined">
  </div>
</template>

<style scoped lang="scss">

</style>
