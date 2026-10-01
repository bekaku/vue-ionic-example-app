<script setup lang="ts">
import type { FileManager } from '@/types/models';
import { IonCol, IonRow, IonGrid } from '@ionic/vue';
import { biChevronDown } from '@quasar/extras/bootstrap-icons';
import { computed, defineAsyncComponent, ref, watch } from 'vue';
import BaseButton from './BaseButton.vue';
const BaseFileView = defineAsyncComponent(
  () => import('@/components/base/BaseFileView.vue'),
);
const BaseFilePreviewItemAlt = defineAsyncComponent(
  () => import('@/components/base/BaseFilePreviewItemAlt.vue'),
);
const BaseFilePreviewItem = defineAsyncComponent(
  () => import('@/components/base/BaseFilePreviewItem.vue'),
);
const {
  layout = 'grid',
  items,
  formatSize = true,
  limit = 0,
  gridSize = '4',
  showViewDialog,
  gridClass='q-pa-xs',
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
  gridSize?: string;
  gridClass?: string | string[];
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
  if (currentLimit.value <= 0) {
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

const onSetUnlimit = () => {
  currentLimit.value = items.length;
};
const handleItemClick = (event: any, index: number) => {
  console.log('handleItemClick', index);
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
  <IonGrid class="ion-no-padding">
    <IonRow>
      <IonCol v-if="layout == 'list'">
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
        <ion-col v-if="remainingCount > 0" size="12">
          <BaseButton
            :icon="{ name: biChevronDown, iconSet: 'bootstrap-icons' }"
            clear
            size="small"
            :label="`${$t('base.showAll')} (+${remainingCount})`"
            @click="onSetUnlimit"
          />
        </ion-col>
      </IonCol>
      <template v-else>
        <IonCol
          v-for="(item, i) in displayItems"
          :key="item.uniqueId || String(item.id)"
          :class="gridClass"
          :size="gridSize"
        >
          <BaseFilePreviewItem
            :index="i"
            :item="item"
            :format-size="formatSize"
            :image-size="imageSize"
            :icon-size="iconSize"
            :show-delete="showDelete"
            @on-click="handleItemClick($event, i)"
          >
            <div
              v-if="
                layout === 'grid' &&
                i === currentLimit - 1 &&
                remainingCount > 0
              "
              class="remaining-overlay"
            >
              <span class="remaining-count"> +{{ remainingCount }} </span>
            </div>
          </BaseFilePreviewItem>
        </IonCol>
      </template>
    </IonRow>
  </IonGrid>

  <BaseFileView
    v-if="showFileView && fileForView"
    v-model:show="showFileView"
    :item="fileForView"
    :image-list="fileImageItemsForView"
    :select-index="fileImageSelectIndex"
  />
</template>
<style scoped>
.remaining-overlay {
  position: absolute;
  inset: 0;

  background-color: rgba(0, 0, 0, 0.5);

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 10;
  cursor: pointer;

  backdrop-filter: blur(1px);
  -webkit-backdrop-filter: blur(1px);

  transition: background-color 0.2s ease;
}

.remaining-overlay:hover {
  background-color: rgba(0, 0, 0, 0.6);
}

.remaining-count {
  color: #fff;
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 700;
  letter-spacing: 0.025em;
}
</style>
