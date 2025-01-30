<template>
  <ion-row>
    <ion-col v-for="i in size" class="ion-no-padding" :key="i">
      <ion-card class="card-clear q-px-sm">
        <ion-skeleton-text
            :animated="true"
            :style="{ width: 100+'%', height: `${height}px` }"
        ></ion-skeleton-text>
      </ion-card>
    </ion-col>
  </ion-row>
</template>
<script setup lang="ts">
import { IonSkeletonText, IonCard, IonRow, IonCol } from '@ionic/vue';

interface Props {
  size?: number
  height?: number
}

withDefaults(defineProps<Props>(), {
  size: 2,
  height: 100,
});
</script>
