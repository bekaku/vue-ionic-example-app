<template>
    <ion-card v-if="item && (item.image || item.domain || item.title || item.desc)" v-bind="$attrs"
        class="ion-no-margin ion-no-padding no-shadow" :href="item.url" target="_blank">
        <base-image v-if="item.image && !short" :src="item.image" ratio="16/9"
            :style="{ maxHeight: imageSize }" />
        <ion-item lines="none">
            <base-image v-if="item.image && short" slot="start" :src="item.image" ratio="4/3"
                :style="{ maxHeight: imageMaxHeight, maxWidth: imageMaxWidth }" />
            <ion-label>
                <ion-text class="ion-text-uppercase ion-text-nowrap">
                    {{ item.domain }}
                </ion-text>
                <br>
                <ion-text class="ion-text-wrap">
                    <BaseEllipsis :lines="textLines">
                        {{ item.title }}
                    </BaseEllipsis>
                </ion-text>
                <ion-text class="text-muted">
                    <BaseEllipsis :lines="descriptionLines">
                        {{ item.desc }}
                    </BaseEllipsis>
                </ion-text>
            </ion-label>
            <base-icon slot="end" :name="returnUpForward" icon-set="ion" />
        </ion-item>
    </ion-card>
</template>
<script setup lang="ts">
import BaseIcon from '@/components/base/BaseIcon.vue';
import type { OgMeta } from '@/types/models';
import { IonCard, IonItem, IonLabel, IonText } from '@ionic/vue';
import { returnUpForward } from 'ionicons/icons';
import { defineAsyncComponent } from 'vue';
import BaseEllipsis from './BaseEllipsis.vue';
const BaseImage = defineAsyncComponent(() => import('@/components/base/BaseImage.vue'));
const {
    short = false,
    textLines = 1,
    descriptionLines = 2,
    imageSize = '150px',
    imageMaxHeight = '80px',
    imageMaxWidth = '80px'
} = defineProps<{
    item: OgMeta
    short?: boolean
    showBg?: boolean
    textLines?: number
    descriptionLines?: number
    imageSize?: string
    imageMaxHeight?: string
    imageMaxWidth?: string
}>()
</script>
<style scoped lang="scss">
ion-item {
    --background: var(--grey-1);
}

body[color-theme='dark'] {
    ion-item {
        --background: var(--color-zinc-800);
    }
}
</style>
