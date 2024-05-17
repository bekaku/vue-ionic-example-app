<template>
  <ion-page>
    <ion-header>
      <base-toolbar>
        <ion-buttons slot="start">
          <base-back-button
            text=""
            default-href="/tabs/home"
          ></base-back-button>
        </ion-buttons>
        <ion-title> {{ t('themeLeaderApproved') }}</ion-title>
      </base-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" :scroll-y="true">
      <ion-list>
        <ion-item lines="none">
          <ion-label>
            <h2 class="text-muted">{{ t('base.mode') }}</h2>
          </ion-label>
        </ion-item>
        <ion-item
          lines="none"
          v-for="theme in availableThemes"
          :key="theme.key"
          @click="langugeAndThemeStore.setThemeSetting(theme.key)"
        >
          <ion-label>{{ t(theme.text) }}</ion-label>
          <ion-icon
            v-if="theme.key == langugeAndThemeStore.themeSetting"
            slot="end"
            color="primary"
            :icon="checkmarkCircle"
          ></ion-icon>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import { useLangugeAndThemeStore } from '@/stores/LangugeAndThemeStore';
import { availableThemes } from '@/utils/ThemeUtil';
import { checkmarkCircle } from 'ionicons/icons';
import { useLang } from '@/composables/UseLang';
import { useBase } from '@/composables/UseBase';
import BaseToolbar from '@/components/base/Toolbar.vue';
import BaseBackButton from '@/components/base/BackButton.vue';
import {
  IonPage,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonLabel,
  IonButtons,
  IonButton,
  IonTextarea,
  IonListHeader,
  IonCheckbox,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonToggle,
  IonIcon,
  IonAvatar,
  IonNote,
  IonText,
  IonModal,
  IonContent,
  IonHeader,
  IonTitle,
  IonRadioGroup,
  IonRadio,
  IonCardTitle,
  IonCardHeader,
  IonProgressBar,
  IonCardSubtitle,
  IonChip,
  IonImg,
  IonThumbnail,
  IonSkeletonText,
  IonRippleEffect,
  IonPopover,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRange,
  IonCardContent,
  IonBadge,
  IonGrid,
  IonSearchbar,
  IonCard,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
} from '@ionic/vue';
const langugeAndThemeStore = useLangugeAndThemeStore();
const { t } = useLang();
const { onBack } = useBase();
</script>
