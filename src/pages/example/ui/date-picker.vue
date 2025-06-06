<script setup lang="ts">
import BaseCard from '@/components/base/BaseCard.vue';
import BaseDatePickerItem from '@/components/base/BaseDatePickerItem.vue';
import BaseDatePicker from '@/components/base/BaseDatePicker.vue';
import BasePage from '@/components/base/BasePage.vue';
import { getCurrentDateByFormat } from '@/utils/dateUtil';
import { IonCardContent, IonDatetime } from '@ionic/vue';
import { ref } from 'vue';
const date1 = ref<string>();
const dateInline = ref<string>();
const time = ref<string>('00:00');
const dateMin = ref<string>();
const dateMax = ref<string>();
</script>
<template>
  <BasePage page-title="Date-time picker" fullscreen show-back-link>
    <BaseCard flat title="Date picker" subtitle="Date and Time picker">
      <ion-card-content class="q-gutter-md">
        <BaseDatePickerItem v-model="date1" label="Simple" required />
        <BaseDatePickerItem
          v-model="dateMin"
          label="Min date"
          :min="getCurrentDateByFormat()"
        />
        <BaseDatePickerItem
          v-model="dateMax"
          label="Max date"
          :max="getCurrentDateByFormat()"
        />
        <BaseDatePickerItem
          v-model="time"
          label="Time"
          presentation="time"
        />
      </ion-card-content>
    </BaseCard>

    <BaseCard title="Time" :subtitle="`Selected time: ${time}`">
      <!-- <IonDatetime v-model="time" presentation="time"></IonDatetime> -->
      <BaseDatePicker v-model="time" presentation="time" :show-selected="false" />
    </BaseCard>
    <BaseCard title="Inline picker" :subtitle="`Selected date: ${dateInline}`">
      <BaseDatePicker v-model="dateInline" :show-selected="false" />
    </BaseCard>
  </BasePage>
</template>
