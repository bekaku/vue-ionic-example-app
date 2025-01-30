<script setup lang="ts">
import { formatBytes, getFileTypeIcon } from '@/utils/AppUtil';
import type { FileManagerDto } from '@/types/Models';
import BaseImage from '@/components/base/Image.vue';
import { IonButton, IonButtons, IonIcon, IonItem, IonLabel } from '@ionic/vue';
import { trashOutline } from 'ionicons/icons';
import BaseIcon from '@/components/base/Icon.vue';

withDefaults(defineProps<{
  showDelete?: boolean
  col?: string
  item: FileManagerDto
  index: number
  formatSize?: boolean
  imageSize?: string
  iconSize?: number
  fetch?: boolean
  dense?: boolean
  wrapText?: boolean
}>(), {
  showDelete: true,
  formatSize: false,
  fetch: true,
  dense: false,
  imageSize: '125px',
  iconSize: 32,
  wrapText: true,
});
const emit = defineEmits(['on-remove', 'on-click']);
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
  <ion-item v-bind="$attrs" lines="none" button @click="onClick($event, index)" :detail="false">
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
