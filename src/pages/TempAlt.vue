<script setup lang="ts">
import { computed, ref } from 'vue';
import { addOutline, funnelOutline, searchOutline } from 'ionicons/icons';
import { useLang } from '@/composables/useLang';
import { useBase } from '@/composables/useBase';
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
import BasePage from '@/components/base/BasePage.vue';
import BaseResult from '@/components/base/BaseResult.vue';
import BaseDropdownMenu from '@/components/base/BaseDropdownMenu.vue';
import { biCopy, biPencil, biTrash } from '@quasar/extras/bootstrap-icons';
import type { LabelValue } from '@/types/common';

const { appNavigateTo } = useBase();
const { t } = useLang();
const menus = ref<LabelValue<number>[]>([
  {
    label: 'Edit',
    description: 'edit this item',
    icon: { name: biPencil, iconSet: 'bootstrap-icons' },
    fetch: false,
    value: 1,
  },
  {
    label: 'Delete',
    icon: { name: biTrash, iconSet: 'bootstrap-icons' },
    color: 'danger',
    fetch: false,
    value: 2,
  },
  {
    label: 'Copy',
    description: 'Copy this item',
    icon: { name: biCopy, iconSet: 'bootstrap-icons' },
    fetch: false,
    value: 3,
  },
]);
</script>
<template>
  <BasePage
    :page-title="t('nav.chats')"
    :content-padding="false"
  >
    <template #actions-end>
      <ion-buttons>
        <BaseDropdownMenu :items="menus" />
      </ion-buttons>
    </template>
    <ion-searchbar
      animated
      :placeholder="t('base.search') + ' ' + t('nav.chats')"
      :debounce="250"
    />

    <base-result
      :icon-size-alt="32"
      :show-icon="true"
      status="empty"
      full-height
    />
</BasePage>
</template>