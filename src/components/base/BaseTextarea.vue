<script setup lang="ts">
import type { IconSetType, IonicColor, ItemLines } from '@/types/common';
import { IonTextarea, IonItem, IonLabel, } from '@ionic/vue';
import { ref, useTemplateRef } from 'vue';
import BaseIcon from './BaseIcon.vue';
const {
    autoGrow = true,
    bordered = true,
    label,
    lines = 'none',
    autofocus = false,
    clearInput = false,
    counter = false,
    disabled = false,
    labelPlacement = 'stacked',
    readonly = false,
    round = true,
    type = 'text',
    rules = [],
    maxHeight='125px'
} = defineProps<{
    autoGrow?: boolean
    autofocus?: boolean
    bordered?: boolean
    clearInput?: boolean
    clearInputIcon?: string
    color?: IonicColor
    cols?: number
    counter?: boolean
    debounce?: number
    disabled?: boolean
    helperText?: string
    icon?: string
    iconSet?: IconSetType
    inputmode?: 'decimal' | 'email' | 'none' | 'numeric' | 'search' | 'tel' | 'text' | 'url' | undefined
    label?: string
    lines?: ItemLines
    labelPlacement?: 'end' | 'fixed' | 'floating' | 'stacked' | 'start'
    max?: number
    maxHeight?: string
    maxlength?: number
    min?: number
    minlength?: number
    placeholder?: string
    readonly?: boolean
    required?: boolean
    rows?: number
    round?: boolean
    rules?: any[]
    type?: 'date' | 'datetime-local' | 'email' | 'month' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'time' | 'url' | 'week',
    wrap?: 'hard' | 'off' | 'soft'
}>();
const modelValue = defineModel<string | undefined>();
const emit = defineEmits<{
    'on-change': [value: any]
    'on-input': [value: number | string | undefined | null]
    'on-focus': [event: any]
    'on-blur': [event: any]
    'on-clear': [value: number | string | undefined]
}>()
const appTextareaRef = useTemplateRef<any>('appTextareaRef');
const errorText = ref<string>();
const validateRules = (value: number | string | undefined | null) => {
    if (rules.length > 0) {
        for (const validFunc of rules) {
            const validateResult = validFunc(value);
            if (validateResult == true) {
                appTextareaRef.value?.$el.classList.add('ion-valid');
                errorText.value = undefined;
            } else {
                appTextareaRef.value?.$el.classList.add('ion-invalid');
                errorText.value = validateResult;
                break;
            }
        }
    }
}
const onInput = (event: any) => {
    const value = event.target.value;
    appTextareaRef.value?.$el.classList.remove('ion-valid');
    appTextareaRef.value?.$el.classList.remove('ion-invalid');
    validateRules(value);
    emit('on-input', value)
}
const onBlur = (event: any) => {
    emit('on-blur', event)
    appTextareaRef.value?.$el.classList.add('ion-touched');
}
const onSetFocus = () => {
    if (appTextareaRef.value) {
        appTextareaRef.value.setFocus();
    }
}
defineExpose({
    onSetFocus
});
</script>
<template>
    <IonItem v-bind="$attrs" :lines>
        <IonLabel class="ion-no-margin">
            <IonTextarea ref="appTextareaRef" v-model="modelValue" :auto-grow :autofocus :cols :clearInput :counter
                :color :clearInputIcon="clearInputIcon" :debounce :disabled :helper-text="helperText" :inputmode
                :placeholder :label-placement="labelPlacement" :max :maxlength :min :minlength
                :readonly :required :rows :shape="round ? 'round' : undefined" :type :wrap
                :class="{ 'bordered': bordered, 'limit-height': maxHeight != undefined }" @ion-change="$emit('on-change', $event)"
                @ion-blur="onBlur" @ion-focus="($event: any) => $emit('on-focus', $event)"
                @ion-input="onInput">
                <slot name="start">
                    <div v-if="icon" slot="start">
                        <BaseIcon :name="icon" :icon-set="iconSet" />
                    </div>
                </slot>
                <slot name="label">
                    <div slot="label">
                        {{ label }} <template v-if="required"><span class="text-danger">*</span></template>
                    </div>
                </slot>
                <slot name="end" />
            </IonTextarea>
            <slot name="hint">
                <p v-if="errorText" class="text-danger q-text-caption">
                    {{ errorText }}
                </p>
            </slot>
</IonLabel>
    </IonItem>
</template>
<style lang="scss" scoped>
ion-textarea {
    --border-color: #00000000;
}

ion-textarea.limit-height {
    max-height: v-bind(maxHeight) !important;
    overflow: scroll;
}

ion-textarea.bordered {
    border: 1px solid var(--border-light-color);
    border-radius: 10px;
}
</style>