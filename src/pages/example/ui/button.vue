<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseLayout from '@/components/base/BaseLayout.vue';
import {
  IonCardContent,
  IonRow
} from '@ionic/vue';
import { ellipsisHorizontal, heart, videocam, wallet } from 'ionicons/icons';
</script>
<template>
  <base-layout page-title="Button" fullscreen show-back-link>
    <BaseCard flat title="Button" subtitle="Button components">
      <ion-card-content>
        <BaseButton icon-only :icon="heart" shape="round" />
        <ion-row class="q-gutter-md">
          <BaseButton label="Default" />
          <BaseButton disabled label="Disabled" />
          <BaseButton label="Icon" :icon="videocam" />
          <BaseButton label="Image" avatar="https://cdn.quasar.dev/img/avatar2.jpg" />
          <BaseButton label="Icon right" :icon-right="wallet" />
          <BaseButton label="Round" round :icon="videocam" color="warning" />
          <BaseButton color="light" label="External link" href="https://www.google.com" target="_blank" />
        </ion-row>
      </ion-card-content>
      <ion-card-content>
        <div class="q-text-h5 q-text-weight-bold q-my-sm">
          Colors
        </div>
        <ion-row class="q-gutter-md">
          <BaseButton color="primary" label="Primary" />
          <BaseButton color="secondary" label="Secondary" />
          <BaseButton color="tertiary" label="Tertiary" />
          <BaseButton color="success" label="Success" />
          <BaseButton color="warning" label="Warning" />
          <BaseButton color="danger" label="Danger" />
          <BaseButton color="light" label="Light" />
          <BaseButton color="medium" label="Medium" />
          <BaseButton color="dark" label="Dark" />
        </ion-row>
      </ion-card-content>
      <ion-card-content>
        <div class="q-text-h5 q-text-weight-bold q-my-sm">
          Fill
        </div>
        <ion-row class="q-gutter-md">
          <BaseButton label="Default" />
          <BaseButton clear label="Clear" />
          <BaseButton clear icon-only :icon="ellipsisHorizontal" />
          <BaseButton outline label="Outline" />
        </ion-row>
      </ion-card-content>
      <ion-card-content>
        <div class="q-text-h5 q-text-weight-bold q-my-sm">
          Expend
        </div>
        <BaseButton full label="Full" />
      </ion-card-content>
    </BaseCard>
  </base-layout>
</template>
