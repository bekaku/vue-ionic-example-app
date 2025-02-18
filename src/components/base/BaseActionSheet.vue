<script setup lang="ts" generic="T">
import type { AppActionSheet } from '@/types/common';
// import type { ActionSheetButton } from '@ionic/vue';
import { IonActionSheet } from '@ionic/vue';

const {
    autoClose = true,
    mode='md'
} = defineProps<{
    mode?: 'md' | 'ios'
    header?: string
    subHeader?: string
    buttons: AppActionSheet[]
    autoClose?: boolean
}>();
const emit = defineEmits<{
    update: [value: T]
}>();
const modelValue = defineModel<boolean>({ default: false });
const logResult = (ev: CustomEvent) => {
    if (ev.detail && ev.detail.data) {
        emit('update', ev.detail.data);
    } else {
        modelValue.value = false;
    }
    if (autoClose) {
        modelValue.value = false;
    }
};
</script>
<template>
    <ion-action-sheet :is-open="modelValue" :mode :header="header" :sub-header="subHeader" :buttons="buttons"
        @did-dismiss="logResult($event)"></ion-action-sheet>
</template>
<style scoped lang="scss">
ion-action-sheet {
    --button-color: var(--v-main-text-body);
}
</style>
