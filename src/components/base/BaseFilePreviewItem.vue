<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue';
import BaseIcon from '@/components/base/BaseIcon.vue';
import BaseImage from '@/components/base/BaseImage.vue';
import type { FileManager } from '@/types/models';
import { getFileTypeIcon } from '@/utils/FileUtils';
import { trashOutline } from 'ionicons/icons';
import { computed } from 'vue';

const {
  fetch = false,
  useThumbnail = false,
  imageSize = '100%',
  iconSize = 40,
  radius = false,
  radiusSize = '15px',
  item,
} = defineProps<{
  showDelete?: boolean;
  col?: string;
  item: FileManager;
  index: number;
  formatSize?: boolean;
  fetch?: boolean;
  useThumbnail?: boolean;
  showName?: boolean;
  showSize?: boolean;
  imageSize?: string;
  iconSize?: number;
  dense?: boolean;
  radius?: boolean;
  radiusSize?: string;
}>();
const emit = defineEmits(['on-remove', 'on-click']);
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
  emit('on-remove', index);
  if (event) {
    event.stopImmediatePropagation();
  }
};
const onClick = (event: any, index: number) => {
  if (event) {
    event.stopImmediatePropagation();
  }
  emit('on-click', index, event);
};
</script>

<template>
  <div v-bind="$attrs" class="grid-tile" @click="onClick($event, index)">
    <BaseButton
      v-if="
        showDelete &&
        (!item.uploadProgress || item.uploadProgress.status != 'UPLOADING')
      "
      class="grid-delete"
      clear
      icon-only
      color="danger"
      size="small"
      :icon="{ name: trashOutline, iconSet: 'ion' }"
      @click="onRemove($event, index)"
    />
    <template v-if="isMedia && getImagePath">
      <base-image
        :class="{ 'img-radius': radius }"
        :style="{ height: `${imageSize}`, width: `${imageSize}` }"
        :fetch="fetch"
        :src="getImagePath"
        ratio="4/3"
      >
        <slot />
      </base-image>
    </template>
    <template v-else>
      <base-icon
        :name="getFileTypeIcon(item.fileMime)"
        icon-set="bootstrap-icons"
        :size="iconSize"
      />
    </template>
  </div>
</template>

<style scoped lang="scss">
.grid-tile {
  position: relative;
}
.grid-delete {
  position: absolute;
  top: 2px;
  right: 2px;
  z-index: 11;
  --background: rgba(255, 255, 255, 0.85);
  border-radius: 50%;
}
.img-radius {
  border-radius: v-bind(radiusSize);
}
</style>
