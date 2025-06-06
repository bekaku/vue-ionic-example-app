<template>
  <ion-item :button="!disabled" :lines="lines" :detail="false" @click="onShow">
    <slot name="start">
      <ion-icon v-if="showIcon" slot="start" :icon></ion-icon>
    </slot>
    <ion-label>
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
      <p>
        {{
          getSelected|| t('base.chooseDate')
        }}
      </p>
    </ion-label>
    <slot name="end">
      <ion-buttons slot="end">
        <BaseButton
          v-if="clearable && modelValue"
          color="danger"
          icon-only
          clear
          :icon="{ name: close }"
          @click="onClear($event)"
        />
      </ion-buttons>
    </slot>
  </ion-item>
  <base-modal
    v-model="show"
    :initial-breakpoint="1"
    :breakpoints="[1]"
    :content-padding="false"
    :title="t('base.chooseDate')"
    @on-close="show = false"
  >
    <BaseDatePicker
      v-model="modelValue"
      :min
      :max
      :presentation
      @on-select="onSelect"
    >
      <template #after>
        <ion-col size="12">
          <BaseButton
            class="q-pa-sm"
            full
            :label="t('base.done')"
            @click="show = false"
          />
        </ion-col>
      </template>
    </BaseDatePicker>
  </base-modal>
</template>
<script setup lang="ts">
import { useLang } from '@/composables/useLang';
import type { DatetimePresentation, ItemLines } from '@/types/common';
import {
  convertDateFormatToThai,
  FORMAT_DATE14,
  formatDateBy,
  getDateNow,
} from '@/utils/dateUtil';
import { IonButtons, IonCol, IonIcon, IonItem, IonLabel } from '@ionic/vue';
import { calendarOutline, close } from 'ionicons/icons';
import { computed, defineAsyncComponent, ref } from 'vue';
import BaseButton from './BaseButton.vue';
import BaseDatePicker from './BaseDatePicker.vue';
const {
  required = false,
  disabled = false,
  clearable = true,
  lines = 'full',
  icon = calendarOutline,
  showIcon = true,
  presentation = 'date',
} = defineProps<{
  min?: string;
  max?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  lines?: ItemLines;
  icon?: string;
  showIcon?: boolean;
  presentation?: DatetimePresentation;
}>();
const emit = defineEmits(['on-close', 'on-select', 'on-clear']);
const BaseModal = defineAsyncComponent(
  () => import('@/components/base/BaseModal.vue'),
);
const { t } = useLang();
const show = ref(false);
// const date = ref();
const modelValue = defineModel<string | undefined>();
// const date = computed({
//   get: () => modelValue,
//   set: (val) => emit('update:modelValue', val),
// });
const getSelected = computed(() => {
  if (modelValue.value) {
    if (presentation == 'date') {
      convertDateFormatToThai(modelValue.value);
    }
    return modelValue.value;
  }
  return undefined;
});
const onSelect = (val: any) => {
  console.log('onSelect', val);
  // if (ev && ev.detail && ev.detail.value) {
  //     modelValue.value = formatIso(ev.detail.value, FORMAT_DATE14);
  // }
};
const onShow = () => {
  if (!disabled) {
    if (!modelValue.value) {
      if (presentation == 'date') {
        modelValue.value = formatDateBy(getDateNow(), FORMAT_DATE14);
      } else if (presentation == 'time') {
        modelValue.value='00:00'
      }
    }

    show.value = true;
  }
};
const onClear = (event: any) => {
  if (event) {
    event.stopPropagation();
  }
  if (modelValue.value) {
    modelValue.value = undefined;
  }
  emit('on-clear');
};
</script>
<style scoped lang="scss">
ion-datetime {
  --background: var(--v-color-white);
}
</style>
