<script setup lang="ts" generic="T">
import type { AppColor, ItemLines, LabelValue } from '@/types/common';
import { IonIcon, IonItem, IonLabel, IonText } from '@ionic/vue';
import BaseAvatar from '@/components/base/BaseAvatar.vue';
import BaseIcon from '@/components/base/BaseIcon.vue';

const { item, iconSize = 20, avatarSize = 24, detail = false, lines = 'none' } = defineProps<{
    item: LabelValue<T>
    iconSize?: number
    avatarSize?: number
    detail?: boolean
    clickable?: boolean
    color?: AppColor
    lines?: ItemLines
}>();
const emit = defineEmits<{
    'on-select': [val: LabelValue<T> | undefined]
}>()
const onClick = () => {
    if (!item?.children || item.children.length == 0) {
        emit('on-select', item);
    }
};
</script>
<template>
    <ion-item v-if="item" :button="item?.value != undefined" :detail :lines="lines"
        :router-link="item?.to ? item.to : undefined" @click="onClick">
        <slot name="start">
            <base-avatar slot="start" v-if="item.avatar" :src="item.avatar" :size="avatarSize" />
            <template v-if="item.icon">
                <ion-icon v-if="item.iconSet == 'ion'" :icon="item.icon" :style="`${iconSize}px`"
                    :class="color ? 'text-' + color : item.color ? 'text-' + item.color : ''" slot="start"></ion-icon>
                <span v-else slot="start">
                    <base-icon :icon="item.icon" :size="iconSize" :icon-set="item.iconSet"
                        :color="color ? 'text-' + color : item.color ? 'text-' + item.color : ''" />
                </span>
            </template>
        </slot>
        <slot name="label">
            <ion-label>
                <IonText :class="color ? 'text-' + color : item.color ? 'text-' + item.color : ''">
                    {{ item.label }}
                </IonText>
                <p v-if="item?.description">
                    {{ item.description }}
                </p>
            </ion-label>
        </slot>
        <slot name="end" />
    </ion-item>
</template>
