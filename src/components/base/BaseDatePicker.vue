<template>
    <ion-row class="ion-justify-content-center">
        <ion-col size="12">
            <ion-datetime presentation="date" v-model="modelValue" :min="min" :max="max" @ion-change="onSelect"
                :color="color"></ion-datetime>
        </ion-col>
        <ion-col size="12" class="ion-text-center q-text-weight-bold q-text-h6">
            <p>
                {{
                    modelValue
                        ? convertDateFormatToThai(modelValue)
                        : t('base.chooseDate')
                }}
            </p>
        </ion-col>
        <slot name="after" />
    </ion-row>
</template>
<script setup lang="ts">
import { useLang } from '@/composables/useLang';
import type { IonicColor } from '@/types/common';
import { convertDateFormatToThai, FORMAT_DATE14, formatIso } from '@/utils/dateUtil';
import { IonCol, IonDatetime, IonRow } from '@ionic/vue';
const { color='primary' }=defineProps<{
    min?: string
    max?: string
    color?: IonicColor
}>();
const emit = defineEmits([
    'on-select',
]);

const { t } = useLang();
const modelValue = defineModel<string | undefined>();
const onSelect = (ev: any) => {
    if (ev && ev.detail && ev.detail.value) {
        modelValue.value = formatIso(ev.detail.value, FORMAT_DATE14);
        emit('on-select', modelValue.value)
    }
};
</script>
<style scoped lang="scss">
ion-datetime {
    --background: var(--v-color-white);
}
</style>