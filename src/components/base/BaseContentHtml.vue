<script setup lang="ts">
import { useBase } from '@/composables/useBase';
import { escapeHtml } from '@/utils/appUtil';
import { computed } from 'vue';
const { content, isEscapeHtml = false, highLightText } = defineProps<{
    content?: string
    isEscapeHtml?: boolean
    highLightText?: string
}>();
const emit = defineEmits(['on-press']);
const { inputSanitizeHtml } = useBase();
const onPress = (event: any) => {
    emit('on-press', event);
};
const getSanitizeHtml = computed(() => {
    if (!content) {
        return '';
    }
    const text = isEscapeHtml ? inputSanitizeHtml(escapeHtml(content)) : inputSanitizeHtml(content);
    if (!highLightText) {
        return text;
    }
    return text.replaceAll(
        highLightText,
        `<span class='q-text-weight-bold text-primary'>${highLightText}</span>`,
    );
});
</script>

<template>
    <div v-bind="$attrs" @click="onPress($event)" v-html="getSanitizeHtml"></div>
</template>
