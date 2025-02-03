<script setup lang="ts">
import BaseCard from '@/components/base/BaseCard.vue';
import BaseDatePickerItem from '@/components/base/BaseDatePickerItem.vue';
import BaseLayout from '@/components/base/BaseLayout.vue';
import { getCurrentDateByFormat } from '@/utils/dateUtil';
import {
    IonCardContent
} from '@ionic/vue';
import { ref } from 'vue';
const date1 = ref<string>();
const dateMin = ref<string>();
const dateMax = ref<string>();
</script>
<template>
    <base-layout page-title="Date-time picker" fullscreen show-back-link>
        <BaseCard flat title="Date picker" subtitle="Date and Time picker">
            <ion-card-content class="q-gutter-md">
                <BaseDatePickerItem label="Simple" v-model="date1" required />
                <BaseDatePickerItem label="Min date" v-model="dateMin" :min="getCurrentDateByFormat()" />
                <BaseDatePickerItem label="Max date" v-model="dateMax" max="2025-03-04" />
            </ion-card-content>
        </BaseCard>
    </base-layout>
</template>
