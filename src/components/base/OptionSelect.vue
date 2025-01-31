<template>
  <ion-modal :is-open="show" @will-dismiss="onClose" :show-backdrop="false">
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
          <ion-button @click="confirmChanges(undefined)">
            {{ t('base.done') }}
          </ion-button>
        </ion-buttons>
      </base-toolbar>
      <ion-toolbar>
        <ion-searchbar
          @ion-input="searchbarInput($event)"
          :placeholder="t('base.search')"
        ></ion-searchbar>
      </ion-toolbar>
    </ion-header>
    <ion-content :scrollY="true">
      <option-select-items
        :multiple="multiple"
        :fecthImage="fecthImage"
        :items="items"
        :filterText="filterInputText"
        v-model="workingSelectedValues"
        v-model:filter="filterInputText"
        @selection-cancel="cancelChanges"
        @selection-change="confirmChanges"
      >
      </option-select-items>
    </ion-content>
  </ion-modal>
</template>
<script setup lang="ts">
import OptionSelectItems from '@/components/base/OptionSelectItems.vue';
import { useLang } from '@/composables/useLang';
import type { LabelValue } from '@/types/common';
import type { SearchbarCustomEvent } from '@ionic/vue';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonModal,
  IonSearchbar,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
import { defineAsyncComponent, ref } from 'vue';

const props = withDefaults(defineProps<{
  multiple?: boolean
  fecthImage?: boolean
  items?: LabelValue<any>[]
  selectedItems: any[]
  title?: string
}>(), {
  multiple: true,
  fecthImage: true,
  items: () => [],
  title: 'Select Items'
});
const emit = defineEmits([
  'on-close',
  'selection-cancel',
  'selection-change'
]);
const BaseToolbar = defineAsyncComponent(
  () => import('@/components/base/BaseToolbar.vue')
);
const { t } = useLang();
const show = defineModel('show', { type: Boolean, default: false });
const workingSelectedValues = ref<any[]>(props.selectedItems);
const filterInputText = ref<string>();
const onClose = () => {
  emit('on-close');
  show.value = false;
};

const cancelChanges = () => {
  emit('selection-cancel');
  onClose();
};

const confirmChanges = (items: any[] | undefined) => {
  emit('selection-change', workingSelectedValues.value);
  onClose();
};

const searchbarInput = (ev: SearchbarCustomEvent) => {
  // filterList(ev.target.value);
  if (ev.target.value==undefined) {
    return;
  }
  filterInputText.value = ev.target.value;
};
</script>
