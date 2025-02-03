<script setup lang="ts">
import { formatBytes, getFileTypeIcon } from '@/utils/appUtil';
import type { FileManagerDto } from '@/types/models';
import BaseImage from '@/components/base/BaseImage.vue';
import { IonButton, IonButtons, IonIcon, IonItem, IonLabel } from '@ionic/vue';
import { trashOutline } from 'ionicons/icons';
import BaseIcon from '@/components/base/BaseIcon.vue';
import type { ItemLines } from '@/types/common';

const {
  showDelete= true,
  formatSize= false,
  fetch= false,
  imageSize= '75px',
  iconSize= 32,
  wrapText= true,
  lines= 'none',
  button= true,
}=defineProps<{
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
  <ion-item v-bind="$attrs" :lines="lines" :button @click="onClick($event, index)" :detail="false">
    <div slot="start">
      <template v-if="item.isImage || item.image">
        <div :style="{ height: `${imageSize}`, width: `${imageSize}` }">
          <base-image
            v-if="item.filePath"
                      :fetch="fetch"
                      :src="item.filePath" ratio="4/3">
          </base-image>
        </div>
      </template>
      <template v-else>
        <base-icon
          :icon="getFileTypeIcon(item.fileMime)"
          icon-set="bootstrap-icons"
          color="text-primary"
          :size="iconSize"
        />
      </template>
    </div>
    <ion-label :class="{ 'ion-text-nowrap': !wrapText }">
      <slot name="fileName">
        <h4>
          {{ item.fileName }}
        </h4>
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
          <ion-icon :icon="trashOutline" slot="icon-only" />
        </ion-button>
      </ion-buttons>
    </slot>
  </ion-item>
</template>

<style scoped lang="scss">

</style>
