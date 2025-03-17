<script setup lang="ts">
import type { CheckboxDetail, IonicColor } from '@/types/common';
import { IonCheckbox } from '@ionic/vue';
const {
    justify = 'start',
    color = 'primary'
} = defineProps<{
    label?: string
    justify?: 'start' | 'end' | 'space-between'
    color?: IonicColor
    value?: any
    checked?: boolean
}>()
const emit = defineEmits<{
    'on-change': [event: CheckboxDetail]
}>()
const modelValue = defineModel<boolean>({ default: false })
const onChange = (event: any) => {
    emit('on-change', {
        checked: event?.detail.checked,
        value: event?.detail.value
    })
}
</script>
<template>
    <IonCheckbox v-model="modelValue" :color :justify :value :checked @ion-change="onChange">
        {{ label }}
    </IonCheckbox>
</template>