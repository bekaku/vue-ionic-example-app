<template>
  <ion-list id="base-option-list" :inset="false">
    <template v-if="filteredItems.length > 0">
      <ion-item
        v-for="item in filteredItems"
        :key="item.value"
        class="ion-text-wrap"
      >
        <base-avatar slot="start" v-if="item.avatar" :src="item.avatar" :fetch-image="fecthImage" />

        <template v-if="item.description">
          <ion-label>
            <ion-checkbox
              :value="item.value"
              :checked="isChecked(item.value)"
              @ion-change="checkboxChange($event)"
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
            @ion-change="checkboxChange($event)"
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
</template>
<script setup lang="ts">
/*
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
 */
import { ref, watch } from 'vue';
import type { LabelValue } from '@/types/common';
import { useLang } from '@/composables/useLang';
import type { CheckboxCustomEvent } from '@ionic/vue';
import { IonCheckbox, IonItem, IonLabel, IonList } from '@ionic/vue';
import BaseAvatar from '@/components/base/BaseAvatar.vue';

const props = withDefaults(defineProps<{
  multiple?: boolean
  fecthImage?: boolean
  items?: LabelValue<any>[]
}>(), {
  multiple: true,
  fecthImage: true,
  items: () => []
});
const emit = defineEmits([
  'selection-change'
]);
const { t } = useLang();
const filteredItems = ref<LabelValue<any>[]>([...props.items]);
const modelValue = defineModel<any[]>({ default: () => [] });
const filterText = defineModel<string>('filter');
const isChecked = (value: any) => {
  return (
    modelValue.value.find(item => item === value) !== undefined
  );
};


const confirmChanges = () => {
  emit('selection-change', modelValue.value);
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
    if (modelValue.value.length > 0) {
      if (checked) {
        modelValue.value[0] = value;
        confirmChanges();
      } else {
        modelValue.value = [];
      }
    } else {
      modelValue.value.push(value);
      confirmChanges();
    }
  } else {
    if (checked) {
      modelValue.value = [...modelValue.value, value];
    } else {
      modelValue.value = modelValue.value.filter(
        item => item !== value
      );
    }
  }
};
watch(filterText, (state) => {
  filterList(state);
});
</script>
