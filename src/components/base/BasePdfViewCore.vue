<script setup lang="ts">
import { usePDF, VuePDF } from '@tato30/vue-pdf';
import { ref } from 'vue';
import BaseSpinner from './BaseSpinner.vue';
const { src, fitParent = false, textLayer = false, hideForms = false, scrollHeight = '90vh' } = defineProps<{
    src: any;
    fitParent?: boolean;
    textLayer?: boolean;
    width?: number | undefined;
    height?: number | undefined;
    watermarkText?: string | undefined;
    hideForms?: boolean;
    scrollHeight?: string
}>();
const scale = defineModel('scale', { type: Number, default: 1 });
const page = defineModel('page', { type: Number, default: 1 });
const pagess = defineModel('pagess', { type: Number, default: 1 });

const firstLoaded = ref(false);
const { pdf, pages, /* info */ } = usePDF(src);

const onLoaded = () => {
    firstLoaded.value = true;
    pagess.value = pages.value;
};
</script>
<template>
    <div :style="{ width: '100%', height: scrollHeight, overflow: 'scroll' }">
        <BaseSpinner v-if="!firstLoaded" />
        <VuePDF :pdf="pdf" :scale="scale" :page="page" :fit-parent="fitParent" :width="width" :height="height"
            :text-layer="textLayer" :watermark-text="watermarkText" :hide-forms="hideForms" @loaded="onLoaded" />
    </div>
</template>