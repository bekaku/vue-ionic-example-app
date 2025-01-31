<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseDatePickerItem from '@/components/base/BaseDatePickerItem.vue';
import BaseLayout from '@/components/base/BaseLayout.vue';
import {
    IonCardContent,
    IonRow
} from '@ionic/vue';
import { ellipsisHorizontal, heart, videocam, wallet } from 'ionicons/icons';
import { ref } from 'vue';
const date1 = ref<string>();
</script>
<template>
    <base-layout page-title="Date-time picker" fullscreen show-back-link>
        <BaseCard flat title="Date picker" subtitle="Date and Time picker">
            <ion-card-content>
                <ion-row class="q-gutter-md">
                </ion-row>
            </ion-card-content>
            <ion-card-content>
                <BaseDatePickerItem label="Simple" v-model="date1" required />
            </ion-card-content>
        </BaseCard>
    </base-layout>
</template>
