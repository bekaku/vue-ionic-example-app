<script setup lang="ts">
import { useAuthenStore } from '@/stores/authenStore';

import BaseButton from '@/components/base/BaseButton.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BasePage from '@/components/base/BasePage.vue';
import NotificationAppNotification from '@/components/notification/AppNotification.vue';
import { useTheme } from '@/composables/useTheme';
import {
  IonButtons,
  IonCardContent,
  IonImg
} from '@ionic/vue';
import { searchOutline } from 'ionicons/icons';
const authenStore = useAuthenStore();
const { isDark } = useTheme();
</script>
<template>
  <BasePage :page-title="authenStore?.loginedDisplay || 'Home'" :show-back-link="false">
    <template #start>
      <ion-img slot="start" style="width: 40px; height: 40px"
        :src="!isDark ? '/logo/logo.png' : '/logo/logo-white.png'" />
    </template>
    <template #actions-end>
      <ion-buttons slot="end">
        <notification-app-notification />
        <BaseButton clear :icon="searchOutline" icon-only :icon-size="28" to="/search" />
      </ion-buttons>
    </template>
    <BaseCard title="Vue Ionic Starter">
      <IonCardContent>
        This is template of vue js and Ionic
      </IonCardContent>
    </BaseCard>
  </BasePage>
</template>