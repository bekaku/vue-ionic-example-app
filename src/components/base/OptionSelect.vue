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
    <ion-content :scrollY="true">
      <ion-list id="base-option-list" :inset="false">
        <template v-if="filteredItems.length > 0">
          <ion-item
            v-for="item in filteredItems"
            :key="item.value"
            class="ion-text-wrap"
          >
            <base-avatar
              slot="start"
              v-if="item.avatar"
              :src="item.avatar"
              :fetch-image="fecthImage"
            />

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
import { defineAsyncComponent, ref } from 'vue';
import { LabelValue } from '@/types/Models';
import { useLang } from '@/composables/UseLang';
import type { CheckboxCustomEvent, SearchbarCustomEvent } from '@ionic/vue';
import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import BaseAvatar from '@/components/base/BaseAvatar.vue';

const BaseToolbar = defineAsyncComponent(
  () => import('@/components/base/Toolbar.vue'),
);
const props = withDefaults(
  defineProps<{
    multiple?: boolean;
    fecthImage?: boolean;
    items?: LabelValue<any>[];
    selectedItems: any[];
    title?: string;
  }>(),
  {
    multiple: true,
    fecthImage: true,
    items: () => [],
    title: 'Select Items',
  },
);
const { t } = useLang();
const emit = defineEmits([
  'on-close',
  'update:modelValue',
  'selection-cancel',
  'selection-change',
]);
const filteredItems = ref<LabelValue<any>[]>([...props.items]);
const workingSelectedValues = ref<any[]>([...props.selectedItems]);
const show = defineModel('show', { type: Boolean, default: false });

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
