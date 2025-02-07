<template>
  <ion-card
    v-for="(item, index) in items"
    :key="index"
    class="q-mx-sm q-mb-md no-shadow"
  >
    <ion-list v-if="show">
      <ion-item>
        <ion-avatar slot="start">
          <ion-skeleton-text
            :animated="true"
            style="border-radius: 100%"
          ></ion-skeleton-text>
        </ion-avatar>
        <ion-label>
          <h3>
            <ion-skeleton-text
              :animated="true"
              style="width: 50%"
            ></ion-skeleton-text>
          </h3>
          <p>
            <ion-skeleton-text
              :animated="true"
              style="width: 60%"
            ></ion-skeleton-text>
          </p>
        </ion-label>
      </ion-item>
    </ion-list>
    <ion-card-content>
      <p>
        <ion-skeleton-text
          :animated="true"
          style="width: 100%"
        ></ion-skeleton-text>
      </p>
      <p>
        <ion-skeleton-text
          :animated="true"
          style="width: 80%"
        ></ion-skeleton-text>
      </p>

      <base-separator class="q-my-md" />
      <ion-row class="">
        <ion-col class="ion-text-center">
          <ion-skeleton-text
            :animated="true"
            style="width: 70%; height: 25px; border-radius: 5px"
          ></ion-skeleton-text>
        </ion-col>
        <ion-col class="ion-text-center">
          <ion-skeleton-text
            :animated="true"
            style="width: 70%; height: 25px; border-radius: 5px"
          ></ion-skeleton-text>
        </ion-col>
        <ion-col class="ion-text-center">
          <ion-skeleton-text
            :animated="true"
            style="width: 70%; height: 25px; border-radius: 5px"
          ></ion-skeleton-text>
        </ion-col>
        <ion-col class="ion-text-center">
          <ion-skeleton-text
            :animated="true"
            style="width: 70%; height: 25px; border-radius: 5px"
          ></ion-skeleton-text>
        </ion-col>
      </ion-row>
    </ion-card-content>
  </ion-card>
</template>
<script setup lang="ts">
import {
  IonCard,
  IonList,
  IonItem,
  IonAvatar,
  IonSkeletonText,
  IonLabel,
  IonCardContent,
  IonRow,
  IonCol,
} from '@ionic/vue';
import BaseSeparator from '@/components/base/Separator.vue';
defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  items: {
    type: Number,
    default: 3,
  },
});
</script>
