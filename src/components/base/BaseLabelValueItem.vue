<script setup lang="ts" generic="T">
import type { AppColor, ItemLines, LabelValue } from '@/types/common';
import { IonIcon, IonItem, IonLabel, IonRow, IonText } from '@ionic/vue';
import BaseAvatar from '@/components/base/BaseAvatar.vue';
import BaseIcon from '@/components/base/BaseIcon.vue';

const { item, iconSize = 20, avatarSize = 24, detail = false, lines = 'none' } = defineProps<{
    item: LabelValue<T>
    iconSize?: number
    avatarSize?: number
    fetchImage?: boolean
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
        <IonRow slot="start">
            <slot name="start">
                <base-avatar v-if="item.avatar" :src="item.avatar" :fetch-image :size="avatarSize" />
                <template v-else-if="item.icon">
                    <base-icon :icon="item.icon" :size="iconSize" :icon-set="item.iconSet"
                        :color="color ? color : item.color ?  item.color : undefined" />
                </template>
            </slot>
        </IonRow>
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
        <IonRow slot="end">
            <slot name="end" />
        </IonRow>
    </ion-item>
</template>
