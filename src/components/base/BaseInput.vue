<script setup lang="ts">
import type { IconSetType, IonicColor, ItemLines } from '@/types/common';
import { IonInput, IonItem, IonLabel, IonRow, } from '@ionic/vue';
import { ref, useTemplateRef } from 'vue';
import BaseIcon from './BaseIcon.vue';
const {
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
    rules = []
} = defineProps<{
    autofocus?: boolean
    bordered?: boolean
    clearInput?: boolean
    clearInputIcon?: string
    color?: IonicColor
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
    maxlength?: number
    min?: number
    minlength?: number
    placeholder?: string
    readonly?: boolean
    required?: boolean
    round?: boolean
    rules?: any[]
    type?: 'date' | 'datetime-local' | 'email' | 'month' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'time' | 'url' | 'week'
}>();
const modelValue = defineModel<number | string | undefined>();
const emit = defineEmits<{
    'on-change': [value: any]
    'on-input': [value: number | string | undefined | null]
    'on-focus': [event: any]
    'on-blur': [event: any]
    'on-clear': [value: number | string | undefined]
}>()
const appInputRef = useTemplateRef<any>('appInputRef');
const errorText = ref<string>();
const validateRules = (value: number | string | undefined | null) => {
    if (rules.length > 0) {
        for (const validFunc of rules) {
            const validateResult = validFunc(value);
            if (validateResult == true) {
                appInputRef.value.$el.classList.add('ion-valid');
                errorText.value = undefined;
            } else {
                appInputRef.value.$el.classList.add('ion-invalid');
                errorText.value = validateResult;
                break;
            }
        }
    }
}
const onInput = (event: any) => {
    const value = event.target.value;
    appInputRef.value.$el.classList.remove('ion-valid');
    appInputRef.value.$el.classList.remove('ion-invalid');
    validateRules(value);
    emit('on-input', value)
}
const onBlur = (event: any) => {
    emit('on-blur', event)
    appInputRef.value.$el.classList.add('ion-touched');
}
const onSetFocus = () => {
    if (appInputRef.value) {
        appInputRef.value.setFocus();
    }
}
defineExpose({
    onSetFocus
});
</script>
<template>
    <IonItem v-bind="$attrs" :lines>
        <slot name="before" />
        <IonLabel>
            <ion-input ref="appInputRef" v-model="modelValue" :autofocus :clearInput :counter :color
                :clearInputIcon="clearInputIcon" :debounce :disabled :helper-text="helperText" :inputmode :placeholder
                autocomplete="off" :label-placement="labelPlacement" :max :maxlength :min :minlength :readonly :required
                :shape="round ? 'round' : undefined" :type :class="{ bordered }"
                @ion-change="$emit('on-change', $event)" @ion-blur="onBlur"
                @ion-focus="($event: any) => $emit('on-focus', $event)" @ion-input="onInput">
                <IonRow slot="start">
                    <slot name="start">
                        <BaseIcon v-if="icon" class="q-mr-sm" :icon="icon" :icon-set="iconSet" />
                    </slot>
                </IonRow>
                <slot name="label">
                    <div slot="label">
                        {{ label }} <template v-if="required"><span class="text-danger">*</span></template>
                    </div>
                </slot>
                <IonRow slot="end">
                    <slot name="end" />
                </IonRow>
            </ion-input>
            <slot name="hint">
                <p v-if="errorText" class="text-danger q-text-caption">
                    {{ errorText }}
                </p>
            </slot>
        </IonLabel>
        <slot name="after" />
    </IonItem>
</template>
<style lang="scss" scoped>
ion-input {
    --border-color: #00000000;
}

ion-input.bordered {
    border: 1px solid var(--border-light-color);
    border-radius: 10px;
}
</style>