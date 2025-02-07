<script setup lang="ts">
import BaseIcon from '@/components/base/BaseIcon.vue';
import { useLang } from '@/composables/useLang';
import type { IMenuPageItem, ItemLines } from '@/types/common';
import { IonIcon, IonItem, IonLabel, IonText } from '@ionic/vue';
import BaseAvatar from '@/components/base/BaseAvatar.vue';
const { item, lines = 'none', iconSize = 20 } = defineProps<{
    item: IMenuPageItem
    iconSize?: number
    lines?: ItemLines
}>();
defineEmits<{
    'on-select': [item: IMenuPageItem]
}>()
const { t } = useLang();
</script>
<template>
    <ion-item v-if="item" v-bind="$attrs" :button="item.button == true || item?.to != undefined" :detail="item.button == true || item?.to != undefined"
        :lines="lines" :router-link="item?.to ? item.to : undefined" @click="$emit('on-select', item)">
        <slot name="start">
            <base-avatar v-if="item.image" slot="start" rounded :src="item.image" :size="42" />
            <template v-if="item.icon">
                <ion-icon v-if="item.iconSet == 'ion'" slot="start"
                    :icon="item.icon"
                    :style="item.iconSize ? `font-size:${item.iconSize}px` : `${iconSize}px`" :class="item.iconColor ? item.iconColor : ''"></ion-icon>
                <span v-else slot="start">
                    <base-icon :icon="item.icon" :size="item.iconSize ? item.iconSize : iconSize"
                        :icon-set="item.iconSet" :color="item.iconColor ? item.iconColor : undefined" />
                </span>
            </template>
        </slot>
        <slot name="label">
            <ion-label>
                <IonText :class="item.color ? 'text-' + item.color : undefined">
                    {{ item?.translate !== false ? t(`${item.title}`) : item.title }}
                </IonText>
                <p v-if="item?.caption">
                    {{ item?.translateCaption !== false ? t(`${item.caption}`) : item.caption }}
                </p>
            </ion-label>
        </slot>
        <slot name="end" />
    </ion-item>
</template>
