<template>
  <ion-row>
    <ion-col>
      <ion-item :detail="false" button>
        <ion-select
          :label="t('sort.by')"
          interface="action-sheet"
          v-model="sort.column"
          :cancel-text="t('base.cancel')"
          @ion-change="onSortColumn"
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
          :label="t('sort.sort')"
          interface="action-sheet"
          v-model="sort.mode"
          :cancel-text="t('base.cancel')"
          @ion-change="onSortMode"
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
import { useLang } from '@/composables/UseLang';
import { useSort } from '@/composables/UseSort';
import { ISort } from '@/types/Common';
import { LabelValue } from '@/types/Models';
import {
  IonCol,
  IonItem,
  IonRow,
  IonSelect,
  IonSelectOption,
} from '@ionic/vue';
import { biFunnel } from '@quasar/extras/bootstrap-icons';
import { PropType } from 'vue';
const props = defineProps({
  fields: {
    type: Array as PropType<LabelValue<string>[]>,
    default: () => [],
  },
  sort: {
    type: Object as PropType<ISort>,
    default: null,
  },
  icon: {
    type: String,
    default: biFunnel,
  },
  label: {
    type: String,
    default: undefined,
  },
  width: {
    type: Number,
    default: 200,
  },
  listDense: {
    type: Boolean,
    default: true,
  },
  btnRound: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(['on-sort-column', 'on-sort-mode']);
const { t } = useLang();
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
