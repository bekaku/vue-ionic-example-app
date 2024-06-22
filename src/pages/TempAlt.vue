<template>
  <base-layout
    :page-title="t('nav.chats')"
    fullscreen
    :content-padding="false"
    show-back-link
  >
    <template v-slot:actions-end>
      <ion-buttons>
        <BaseMenu :items="myMenuItems"></BaseMenu>
      </ion-buttons>
    </template>
    <ion-searchbar
      animated
      :placeholder="t('base.search') + ' ' + t('nav.chats')"
      :debounce="250"
    ></ion-searchbar>

    <base-result
      :icon-size-alt="32"
      :show-icon="true"
      status="empty"
      full-height
    >
    </base-result>

  </base-layout>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { addOutline, funnelOutline, searchOutline } from 'ionicons/icons';
import { useLang } from '@/composables/UseLang';
import { useBase } from '@/composables/UseBase';
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
  IonFab,
  IonFabButton
} from '@ionic/vue';
import BaseLayout from '@/components/base/Layout.vue';
import BaseResult from '@/components/base/Result.vue';
import BaseMenu from '@/components/base/Menu.vue';
import { IMenuItem } from '@/types/Models';

const { WeeGoTo } = useBase();
const { t } = useLang();
const myMenuItems: IMenuItem[] = [
  {
    id: 0,
    title: 'base.search',
    i18n: true,
    icon: searchOutline,
    iconType: 'ion'
  },
  {
    id: 1,
    title: 'sort.sort',
    i18n: true,
    icon: funnelOutline,
    iconType: 'ion'
  },
  {
    id: 2,
    title: 'base.addNew',
    i18n: true,
    icon: addOutline,
    iconType: 'ion'
  }
];
</script>
