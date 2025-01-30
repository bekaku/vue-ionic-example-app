<template>
  <ion-card class="q-mx-sm q-mb-md no-shadow">
    <ion-list v-if="show">
      <ion-item v-for="(item, index) in items" :key="index">
        <!-- <ion-thumbnail slot="start">
            <ion-skeleton-text :animated="true"></ion-skeleton-text>
          </ion-thumbnail> -->
        <ion-thumbnail slot="start">
          <ion-skeleton-text :animated="true" style="border-radius: 100%"></ion-skeleton-text>
        </ion-thumbnail>
        <ion-label>
          <h3>
            <ion-skeleton-text :animated="true" style="width: 100%"></ion-skeleton-text>
          </h3>
          <p>
            <ion-skeleton-text :animated="true" style="width: 30%"></ion-skeleton-text>
          </p>
          <ion-row>
            <ion-col>
              <ion-skeleton-text :animated="true" style="width: 30%"></ion-skeleton-text>
            </ion-col>
            <ion-col>
              <ion-skeleton-text :animated="true" style="width: 30%"></ion-skeleton-text>
            </ion-col>
          </ion-row>
        </ion-label>
      </ion-item>
    </ion-list>
  </ion-card>
</template>
<script setup lang="ts">
import {
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonSkeletonText,
  IonCard,
} from '@ionic/vue';
defineProps({
  show: {
    type: Boolean,
    default: true,
  },
  items: {
    type: Number,
    default: 3,
  },
});
</script>
