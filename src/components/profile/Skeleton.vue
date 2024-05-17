<template>
  <ion-card class="ion-no-margin ion-no-padding no-border-radius no-shadow">
    <!-- <div
      style="z-index: 999"
      :style="`height: 125px;
              background: linear-gradient(to right, #000, #000);
              background-position: center;
              -webkit-background-size: cover;
              -moz-background-size: cover;
              -o-background-size: cover;
              background-size: cover;`"
    ></div> -->
    <div
      class="text-white q-absolute q-centered-horizontal"
      :style="{ top: '15px', zIndex: 99 }"
    >
      <ion-thumbnail>
        <ion-skeleton-text :animated="true" style="width: 55px; height: 55px">
        </ion-skeleton-text>
      </ion-thumbnail>
    </div>

    <ion-card-content class="q-mt-lg">
      <ion-row style="margin-top: 55px">
        <ion-col size="12">
          <ion-skeleton-text
            class="q-centered-horizontal"
            :animated="true"
            style="width: 50%"
          >
          </ion-skeleton-text>
        </ion-col>
        <ion-col size="12">
          <ion-skeleton-text
            class="q-centered-horizontal q-mt-sm"
            :animated="true"
            style="width: 35%"
          >
          </ion-skeleton-text>
        </ion-col>
      </ion-row>

      <ion-row style="margin-top: 35px">
        <ion-col>
          <ion-skeleton-text
            :animated="true"
            style="width: 100%; height: 35px"
          ></ion-skeleton-text>
        </ion-col>
        <ion-col>
          <ion-skeleton-text
            :animated="true"
            style="width: 100%; height: 35px"
          ></ion-skeleton-text>
        </ion-col>
      </ion-row>
    </ion-card-content>
  </ion-card>
</template>
<script setup lang="ts">
import {
  IonRow,
  IonCol,
  IonThumbnail,
  IonSkeletonText,
  IonCardContent,
  IonCard,
} from '@ionic/vue';
</script>
