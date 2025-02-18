<template>
  <ion-row v-if="modelValue">
    <ion-col>
      <ion-item v-if="showClose" :detail="false" button>
        <ion-button slot="end" shape="round" :color="!isDark ? 'light' : 'dark'" @click="$emit('on-close')">
          <ion-icon slot="icon-only" :icon="closeOutline"></ion-icon>
        </ion-button>
      </ion-item>
      <ion-item :detail="false" button>
        <ion-select
          v-model="modelValue.column"
          :label="t('sort.by')"
          interface="action-sheet"
          :cancel-text="t('base.cancel')"
        >
          <ion-select-option
            v-for="(item, index) in fields"
            :key="index"
            :value="item.value"
          >
            {{ item.label }}
          </ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item :detail="false" button>
        <ion-select
          v-model="modelValue.mode"
          :label="t('sort.sort')"
          interface="action-sheet"
          :cancel-text="t('base.cancel')"
        >
          <ion-select-option
            v-for="(item, index) in sortMode"
            :key="index"
            :value="item.value"
          >
            {{ t(item.label) }}
          </ion-select-option>
        </ion-select>
      </ion-item>
    </ion-col>
  </ion-row>
</template>

<script setup lang="ts">
import { useLang } from '@/composables/useLang';
import { useSort } from '@/composables/useSort';
import { useTheme } from '@/composables/useTheme';
import type { ISort, LabelValue } from '@/types/common';
import { IonButton, IonCol, IonIcon, IonItem, IonRow, IonSelect, IonSelectOption } from '@ionic/vue';
import { biFunnel } from '@quasar/extras/bootstrap-icons';
import { closeOutline } from 'ionicons/icons';

withDefaults(defineProps<{
  fields: LabelValue<string>[]
  icon?: string
  label?: string
  width?: number
  listDense?: boolean
  btnRound?: boolean
  showClose?: boolean
}>(), {
  icon: biFunnel,
  autofocus: false,
  width: 200,
  boolean: true,
  btnRound: true,
  showClose: false
});
const emit = defineEmits(['on-sort-column', 'on-sort-mode', 'on-close']);
const modelValue = defineModel<ISort>();
const { t } = useLang();
const { isDark } = useTheme();
const { sortMode } = useSort();
const onSortColumn = (ev: any) => {
  if (ev && ev.detail) {
    emit('on-sort-column', ev.detail.value);
  }
};
const onSortMode = (ev: any) => {
  if (ev && ev.detail) {
    emit('on-sort-mode', ev.detail.value);
  }
};
</script>

<style scoped></style>
