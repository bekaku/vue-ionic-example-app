<script setup lang="ts">
import BaseDialog from './BaseDialog.vue';
import BasePdfView from './BasePdfView.vue';
const { src, title,
    showDownload = true,
    fetch = false,
    isBlob = false,
    closeable = true,
} = defineProps<{
    title?: string;
    src: string;
    fetch?: boolean;
    showDownload?: boolean
    isBlob?: boolean
    scrollHeight?: string
    minHeight?: string
    minWidth?: string
    closeable?: boolean
}>();
const emit = defineEmits<{
    'on-close': []
    'on-before-hide': []
}>()
const modelValue = defineModel<boolean>({ default: false });

const onClose = () => {
    modelValue.value = false;
    emit('on-close');
};
</script>
<template>
    <BaseDialog v-if="modelValue" v-model="modelValue" :title="title" :content-padding="false" @on-close="onClose">
        <base-pdf-view :src :closeable :title :fetch :show-download :is-blob :scroll-height :min-height :min-width
            @on-close="onClose" />
    </BaseDialog>
</template>
<style lang="scss" scoped></style>