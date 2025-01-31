<template>
    <ion-item @click="onShow" :button="!disabled" :lines="lines" :detail="false">
        <slot name="start">
            <ion-icon slot="start" :icon></ion-icon>
        </slot>
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
        <slot name="end">
            <ion-buttons slot="end">
                <BaseButton v-if="clearable && modelValue" color="danger" icon-only clear icon-color="danger"
                    :icon-size="24" :icon="close" @click="onClear($event)" />
            </ion-buttons>
        </slot>
    </ion-item>
    <base-modal v-model="show" @on-close="show = false" :initial-breakpoint="1" :breakpoints="[1]"
        :content-padding="false" :title="t('base.chooseDate')">
        <BaseDatePicker v-model="modelValue" :min :max @on-select="onSelect">
            <template #after>
                <ion-col size="12">
                    <BaseButton :label="t('base.done')" expand="block" @click="show = false" />
                </ion-col>
            </template>
        </BaseDatePicker>
    </base-modal>
</template>
<script setup lang="ts">
import { useLang } from '@/composables/useLang';
import { ItemLines } from '@/types/common';
import { convertDateFormatToThai, FORMAT_DATE14, formatDateBy, formatIso, getDateNow } from '@/utils/dateUtil';
import { IonButtons, IonCol, IonDatetime, IonGrid, IonIcon, IonItem, IonLabel, IonRow } from '@ionic/vue';
import { calendarOutline, close } from 'ionicons/icons';
import { defineAsyncComponent, ref } from 'vue';
import BaseButton from './BaseButton.vue';
import BaseDatePicker from './BaseDatePicker.vue';
const BaseModal = defineAsyncComponent(() => import('@/components/base/BaseModal.vue'));
const {
    required = false,
    disabled = false,
    clearable = true,
    lines = 'none',
    icon = calendarOutline
} = defineProps<{
    min?: string
    max?: string
    label?: string
    required?: boolean
    disabled?: boolean
    clearable?: boolean
    lines?: ItemLines
    icon?: string
}>();
const emit = defineEmits([
    'on-close',
    'on-select',
    'on-clear'
]);

const { t } = useLang();
const show = ref(false);
// const date = ref();
const modelValue = defineModel<string | undefined>();
// const date = computed({
//   get: () => modelValue,
//   set: (val) => emit('update:modelValue', val),
// });
const onSelect = (val: any) => {
    console.log('onSelect', val);
    // if (ev && ev.detail && ev.detail.value) {
    //     modelValue.value = formatIso(ev.detail.value, FORMAT_DATE14);
    // }
};
const onShow = () => {
    if (!disabled) {
        if (!modelValue.value) {
            modelValue.value = formatDateBy(getDateNow(), FORMAT_DATE14);
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