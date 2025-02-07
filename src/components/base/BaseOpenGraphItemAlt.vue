<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref } from 'vue';
import type { OgMeta } from '@/types/models';
import { catchUrlFromText, isLinkFromWebApp } from '@/utils/appUtil';
import UtilService from '@/api/UtilService';
const BaseOpenGraphItem = defineAsyncComponent(() => import('@/components/base/BaseOpenGraphItem.vue'));
const {
    short = false,
    showBg = true,
    textLines = 1,
    descriptionLines = 2,
    content
} = defineProps<{
    content: string
    short?: boolean
    textLines?: number
    descriptionLines?: number
    showBg?: boolean
    imageMaxHeight?: string
    imageMaxWidth?: string
    imageSize?: string
}>()


const { getOgMeta } = UtilService();
const opengraphItem = ref<OgMeta>();
const showOg = ref(false);
onMounted(async () => {
    if (content) {
        const matches = catchUrlFromText(content);
        if (matches && matches.length > 0) {
            if (!isLinkFromWebApp(matches[0])) {
                const res = await getOgMeta(matches[0]);
                if (res) {
                    opengraphItem.value = res;
                    showOg.value = true;
                }
            }
        }
    }
});
</script>

<template>
    <BaseOpenGraphItem v-if="opengraphItem && showOg" v-bind="$attrs" :item="opengraphItem" :short="short"
        :textLines="textLines" :descriptionLines="descriptionLines" :showBg="showBg" :imageMaxHeight="imageMaxHeight"
        :imageMaxWidth="imageMaxWidth" :imageSize="imageSize">
    </BaseOpenGraphItem>
</template>
