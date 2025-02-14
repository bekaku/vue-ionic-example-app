<template>
  <BaseLayout :page-title="authenStore?.loginedDisplay || 'Home'" :show-back-link="false">
    <template #start>
      <ion-img slot="start" style="width: 40px; height: 40px"
      :src="!isDark ? '/logo/logo.png' : '/logo/logo-white.png'" />
    </template>
    <template #actions-end>
      <ion-buttons slot="end">
        <notification-app-notification></notification-app-notification>
        <BaseButton clear :icon="searchOutline" icon-only :icon-size="28" to="/search" />
      </ion-buttons>
    </template>
  </BaseLayout>
</template>
<script setup lang="ts">
import { useAuthenStore } from '@/stores/authenStore';
import { ref } from 'vue';

import BaseButton from '@/components/base/BaseButton.vue';
import BaseLayout from '@/components/base/BaseLayout.vue';
import NotificationAppNotification from '@/components/notification/AppNotification.vue';
import { useLang } from '@/composables/useLang';
import { useTheme } from '@/composables/useTheme';
import { useAppStore } from '@/stores/appStore';
import {
  IonButtons,
  IonImg
} from '@ionic/vue';
import { searchOutline } from 'ionicons/icons';
const authenStore = useAuthenStore();
const appStore = useAppStore();
const { t } = useLang();
const { isDark } = useTheme();
const contentTapHome = ref();
</script>
