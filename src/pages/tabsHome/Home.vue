<template>
  <ion-page>
    <ion-header>
      <base-toolbar>
        <base-image
          slot="start"
          style="width: 40px; height: 40px"
          src="/icon.png"
        >
        </base-image>
        <ion-title>{{ authenStore.loginedDisplay }}</ion-title>
        <ion-buttons slot="end">
          <notification-app-notification></notification-app-notification>
          <ion-button fill="clear" router-link="/search">
            <ion-icon slot="icon-only" :icon="searchOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </base-toolbar>
    </ion-header>
    <ion-content fullscreen ref="contentTapHome"> Tab Home </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import { useAuthenStore } from '@/stores/AuthenStore';
import { useDeviceStore } from '@/stores/DeviceStore';
import { ref } from 'vue';

import BaseImage from '@/components/base/Image.vue';
import BaseToolbar from '@/components/base/Toolbar.vue';
import NotificationAppNotification from '@/components/notification/AppNotification.vue';
import { useBase } from '@/composables/UseBase';
import { useLang } from '@/composables/UseLang';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonIcon,
} from '@ionic/vue';
import { searchOutline } from 'ionicons/icons';
const deviceStore = useDeviceStore();
const authenStore = useAuthenStore();
const { t } = useLang();
const { isDark } = useBase();
const contentTapHome = ref();
</script>
