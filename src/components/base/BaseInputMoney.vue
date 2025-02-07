<script setup lang="ts" generic="T">
import { component as VueNumber } from '@coders-tm/vue-number-format';
import type { VueMoneyConFig } from '@/types/common';

const {
    bordered = true,
    config = {
        decimal: '.',
        separator: ',',
        prefix: '',
        suffix: '',
        precision: 2,
        nullValue: '',
        masked: false,
        reverseFill: false,
    },
    textAlign = 'right',
    readonly = false
} = defineProps<{
    bordered?: boolean
    config?: VueMoneyConFig
    hint?: string
    label?: string
    placeholder?: string
    textAlign?: 'left' | 'right' | 'center'
    readonly?: boolean
}>();
const emit = defineEmits(['change', 'update']);
const modelValue = defineModel<number | string>({ default: 0 });
const updateField = (ev: any) => {
    modelValue.value = ev?.target?.unmasked;
    emit('update', ev?.target?.unmasked);
};
const changeField = (ev: any) => {
    emit('change', ev?.target?.unmasked);
};
</script>
<template>
    <div v-bind="$attrs"
        class="sc-ion-input-ios-h sc-ion-input-ios-s ios label-floating input-label-placement-stacked num-holder"
        :class="{ bordered }">
        <label class="input-wrapper sc-ion-input-ios" for="ion-input-0">
            <div class="label-text-wrapper sc-ion-input-ios">
                <div class="label-text sc-ion-input-ios q-ml-md">{{ label }}</div>
            </div>
            <div class="native-wrapper sc-ion-input-ios sc-ion-input-ios-s">
                <vue-number v-model="modelValue" class="num-input" :placeholder="placeholder"
                    :disabled="readonly" :class="{
                        'text-right': textAlign == 'right',
                        'text-left': textAlign == 'left',
                        'text-center': textAlign == 'center',
                    }" v-bind="config" @input="updateField($event)" @change="changeField($event)">
                </vue-number>
            </div>
        </label>
    </div>
</template>

<style scoped lang="scss">
.num-holder {
    background-color: var(--app-input-backgroud);
    border-color: transparent;
    border-radius: 10px;
    width: 100%;
    margin: 8px 0;
}

.bordered {
    border: 1px solid var(--border-light-color);
    border-radius: 10px;
}

.num-input {
    background-color: transparent;
    border: none;
    width: 100%;
    padding-left: 15px;
}

textarea:focus,
input:focus {
    outline: none;
}
</style>
