<script setup lang="ts" generic="T">
import { IonBadge, IonIcon, IonLabel, IonSegment, IonSegmentButton } from '@ionic/vue';
import type { IonicColor, LabelValue } from '@/types/common';

const {
    scrollable = true,
    layout = 'icon-top',
    items = []
} = defineProps<{
    items: LabelValue<any>[]
    height?: number
    scrollable?: boolean
    color?: IonicColor
    badgeColor?: IonicColor
    layout?: 'icon-bottom' | 'icon-end' | 'icon-hide' | 'icon-start' | 'icon-top' | 'label-hide' | undefined
}>()

const emit = defineEmits(['on-change']);
const modelValue = defineModel<string>();
const segmentChanged = (even: any) => {
    if (even.detail) {
        modelValue.value = even.detail.value;
        emit('on-change', even.detail.value);
    }
};
</script>

<template>
    <ion-segment v-if="items != undefined && items.length > 0" :value="modelValue" :color="color"
        :scrollable="scrollable" @ion-change="segmentChanged($event)">
        <ion-segment-button v-for="(item, index) in items" :key="`segment-${index}-${item.value}`" :value="item.value"
            :layout="layout">
            <slot name="description" v-bind="{ item, index }">
                <ion-badge v-if="item.description">
                    {{ item.description }}
                </ion-badge>
            </slot>
            <ion-label>{{ item.label }}</ion-label>
            <ion-icon v-if="item.icon" :icon="item.icon" />
        </ion-segment-button>
    </ion-segment>
</template>

<style scoped lang="scss"></style>
