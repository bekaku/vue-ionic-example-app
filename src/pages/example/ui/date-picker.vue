<script setup lang="ts">
import BaseCard from '@/components/base/BaseCard.vue';
import BaseDatePickerItem from '@/components/base/BaseDatePickerItem.vue';
import BasePage from '@/components/base/BasePage.vue';
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
    <BasePage page-title="Date-time picker" fullscreen show-back-link>
        <BaseCard flat title="Date picker" subtitle="Date and Time picker">
            <ion-card-content class="q-gutter-md">
                <BaseDatePickerItem v-model="date1" label="Simple" required />
                <BaseDatePickerItem v-model="dateMin" label="Min date" :min="getCurrentDateByFormat()" />
                <BaseDatePickerItem v-model="dateMax" label="Max date" max="2025-03-04" />
            </ion-card-content>
        </BaseCard>
    </BasePage>
</template>
