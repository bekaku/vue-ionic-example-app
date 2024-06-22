<script setup lang="ts" generic="T">
/*
      <option-item
          :label="t('model.wiTagging.table')"
          v-model="modelValue.taggingSelectedIds"
          :items="wiTaggingItems"
          multiple
          :readonly="loading || readonly"
          :loading="isOptionLoading"
        >
        </option-item>
 */
import { computed, ref } from 'vue';
import { LabelValue } from '@/types/Models';
import BaseAvatar from '@/components/base/BaseAvatar.vue';
import { useLang } from '@/composables/UseLang';
import {
  IonChip,
  IonCol,
  IonIcon,
  IonItem,
  IonLabel,
  IonRow,
} from '@ionic/vue';
import { close } from 'ionicons/icons';
import OptionSelect from '@/components/base/OptionSelect.vue';
import BaseSpinner from '@/components/base/Spinner.vue';

const { t } = useLang();
const props = withDefaults(
  defineProps<{
    items: LabelValue<T>[];
    label: string;
    multiple?: boolean;
    required?: boolean;
    readonly?: boolean;
    clearable?: boolean;
    loading?: boolean;
  }>(),
  {
    loading: false,
    multiple: false,
    required: false,
    readonly: false,
    clearable: true,
  },
);
const modelValue = defineModel<T[] | null>();
const showOptions = ref(false);
const emit = defineEmits(['on-change']);
const optionsOrgSelectionChanged = (items: T[]) => {
  if (!modelValue.value) {
    return;
  }
  modelValue.value = items;
  emit('on-change', items);
};
const getItemBySelectId = (val: T) => {
  if (!modelValue.value) {
    return;
  }
  return props.items.find((t) => t.value == val);
};
const onDocOrgRemove = (event: any, index: number) => {
  if (event) {
    event.stopImmediatePropagation();
  }
  if (!modelValue.value) {
    return;
  }
  modelValue.value.splice(index, 1);
  emit('on-change', modelValue.value);
};
const requireText = computed(() => {
  if (props.required && modelValue.value?.length == 0) {
    return `(${t('error.required')})`;
  }
  return '';
});
const onClick = () => {
  if (!props.readonly) {
    showOptions.value = true;
  }
};
</script>
<template>
  <ion-item v-if="loading">
    <ion-label>
      <base-spinner />
    </ion-label>
  </ion-item>
  <ion-item v-else-if="modelValue != undefined" detail button @click="onClick">
    <template v-if="!multiple && getItemBySelectId(modelValue[0])?.avatar">
      <base-avatar
        slot="start"
        :src="getItemBySelectId(modelValue[0])?.avatar"
        fetch-image
      />
    </template>
    <ion-label class="ion-text-wrap">
      <h3>
        {{ label }}
        <span v-if="requireText" class="text-danger text-caption">{{
          requireText
        }}</span>
      </h3>
      <ion-row v-if="multiple && modelValue && modelValue.length > 0">
        <ion-col>
          <ion-chip
            v-for="(orgId, orgIndex) in modelValue"
            :key="`org-${orgId}-${orgIndex}`"
          >
            <ion-label>{{ getItemBySelectId(orgId)?.label }}</ion-label>
            <ion-icon
              :icon="close"
              @click="onDocOrgRemove($event, orgIndex)"
            ></ion-icon>
          </ion-chip>
        </ion-col>
      </ion-row>
      <template v-else>
        <p>
          {{ getItemBySelectId(modelValue[0])?.label }}
        </p>
      </template>
    </ion-label>
  </ion-item>
  <option-select
    v-if="modelValue && showOptions"
    v-model:show="showOptions"
    :title="label"
    :items="items"
    :selected-items="modelValue"
    :multiple="multiple"
    @selection-change="optionsOrgSelectionChanged($event)"
  >
  </option-select>
</template>
