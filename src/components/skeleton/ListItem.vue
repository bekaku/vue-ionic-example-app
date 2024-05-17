<template>
  <ion-card class="q-mx-sm q-mb-md no-shadow">
    <ion-list v-if="show">
      <ion-item v-for="(item, index) in items" :key="index">
        <ion-avatar slot="start" style="width: 35px; height: 35px">
          <ion-skeleton-text :animated="true"></ion-skeleton-text>
        </ion-avatar>

        <ion-label>
          <h3>
            <ion-skeleton-text
              :animated="true"
              style="width: 40%"
            ></ion-skeleton-text>
          </h3>
          <p>
            <ion-skeleton-text
              :animated="true"
              style="width: 30%"
            ></ion-skeleton-text>
          </p>
        </ion-label>
      </ion-item>
    </ion-list>
  </ion-card>
</template>
<script setup lang="ts">
import {
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
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
