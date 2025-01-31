<script setup lang="ts" generic="T">
import type { AppColor, LabelValue } from '@/types/common';
import {
    IonContent,
    IonList,
    IonPopover
} from '@ionic/vue';
import { ellipsisHorizontal } from 'ionicons/icons';
import { ref } from 'vue';
import BaseButton from './BaseButton.vue';
import BaseLabelValueItem from './BaseLabelValueItem.vue';

const { icon = ellipsisHorizontal, items = [], witdh = '250px', clear = true, round=true, textOnly=false } = defineProps<{
    icon?: string
    avatar?: string
    round?: boolean
    outline?: boolean
    clear?: boolean
    items: LabelValue<T>[]
    label?: string
    color?: AppColor
    textOnly?: boolean
    witdh?: string
}>();
const emit = defineEmits<{
    'on-select': [item: T | undefined]
}>();
const popoverOpen = ref(false);
const event = ref<Event>();
const openPopover = (e: Event) => {
    event.value = e;
    popoverOpen.value = true;
};
const closePopup = () => {
    event.value = undefined;
    popoverOpen.value = false;
};
const onSelect = (item: LabelValue<T> | undefined) => {
    closePopup();
    if (item != undefined) {
        emit('on-select', item.value);
    }
};
</script>
<template>
    <BaseButton :avatar="!textOnly ? avatar : undefined" :icon-only="label == undefined" :label :icon="!textOnly ? icon : undefined" :clear :round :outline :color="color" :icon-color="color"
        @click="openPopover($event)" />
    <ion-popover :is-open="popoverOpen" :event="event" @did-dismiss="popoverOpen = false">
        <ion-content>
            <ion-list>
                <BaseLabelValueItem v-for="(item, index) in items" :key="`${index}-${item.value}`" :item="item"
                    @on-select="onSelect" />
                <slot name="extraItem"></slot>
            </ion-list>
        </ion-content>
    </ion-popover>
</template>
<style scoped lang="scss">
ion-popover {

    /* --width: 355px; */
    &::part(content) {
        min-width: v-bind(witdh);
    }
}
</style>
