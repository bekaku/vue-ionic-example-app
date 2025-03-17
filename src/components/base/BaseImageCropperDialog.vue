<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable no-unused-vars -->
<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import BaseDialog from './BaseDialog.vue';
import { cropOutline } from 'ionicons/icons';
import BaseImageCropper from './BaseImageCropper.vue';

const {
    autoClose = true,
    ratio = 1, // 1,4/3,16/9
    disabled = false,
    initialSrc,
    width = '100%',
    height = '550px',
    clearOnSubmit = false,
    cropWidth = 960, // default 960, cover = 1920
} = defineProps<{
    autoClose?: boolean;
    ratio?: number
    title?: string
    disabled?: boolean
    initialSrc?: string
    width?: string
    height?: string
    clearOnSubmit?: boolean
    cropWidth?: number
}>()

const emit = defineEmits<{
    'on-close': []
    'on-submit': [File]
    'on-cropend': [string]
}>()
const modelValue = defineModel<boolean>({ default: false })
const timeout = ref<any>(null);
const onSubmit = (f: File) => {
    emit('on-submit', f)
    if (autoClose) {
        timeout.value = setTimeout(() => {
            emit('on-close')
        }, 250)
    }
}
const onClose = () => {
    emit('on-close')
}
onBeforeUnmount(() => {
    if (timeout.value) {
        clearTimeout(timeout.value);
        timeout.value = null;
    }
})
</script>
<template>
    <BaseDialog v-model="modelValue" :title :icon="cropOutline" :auto-close="false" :content-padding="false"
        @on-close="onClose">
        <BaseImageCropper :ratio="ratio" :disabled :crop-width="cropWidth" :initial-src="initialSrc" :width :height
            :clear-on-submit @on-close="onClose" @on-submit="(file: any) => onSubmit(file)"
            @on-cropend="(imageUrl: string) => $emit('on-cropend', imageUrl)">
            <template #preview>
                <slot name="preview" />
            </template>
        </BaseImageCropper>
    </BaseDialog>
</template>
