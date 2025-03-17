<script setup lang="ts">
import type { CheckboxDetail, IonicColor, ItemLines } from '@/types/common';
import { IonCheckbox, IonItem } from '@ionic/vue';
const {
    justify = 'space-between',
    lines = 'none',
    color = 'primary'
} = defineProps<{
    label?: string
    justify?: 'start' | 'end' | 'space-between'
    lines?: ItemLines
    color?: IonicColor
    value?: any
    checked?: boolean
}>()
const modelValue = defineModel<boolean>({ default: false })
const emit = defineEmits<{
    'on-change': [event: CheckboxDetail]
}>()
const onChange = (event: any) => {
    emit('on-change', {
        checked: event?.detail.checked,
        value: event?.detail.value
    })
}
</script>
<template>
    <IonItem v-bind="$attrs" :lines class="ion-text-wrap">
        <IonCheckbox v-model="modelValue" :color :justify :value :checked @ion-change="onChange">
            {{ label }}
        </IonCheckbox>
    </IonItem>
</template>