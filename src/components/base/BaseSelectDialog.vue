<script setup lang="ts" generic="T">
import { useLang } from '@/composables/useLang';
import type { IonicColor, LabelValue } from '@/types/common';
import { IonToolbar } from '@ionic/vue';
import { ref } from 'vue';
import BaseButton from './BaseButton.vue';
import BaseDialog from './BaseDialog.vue';
import BaseSearchBar from './BaseSearchBar.vue';
import BaseSelect from './BaseSelect.vue';

const {
    autoClose = false,
    multiple = true,
    fetchImage = false,
    items = [],
    inputDebounce = 0,
    readonly = false,
    canFilter = true,
    clearable = true,
    loading = false,
    checkColor = 'primary'
} = defineProps<{
    autoClose?: boolean
    icon?: string
    iconSize?: number
    avatarSize?: number
    canFilter?: boolean
    clearable?: boolean
    checkColor?: IonicColor
    fetchImage?: boolean
    items?: LabelValue<T>[]
    inputDebounce?: number
    loading?: boolean
    multiple?: boolean
    readonly?: boolean
    searchPlacholder?: string
    title?: string
}>();
const emit = defineEmits<{
    'on-change': [items: T | T[] | null | undefined]
    'on-close': []
}>();
const { t } = useLang();
// const modelValue = defineModel<any[]>({ default: () => [] });
const modelValue = defineModel<T | T[] | null>();
const filterText = ref<string>();
const show = defineModel<boolean>('show', { default: false });
const onSearchChange = (val: string | undefined) => {
    filterText.value = val;
}
const onChange = (items: T | T[] | null | undefined) => {
    emit('on-change', items)
    if (autoClose) {
        onClose();
    }
}
const onClose = () => {
    show.value = false;
    emit('on-close');
};
</script>
<template>
    <BaseDialog v-if="show" v-model="show" :content-padding="false" :title :icon="icon" @on-close="onClose">
        <template v-if="canFilter" #headerBottom>
            <IonToolbar>
                <BaseSearchBar v-if="canFilter" :placeholder="searchPlacholder || t('base.search')"
                    :debounce="inputDebounce" :animated="false" @on-change="onSearchChange" />
            </IonToolbar>
        </template>
        <template #end>
            <BaseButton clear :label="t('base.done')" @click="onClose" />
        </template>
        <slot name="top" />
        <BaseSelect v-model="modelValue" v-model:filter="filterText" :check-color="checkColor" :can-filter="false"
            :fetch-image :loading :clearable :readonly :items="items" :multiple @on-change="onChange" />
        <slot name="bottom" />
    </BaseDialog>
</template>