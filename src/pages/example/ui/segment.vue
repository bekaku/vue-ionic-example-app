<script setup lang="ts">
import BaseCard from '@/components/base/BaseCard.vue';
import BasePage from '@/components/base/BasePage.vue';
import BaseSegment from '@/components/base/BaseSegment.vue';
import BaseToolbar from '@/components/base/BaseToolbar.vue';
import type { LabelValue } from '@/types/common';
import {
    IonBadge
} from '@ionic/vue';
import { chatbubbleOutline } from 'ionicons/icons';
import { ref } from 'vue';
const segmentSelected = ref<string>('home')
const segmentItems = ref<LabelValue<string>[]>([
    {
        label: 'Home',
        value: 'home',
    },
    {
        label: 'About',
        value: 'about',
    },
    {
        label: 'Review',
        value: 'review',
        icon: { name: chatbubbleOutline, iconSet: 'ion' },
    },
    {
        label: 'Photos',
        value: 'photos',
    },
    {
        label: 'Videos',
        value: 'videos',
    }
])
const onSegmentChange = (e: any) => {
    console.log('onSegmentChange', e);
};
</script>
<template>
    <BasePage page-title="Segment" show-back-link>
        <BaseToolbar>
            <BaseSegment v-model="segmentSelected" :items="segmentItems" layout="icon-end" @on-change="onSegmentChange">
                <template #description="{ item }">
                    <ion-badge v-if="item.value == 'review'" color="danger">
                        99
                    </ion-badge>
                </template>
            </BaseSegment>
        </BaseToolbar>
        <BaseCard :title="`Segment '${segmentSelected}'`" />
    </BasePage>
</template>
