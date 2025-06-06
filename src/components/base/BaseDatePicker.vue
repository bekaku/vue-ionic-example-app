<template>
  <ion-row>
    <ion-col size="12">
      <IonRow class="ion-justify-content-center">
        <ion-datetime
          v-model="modelValue"
          style="width: 100%"
          show-default-title
          :presentation="presentation"
          :min="min"
          :max="max"
          :color="color"
          :locale="locale"
          @ion-change="onSelect"
        ></ion-datetime>
      </IonRow>
    </ion-col>
    <ion-col
      v-if="showSelected"
      size="12"
      class="ion-text-center q-text-weight-bold q-text-h6"
    >
      <p>
        {{ getSelected || t('base.chooseDate') }}
      </p>
    </ion-col>
    <slot name="after" />
  </ion-row>
</template>
<script setup lang="ts">
import { useLang } from '@/composables/useLang';
import type { DatetimePresentation, IonicColor } from '@/types/common';
import {
  convertDateFormatToThai,
  FORMAT_DATE14,
  formatIso,
} from '@/utils/dateUtil';
import { IonCol, IonDatetime, IonRow } from '@ionic/vue';
import { computed } from 'vue';

const {
  color = 'primary',
  showSelected = false,
  presentation = 'date',
} = defineProps<{
  min?: string;
  max?: string;
  color?: IonicColor;
  showSelected?: boolean;
  presentation?: DatetimePresentation;
}>();
const emit = defineEmits(['on-select']);

const { t, locale } = useLang();
const modelValue = defineModel<string | undefined>();
const getSelected = computed(() => {
  if (modelValue.value) {
    if (presentation == 'date') {
      convertDateFormatToThai(modelValue.value);
    }
    return modelValue.value;
  }
  return undefined;
});
const onSelect = (ev: any) => {
  if (ev && ev.detail && ev.detail.value) {
    if (presentation == 'date') {
      modelValue.value = formatIso(ev.detail.value, FORMAT_DATE14);
    } else if (presentation == 'time') {
      console.log('time', ev.detail.value);
      modelValue.value = ev.detail.value;
    }
    emit('on-select', modelValue.value);
  }
};
</script>
<style scoped lang="scss">
 body[color-theme='dark'] {
    ion-datetime {
    --background: var(--color-zinc-800);
    }
  }
</style>
