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
import type { LabelValue } from '@/types/Common';
import BaseAvatar from '@/components/base/BaseAvatar.vue';
import { useLang } from '@/composables/UseLang';
import { IonChip, IonCol, IonIcon, IonItem, IonLabel, IonRow, IonButtons, IonButton } from '@ionic/vue';
import { close } from 'ionicons/icons';
import OptionSelect from '@/components/base/OptionSelect.vue';
import BaseSpinner from '@/components/base/Spinner.vue';

const props = withDefaults(
  defineProps<{
    items: LabelValue<any>[]
    label: string
    multiple?: boolean
    required?: boolean
    readonly?: boolean
    clearable?: boolean
    loading?: boolean
    lines?: 'none'|'full'|'inset'
  }>(),
  {
    loading: false,
    multiple: false,
    required: false,
    readonly: false,
    clearable: true,
    lines: 'none',
  }
);
const emit = defineEmits(['on-change', 'on-single-chage', 'on-clear']);
const { t } = useLang();
const modelValue = defineModel<T[] | null>();
const showOptions = ref(false);
const optionsOrgSelectionChanged = (items: T[]) => {
  if (!modelValue.value) {
    return;
  }
  modelValue.value = items;
  emit('on-change', items);
  if (!props.multiple && items && items.length>0) {
    emit('on-single-chage', items[0]);
  }
};
const getItemBySelectId = (val: T) => {
  if (!modelValue.value) {
    return;
  }
  return props.items.find(t => t.value == val);
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
const onClear=(event: any) => {
  if (event) {
    event.stopPropagation();
  }
  if (modelValue.value) {
    modelValue.value=[];
  }
  emit('on-clear');
}
</script>
<template>
  <ion-item v-if="loading">
    <ion-label>
      <base-spinner />
    </ion-label>
  </ion-item>

  <ion-item :lines="lines" v-if="!loading && modelValue!=undefined" detail button @click="onClick">
    <template v-if="!multiple && getItemBySelectId(modelValue[0])?.avatar">
      <base-avatar slot="start" :src="getItemBySelectId(modelValue[0])?.avatar" fetch-image />
    </template>
    <ion-label class="ion-text-wrap">
      <slot name="label">
      <h3>{{ label }} <span v-if="requireText" class="text-danger text-caption">{{ requireText }}</span></h3>
      </slot>


      <ion-row v-if="multiple && modelValue && modelValue.length>0">
        <ion-col>
          <ion-chip
            v-for="(orgId, orgIndex) in modelValue"
            :key="`org-${orgId}-${orgIndex}`">
            <ion-label>{{ getItemBySelectId(orgId)?.label }}</ion-label>
            <ion-icon :icon="close" @click="onDocOrgRemove($event, orgIndex)"></ion-icon>
          </ion-chip>
        </ion-col>
      </ion-row>
      <template v-else>
        <p>
          {{ getItemBySelectId(modelValue[0])?.label }}
        </p>
      </template>
    </ion-label>
    <ion-buttons v-if="clearable && modelValue && modelValue.length>0" slot="end">
      <ion-button color="danger" @click="onClear($event)">
        <ion-icon slot="icon-only" :icon="close" />
      </ion-button>
    </ion-buttons>
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
