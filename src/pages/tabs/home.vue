<template>
  <ion-page>
    <ion-header>
      <base-toolbar>
        <ion-img slot="start" style="width: 40px; height: 40px"
          :src="!isDark ? '/logo/logo.png' : '/logo/logo-white.png'" />
        <ion-title>{{ authenStore.loginedDisplay }}</ion-title>
        <ion-buttons slot="end">
          <notification-app-notification></notification-app-notification>
          <ion-button fill="clear" router-link="/search">
            <ion-icon slot="icon-only" :icon="searchOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </base-toolbar>
    </ion-header>
    <ion-content fullscreen ref="contentTapHome">
      <BaseCard title="Tab Home">
        <IonCardContent>
          Ionic and Vue js 3 Starter template
        </IonCardContent>
      </BaseCard>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import { useAuthenStore } from '@/stores/authenStore';
import { useDeviceStore } from '@/stores/deviceStore';
import { ref } from 'vue';

import BaseToolbar from '@/components/base/BaseToolbar.vue';
import NotificationAppNotification from '@/components/notification/AppNotification.vue';
import { useLang } from '@/composables/useLang';
import { useTheme } from '@/composables/useTheme';
import { useAppStore } from '@/stores/appStore';
import {
  IonButton,
  IonButtons,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonPage,
  IonTitle
} from '@ionic/vue';
import { searchOutline } from 'ionicons/icons';
import BaseCard from '@/components/base/BaseCard.vue';
const authenStore = useAuthenStore();
const appStore = useAppStore();
const { t } = useLang();
const { isDark } = useTheme();
const contentTapHome = ref();
</script>
