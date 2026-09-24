<script setup lang="ts">
import type { FileManager } from '@/types/models';
import { IonCol, IonRow } from '@ionic/vue';
import { computed, ref, watch } from 'vue';
import BaseFilePreviewItemAlt from '@/components/base/BaseFilePreviewItemAlt.vue';
const {
  layout = 'grid',
  items,
  clickable = true,
  bordered = true,
  showName = true,
  showSize = true,
  formatSize = true,
  imageSize = '75px',
  limit = 0,
  showViewDialog,
} = defineProps<{
  items: FileManager[];
  layout?: 'list' | 'grid';
  softDelete?: boolean;
  showDelete?: boolean;
  showProgress?: boolean;
  showViewDialog?: boolean;
  formatSize?: boolean;
  clickable?: boolean;
  bordered?: boolean;
  showName?: boolean;
  showSize?: boolean;
  progress?: number;
  limit?: number;
  imageSize?: string;
  iconSize?: number;
}>();

const emit = defineEmits<{
  'on-remove': [index: number];
  'on-click': [index: number];
  'on-soft-delete': [index: number];
}>();

// จัดการ Limit แบบ Reactive
const currentLimit = ref<number>(limit);
watch(
  () => limit,
  (newVal) => {
    currentLimit.value = newVal;
  },
);

// View Dialog State
const fileForView = ref<FileManager | null>(null);
const showFileView = ref(false);
const fileImageItemsForView = ref<FileManager[]>([]);
const fileImageSelectIndex = ref<number>(0);

// คำนวณรายการที่จะแสดงผล
const displayItems = computed(() => {
  if (layout === 'list' || currentLimit.value <= 0) {
    return items;
  }
  return items.slice(0, currentLimit.value);
});

const remainingCount = computed(() => {
  if (currentLimit.value <= 0) {
    return 0;
  }
  return Math.max(0, items.length - currentLimit.value);
});

const imageItems = computed(() => {
  return items.filter((f) => f.fileMimeType === 'IMAGE');
});

const handleItemClick = (event: any, index: number) => {
  emit('on-click', index);
  if (
    layout === 'grid' &&
    index === currentLimit.value - 1 &&
    remainingCount.value > 0
  ) {
    currentLimit.value = items.length;
    return;
  }

  if (!showViewDialog) {
    return;
  }

  const file = items[index];
  if (!file) {
    return;
  }

  if (file.fileMimeType === 'IMAGE') {
    fileImageItemsForView.value = [...imageItems.value];
    const imageIndex = imageItems.value.findIndex((t) => t.id === file.id);
    fileImageSelectIndex.value = imageIndex >= 0 ? imageIndex : 0;
  } else {
    fileImageItemsForView.value = [];
    fileImageSelectIndex.value = 0;
  }

  fileForView.value = file;
  showFileView.value = true;
};
</script>
<template>
  <IonRow>
    <IonCol>
      <template v-if="layout == 'list'">
        <template
          v-for="(item, index) in displayItems"
          :key="item.uniqueId || String(item.id)"
        >
          <BaseFilePreviewItemAlt
            :item="item"
            :index="index"
            dense
            :format-size="formatSize"
            :image-size="imageSize"
            :icon-size="iconSize"
            :show-delete="showDelete"
            @on-click="handleItemClick($event, index)"
            @on-remove="emit('on-remove', index)"
          />
        </template>
      </template>
    </IonCol>
  </IonRow>
</template>
