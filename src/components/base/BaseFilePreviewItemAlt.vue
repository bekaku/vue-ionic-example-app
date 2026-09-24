<script setup lang="ts">
import BaseIcon from '@/components/base/BaseIcon.vue';
import BaseImage from '@/components/base/BaseImage.vue';
import type { ItemLines } from '@/types/common';
import type { FileManager } from '@/types/models';
import { formatBytes } from '@/utils/AppUtil';
import { getFileTypeIcon } from '@/utils/FileUtils';
import {
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonLabel,
  IonProgressBar,
  IonRow,
} from '@ionic/vue';
import { checkmarkCircle, trashOutline } from 'ionicons/icons';
import BaseEllipsis from './BaseEllipsis.vue';
import { computed } from 'vue';

const {
  showDelete = true,
  formatSize = false,
  fetch = false,
  imageSize = '75px',
  iconSize = 32,
  wrapText = true,
  lines = 'none',
  button = true,
  detail = false,
  limitLinesName = 2,
  useThumbnail = false,
  item,
} = defineProps<{
  showDelete?: boolean;
  col?: string;
  item: FileManager;
  index: number;
  formatSize?: boolean;
  imageSize?: string;
  iconSize?: number;
  fetch?: boolean;
  wrapText?: boolean;
  button?: boolean;
  lines?: ItemLines;
  detail?: boolean;
  useThumbnail?: boolean;
  limitLinesName?: number;
}>();
// const emit = defineEmits(['on-remove', 'on-click']);
const emit = defineEmits<{
  'on-remove': [index: number];
  'on-click': [index: number, event: any];
}>();
const isMedia = computed(
  () => item.fileMimeType === 'IMAGE' || item.fileMimeType === 'VIDEO',
);
const getImagePath = computed(() => {
  if (item.fileMimeType === 'IMAGE') {
    return useThumbnail && item.fileThumbnailPath
      ? item.fileThumbnailPath
      : item.filePath;
  }
  if (item.fileMimeType === 'VIDEO') {
    return item.fileThumbnailPath || '';
  }
  return '';
});
const onRemove = (event: any, index: number) => {
  if (event) {
    event.stopImmediatePropagation();
  }
  emit('on-remove', index);
};
const onClick = (event: any, index: number) => {
  if (event) {
    event.stopImmediatePropagation();
  }
  emit('on-click', index, event);
};
</script>

<template>
  <ion-item
    v-bind="$attrs"
    :lines="lines"
    :button
    :detail
    @click="onClick($event, index)"
  >
    <div slot="start">
      <template v-if="isMedia && getImagePath">
        <base-image
          :style="{ height: `${imageSize}`, width: `${imageSize}` }"
          :fetch="fetch"
          :src="getImagePath"
          ratio="4/3"
        />
      </template>
      <template v-else>
        <base-icon
          :name="getFileTypeIcon(item.fileMime)"
          icon-set="bootstrap-icons"
          :size="iconSize"
        />
      </template>
    </div>
    <ion-label :class="{ 'ion-text-nowrap': !wrapText }">
      <slot name="fileName">
        <BaseEllipsis :lines="limitLinesName">
          {{ item.fileName }}
        </BaseEllipsis>
      </slot>
      <slot name="size">
        <p>
          {{ formatSize ? formatBytes(item.fileSize) : item.fileSize }}
        </p>
      </slot>
      <IonRow v-if="item.uploadProgress">
        <IonProgressBar
          v-if="
            item.uploadProgress.status == 'UPLOADING' ||
            item.uploadProgress.status == 'FAILED'
          "
          :buffer="0"
          :value="item.uploadProgress.progress"
          :color="
            item.uploadProgress.status == 'UPLOADING' ? 'primary' : 'danger'
          "
        />
        <template v-else-if="item.uploadProgress.status == 'COMPLETED'">
          <BaseIcon :name="checkmarkCircle" color="primary" />
        </template>
        <span class="text-muted">
          {{ Math.round(item.uploadProgress.progress) }}%
        </span>
      </IonRow>
    </ion-label>
    <slot name="end">
      <IonRow slot="end">
        <ion-buttons
          v-if="
            showDelete &&
            (!item.uploadProgress || item.uploadProgress.status != 'UPLOADING')
          "
        >
          <ion-button
            fill="clear"
            color="danger"
            @click="onRemove($event, index)"
          >
            <ion-icon slot="icon-only" :icon="trashOutline" />
          </ion-button>
        </ion-buttons>
      </IonRow>
    </slot>
  </ion-item>
</template>

<style scoped lang="scss"></style>
