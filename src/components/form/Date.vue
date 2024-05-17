<template>
  <ion-item @click="onShow" lines="none">
    <ion-label>
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
      <br />
      <span>
        {{
          modelValue
            ? convertDateFormatToThai(modelValue)
            : t('base.chooseDate')
        }}
      </span>
    </ion-label>
    <ion-icon slot="end" :icon="calendarOutline"></ion-icon>
  </ion-item>
  <base-modal
    :model-value="show"
    @on-close="show = false"
    :initial-breakpoint="1"
    :breakpoints="[1]"
    :content-padding="false"
    :title="t('base.chooseDate')"
  >
    <ion-grid>
      <ion-row class="ion-justify-content-center">
        <ion-col size="12">
          <!-- <ion-datetime
              v-model="date"
              presentation="date"
              color="danger"
            ></ion-datetime> -->
          <ion-datetime
            presentation="date"
            v-model="modelValue"
            :min="min"
            :max="max"
            @ionChange="onSelect"
            color="danger"
          ></ion-datetime>
        </ion-col>
        <ion-col size="12" class="ion-text-center q-text-weight-bold q-text-h6">
          <!-- <ion-input
            :placeholder="t('base.chooseDate')"
            v-model="modelValue"
            readonly
            :aria-label="t('base.chooseDate')"
          ></ion-input> -->
          <p>
            {{
              modelValue
                ? convertDateFormatToThai(modelValue)
                : t('base.chooseDate')
            }}
          </p>
        </ion-col>
        <ion-col size="12">
          <ion-button
            @click="show = false"
            mode="ios"
            expand="block"
            class="text-white"
            >{{ t('base.done') }}
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-grid>
  </base-modal>
</template>
<script setup lang="ts">
import { computed, defineAsyncComponent, PropType, ref } from 'vue';
import { calendarOutline } from 'ionicons/icons';
import {
  formatIso,
  FORMAT_DATE14,
  formatDateBy,
  getDateNow,
  convertDateFormatToThai,
} from '@/utils/DateUtil';
import { useLang } from '@/composables/UseLang';
import {
  IonItem,
  IonLabel,
  IonIcon,
  IonGrid,
  IonCol,
  IonDatetime,
  IonInput,
  IonButton,
  IonRow,
} from '@ionic/vue';
const BaseModal = defineAsyncComponent(
  () => import('@/components/base/Modal.vue'),
);
const props = defineProps({
  modelValue: {
    type: String,
  },
  min: {
    type: String as PropType<string | undefined>,
    default: undefined,
  },
  max: {
    type: String as PropType<string | undefined>,
    default: undefined,
  },
  label: {
    type: String,
    default: undefined,
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
});

const { t } = useLang();
const emit = defineEmits([
  'on-close',
  'update:modelValue',
  'update:show',
  'on-select',
]);
const show = ref(false);
// const date = ref();
const modelValue = defineModel<string | undefined>();
// const date = computed({
//   get: () => props.modelValue,
//   set: (val) => emit('update:modelValue', val),
// });
const onSelect = (ev: any) => {
  if (ev && ev.detail && ev.detail.value) {
    const f = formatIso(ev.detail.value, FORMAT_DATE14);
    modelValue.value = f;
  }
  // show.value = false;
};
const onShow = () => {
  if (!props.disabled) {
    if (!modelValue.value) {
      modelValue.value = formatDateBy(getDateNow(), FORMAT_DATE14);
    }

    show.value = true;
  }
};
</script>
<style scoped lang="scss">
ion-datetime {
  --background: var(--v-color-white);
}
</style>
