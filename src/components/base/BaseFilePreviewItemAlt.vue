<script setup lang="ts">
import { formatBytes, } from '@/utils/appUtil';
import { getFileTypeIcon } from '@/utils/fileUtils';
import type { FileManagerDto } from '@/types/models';
import BaseImage from '@/components/base/BaseImage.vue';
import { IonButton, IonButtons, IonIcon, IonItem, IonLabel } from '@ionic/vue';
import { trashOutline } from 'ionicons/icons';
import BaseIcon from '@/components/base/BaseIcon.vue';
import type { ItemLines } from '@/types/common';
import BaseEllipsis from './BaseEllipsis.vue';

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
} = defineProps<{
  showDelete?: boolean
  col?: string
  item: FileManagerDto
  index: number
  formatSize?: boolean
  imageSize?: string
  iconSize?: number
  fetch?: boolean
  wrapText?: boolean
  button?: boolean
  lines?: ItemLines
  detail?: boolean
  limitLinesName?: number
}>();
// const emit = defineEmits(['on-remove', 'on-click']);
const emit = defineEmits<{
  'on-remove': [index: number]
  'on-click': [index: number, event: any]
}>();
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
  <ion-item v-bind="$attrs" :lines="lines" :button :detail @click="onClick($event, index)">
    <div slot="start">
      <template v-if="item.isImage || item.image">
        <base-image v-if="item.filePath" :style="{ height: `${imageSize}`, width: `${imageSize}` }" :fetch="fetch"
          :src="item.filePath" ratio="4/3" />
      </template>
      <template v-else>
        <base-icon :icon="getFileTypeIcon(item.fileMime)" icon-set="bootstrap-icons" :size="iconSize" />
      </template>
    </div>
    <ion-label :class="{ 'ion-text-nowrap': !wrapText }">
      <slot name="fileName">
        <BaseEllipsis :lines="limitLinesName">
          <!-- <h4> -->
            {{ item.fileName }}
          <!-- </h4> -->
        </BaseEllipsis>
      </slot>
      <slot name="size">
        <p>
          {{ formatSize ? formatBytes(item.fileSize) : item.fileSize }}
        </p>
      </slot>
    </ion-label>
    <slot name="end">
      <ion-buttons v-if="showDelete" slot="end">
        <ion-button fill="clear" color="danger" @click="onRemove($event, index)">
          <ion-icon slot="icon-only" :icon="trashOutline" />
        </ion-button>
      </ion-buttons>
    </slot>
  </ion-item>
</template>

<style scoped lang="scss"></style>
