<template>
  <ion-modal :is-open="show" @willDismiss="onClose" :show-backdrop="false">
    <ion-header>
      <base-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="cancelChanges()">
            {{ t('base.cancel') }}
          </ion-button>
        </ion-buttons>
        <ion-title class="ion-text-capitalize">
          {{ title }}
        </ion-title>
        <ion-buttons slot="end">
          <ion-button @click="confirmChanges()">
            {{ t('base.done') }}
          </ion-button>
        </ion-buttons>
      </base-toolbar>
      <ion-toolbar>
        <ion-searchbar
          @ionInput="searchbarInput($event)"
          :placeholder="t('base.search')"
        ></ion-searchbar>
      </ion-toolbar>
    </ion-header>
    <ion-content :scrollY="true" class="ion-padding">
      <ion-list id="base-option-list" :inset="true">
        <template v-if="filteredItems.length > 0">
          <ion-item
            v-for="item in filteredItems"
            :key="item.value"
            class="ion-text-wrap"
          >
            <template v-if="item.description">
              <ion-label>
                <ion-checkbox
                  :value="item.value"
                  :checked="isChecked(item.value)"
                  @ionChange="checkboxChange($event)"
                >
                  {{ item.label }}
                </ion-checkbox>
                <p>
                  {{ item.description }}
                </p>
              </ion-label>
            </template>
            <template v-else>
              <ion-checkbox
                :value="item.value"
                :checked="isChecked(item.value)"
                @ionChange="checkboxChange($event)"
              >
                {{ item.label }}
              </ion-checkbox>
            </template>
          </ion-item>
        </template>
        <template v-else>
          <ion-item class="ion-text-center">
            <ion-label>
              <p>
                {{ t('error.dataNotfound') }}
              </p>
            </ion-label>
          </ion-item>
        </template>
      </ion-list>
    </ion-content>
  </ion-modal>
</template>
<script setup lang="ts">
import { computed, defineAsyncComponent, PropType, ref } from 'vue';
import { LabelValue } from '@/types/Models';
import { close } from 'ionicons/icons';
import { useLang } from '@/composables/UseLang';
import { useBase } from '@/composables/UseBase';
import {
  IonModal,
  IonContent,
  IonHeader,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonCheckbox,
  IonItem,
  IonList,
  IonSearchbar,
  IonToolbar,
  IonLabel,
} from '@ionic/vue';
import type { CheckboxCustomEvent, SearchbarCustomEvent } from '@ionic/vue';
const BaseToolbar = defineAsyncComponent(
  () => import('@/components/base/Toolbar.vue'),
);
const props = defineProps({
  modelValue: {
    type: Boolean,
    require: true,
  },
  multiple: {
    type: Boolean,
    require: true,
  },
  items: {
    type: Array as PropType<LabelValue<any>[]>,
    default: () => [],
  },
  selectedItems: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  title: {
    type: String,
    default: 'Select Items',
  },
});
const { t } = useLang();
const emit = defineEmits([
  'on-close',
  'update:modelValue',
  'selection-cancel',
  'selection-change',
]);
const filteredItems = ref<LabelValue<any>[]>([...props.items]);
const workingSelectedValues = ref<any[]>([...props.selectedItems]);
const show = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const onClose = () => {
  emit('on-close');
  show.value = false;
};
const isChecked = (value: any) => {
  return (
    workingSelectedValues.value.find((item) => item === value) !== undefined
  );
};

const cancelChanges = () => {
  emit('selection-cancel');
  onClose();
};

const confirmChanges = () => {
  emit('selection-change', workingSelectedValues.value);
  onClose();
};

const searchbarInput = (ev: SearchbarCustomEvent) => {
  filterList(ev.target.value);
};
/**
 * Update the rendered view with
 * the provided search query. If no
 * query is provided, all data
 * will be rendered.
 */
const filterList = (searchQuery: string | undefined | null) => {
  /**
   * If no search query is defined,
   * return all options.
   */
  if (searchQuery === undefined || searchQuery == null) {
    filteredItems.value = [...props.items];
  } else {
    /**
     * Otherwise, normalize the search
     * query and check to see which items
     * contain the search query as a substring.
     */
    const normalizedQuery = searchQuery.toLowerCase();
    filteredItems.value = props.items.filter((item) => {
      return item.label.toLowerCase().includes(normalizedQuery);
    });
  }
};
const checkboxChange = (ev: CheckboxCustomEvent) => {
  const { checked, value } = ev.detail;
  if (!props.multiple) {
    workingSelectedValues.value = [];
  }
  if (checked) {
    workingSelectedValues.value = [...workingSelectedValues.value, value];
  } else {
    workingSelectedValues.value = workingSelectedValues.value.filter(
      (item) => item !== value,
    );
  }
};
</script>
